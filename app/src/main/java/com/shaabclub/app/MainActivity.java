package com.shaabclub.app;

import android.app.Activity;\nimport android.Manifest;\nimport android.content.pm.PackageManager;\nimport com.google.firebase.messaging.FirebaseMessaging;
import android.os.Build;
import android.os.Bundle;
import android.graphics.Color;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;

public class MainActivity extends Activity {
    private WebView webView;
    private OnBackInvokedCallback backInvokedCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(android.view.Window.FEATURE_NO_TITLE);
        getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(Color.rgb(181, 18, 27)));
        getWindow().setStatusBarColor(Color.rgb(181, 18, 27));
        getWindow().setNavigationBarColor(Color.BLACK);

        ClubFirebaseMessagingService.createNotificationChannel(this);\n        subscribeToClubTopics();\n        requestNotificationPermission();\n\n        webView = new WebView(this);
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
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient());
        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");

        // Android 13+ uses the platform back dispatcher. Route it through the
        // same app-wide JavaScript handler used by every section and viewer.
        if (Build.VERSION.SDK_INT >= 33) {
            backInvokedCallback = this::handleAppBack;
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                backInvokedCallback
            );
        }
    }

    private void subscribeToClubTopics() {\n        FirebaseMessaging.getInstance().subscribeToTopic("news");\n        FirebaseMessaging.getInstance().subscribeToTopic("matches");\n    }\n\n    private void requestNotificationPermission() {\n        if (Build.VERSION.SDK_INT >= 33 &&\n            checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {\n            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 1001);\n        }\n    }\n\n    private void handleAppBack() {
        if (webView == null) {
            finish();
            return;
        }

        webView.evaluateJavascript(
            "(function(){try{return typeof window.handleNativeBackFromApp === 'function' && window.handleNativeBackFromApp() === true;}catch(e){return false;}})()",
            value -> {
                if (!"true".equals(value) && !isFinishing()) {
                    finish();
                }
            }
        );
    }

    @Override
    public void onBackPressed() {
        // Legacy Android versions do not use OnBackInvokedDispatcher.
        if (Build.VERSION.SDK_INT < 33) {
            handleAppBack();
        } else {
            super.onBackPressed();
        }
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