package com.shaabclub.app;

import android.app.Activity;
import android.app.NotificationManager;
import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import android.graphics.Color;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.ServiceWorkerClientCompat;
import androidx.webkit.ServiceWorkerControllerCompat;
import androidx.webkit.WebViewFeature;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;

public class MainActivity extends Activity {
    private WebView webView;
    private WebViewAssetLoader assetLoader;
    private OnBackInvokedCallback backInvokedCallback;
    private String pendingTopic;
    private boolean pendingEnabled;
    private String pendingCallbackId;
    private String pendingNewsId;
    private String pendingGoogleCallbackId;
    private static final int GOOGLE_SIGN_IN_REQUEST = 7102;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(android.view.Window.FEATURE_NO_TITLE);
        getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(Color.rgb(181, 18, 27)));
        getWindow().setStatusBarColor(Color.rgb(181, 18, 27));
        getWindow().setNavigationBarColor(Color.BLACK);

        ClubFirebaseMessagingService.createNotificationChannel(this);

        webView = new WebView(this);
        // Serve bundled app files from a stable HTTPS origin so YouTube embeds
        // receive the HTTP Referer required by its player (error 153).
        assetLoader = new WebViewAssetLoader.Builder()
            .setDomain("shaab-hadramout.pages.dev")
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();
        // Route service-worker asset requests through the same local APK asset loader.
        // This keeps offline caching reliable inside Android WebView, not only in Chrome.
        if (WebViewFeature.isFeatureSupported(WebViewFeature.SERVICE_WORKER_BASIC_USAGE)) {
            ServiceWorkerControllerCompat.getInstance().setServiceWorkerClient(
                new ServiceWorkerClientCompat() {
                    @Override
                    public android.webkit.WebResourceResponse shouldInterceptRequest(
                        android.webkit.WebResourceRequest request) {
                        return assetLoader.shouldInterceptRequest(request.getUrl());
                    }
                }
            );
        }
        webView.setBackgroundColor(Color.rgb(181, 18, 27));
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setLoadsImagesAutomatically(true);
        webView.addJavascriptInterface(new NativePushBridge(), "ClubNativePush");
        webView.addJavascriptInterface(new NativeAuthBridge(), "ClubNativeAuth");
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public android.webkit.WebResourceResponse shouldInterceptRequest(
                WebView view, android.webkit.WebResourceRequest request) {
                android.webkit.WebResourceResponse response =
                    assetLoader.shouldInterceptRequest(request.getUrl());
                return response != null ? response : super.shouldInterceptRequest(view, request);
            }

            @Override public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                openPendingNews();
            }
        });
        setContentView(webView);
        webView.loadUrl("https://shaab-hadramout.pages.dev/assets/index.html");
        captureNotificationIntent(getIntent());

        if (Build.VERSION.SDK_INT >= 33) {
            backInvokedCallback = this::handleAppBack;
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                backInvokedCallback
            );
        }
    }

    @Override protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        captureNotificationIntent(intent);
        openPendingNews();
    }
    private void captureNotificationIntent(Intent intent) {
        if (intent == null) return;
        String id = intent.getStringExtra("newsId");
        if (id == null || id.trim().isEmpty()) {
            String target = intent.getStringExtra("url");
            if (target != null) {
                try { id = Uri.parse(target).getQueryParameter("newsId"); }
                catch (Exception ignored) {}
            }
        }
        if (id != null && id.matches("\\d+")) pendingNewsId = id;
    }
    private void openPendingNews() {
        if (webView == null || pendingNewsId == null) return;
        final String id = pendingNewsId;
        pendingNewsId = null;
        webView.postDelayed(() -> {
            if (webView != null) webView.evaluateJavascript(
                "window.openNewsFromPush && window.openNewsFromPush(" + id + ");", null);
        }, 700);
    }
    private class NativeAuthBridge {
        @JavascriptInterface
        public void signInWithGoogle(String serverClientId, String callbackId) {
            runOnUiThread(() -> {
                if (serverClientId == null || !serverClientId.endsWith(".apps.googleusercontent.com")) {
                    notifyGoogleResult(callbackId, null, "invalid_client_id");
                    return;
                }
                try {
                    GoogleSignInOptions options = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                        .requestEmail()
                        .requestIdToken(serverClientId)
                        .build();
                    GoogleSignInClient client = GoogleSignIn.getClient(MainActivity.this, options);
                    pendingGoogleCallbackId = callbackId;
                    startActivityForResult(client.getSignInIntent(), GOOGLE_SIGN_IN_REQUEST);
                } catch (Exception error) {
                    pendingGoogleCallbackId = null;
                    notifyGoogleResult(callbackId, null, "google_sign_in_start_failed");
                }
            });
        }
    }

    private void notifyGoogleResult(String callbackId, String credential, String error) {
        if (webView == null) return;
        String safeId = org.json.JSONObject.quote(callbackId == null ? "" : callbackId);
        String safeCredential = credential == null ? "null" : org.json.JSONObject.quote(credential);
        String safeError = error == null ? "null" : org.json.JSONObject.quote(error);
        runOnUiThread(() -> webView.evaluateJavascript(
            "window.__clubNativeGoogleResult && window.__clubNativeGoogleResult(" +
                safeId + "," + safeCredential + "," + safeError + ");",
            null
        ));
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != GOOGLE_SIGN_IN_REQUEST) return;
        String callbackId = pendingGoogleCallbackId;
        pendingGoogleCallbackId = null;
        try {
            GoogleSignInAccount account = GoogleSignIn.getSignedInAccountFromIntent(data)
                .getResult(ApiException.class);
            String token = account == null ? null : account.getIdToken();
            if (token == null || token.isEmpty()) {
                notifyGoogleResult(callbackId, null, "missing_id_token");
            } else {
                notifyGoogleResult(callbackId, token, null);
            }
        } catch (ApiException error) {
            notifyGoogleResult(callbackId, null,
                error.getStatusCode() == 12501 ? "cancelled" : "google_error_" + error.getStatusCode());
        } catch (Exception error) {
            notifyGoogleResult(callbackId, null, "google_sign_in_failed");
        }
    }

    private class NativePushBridge {
        @JavascriptInterface
        public void setTopicSubscription(String topic, boolean enabled, String callbackId) {
            runOnUiThread(() -> {
                if (!"news".equals(topic) && !"matches".equals(topic)) {
                    notifyPushResult(callbackId, false, "invalid_topic");
                    return;
                }
                if (enabled && Build.VERSION.SDK_INT >= 33 &&
                    checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    pendingTopic = topic;
                    pendingEnabled = enabled;
                    pendingCallbackId = callbackId;
                    requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 1001);
                    return;
                }
                if (enabled && Build.VERSION.SDK_INT >= 24) {
                    NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                    if (manager != null && !manager.areNotificationsEnabled()) {
                        notifyPushResult(callbackId, false, "notifications_disabled");
                        return;
                    }
                }
                applyTopicSubscription(topic, enabled, callbackId);
            });
        }
    }

    private void applyTopicSubscription(String topic, boolean enabled, String callbackId) {
        com.google.android.gms.tasks.Task<Void> task = enabled
            ? FirebaseMessaging.getInstance().subscribeToTopic(topic)
            : FirebaseMessaging.getInstance().unsubscribeFromTopic(topic);
        task.addOnCompleteListener(completed -> {
            if (completed.isSuccessful()) {
                notifyPushResult(callbackId, true, "");
            } else {
                notifyPushResult(callbackId, false, "firebase_error");
            }
        });
    }

    private void notifyPushResult(String callbackId, boolean success, String message) {
        if (webView == null) return;
        String safeId = org.json.JSONObject.quote(callbackId == null ? "" : callbackId);
        String safeMessage = org.json.JSONObject.quote(message == null ? "" : message);
        runOnUiThread(() -> webView.evaluateJavascript(
            "window.__clubNativePushResult && window.__clubNativePushResult(" +
                safeId + "," + success + "," + safeMessage + ");",
            null
        ));
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 1001 && pendingCallbackId != null) {
            String topic = pendingTopic;
            boolean enabled = pendingEnabled;
            String callbackId = pendingCallbackId;
            pendingTopic = null;
            pendingCallbackId = null;
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                applyTopicSubscription(topic, enabled, callbackId);
            } else {
                notifyPushResult(callbackId, false, "permission_denied");
            }
        }
    }

    private void handleAppBack() {
        if (webView == null) {
            finish();
            return;
        }
        webView.evaluateJavascript(
            "(function(){try{return typeof window.handleNativeBackFromApp === 'function' && window.handleNativeBackFromApp() === true;}catch(e){return false;}})()",
            value -> {
                if (!"true".equals(value) && !isFinishing()) finish();
            }
        );
    }

    @Override
    public void onBackPressed() {
        if (Build.VERSION.SDK_INT < 33) handleAppBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (Build.VERSION.SDK_INT >= 33 && backInvokedCallback != null) {
            getOnBackInvokedDispatcher().unregisterOnBackInvokedCallback(backInvokedCallback);
            backInvokedCallback = null;
        }
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}