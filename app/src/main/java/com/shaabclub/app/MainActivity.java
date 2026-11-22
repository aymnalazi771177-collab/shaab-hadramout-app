package com.shaabclub.app;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.Window;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_NO_TITLE);
        getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(Color.rgb(181, 18, 27)));
        getWindow().setStatusBarColor(Color.rgb(181, 18, 27));
        getWindow().setNavigationBarColor(Color.BLACK);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(181, 18, 27));

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(181, 18, 27));
        webView.setAlpha(0f);
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
        webView.setWebViewClient(new WebViewClient() {
            private boolean revealed = false;
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (revealed) return;
                revealed = true;
                view.animate().alpha(1f).setDuration(260).start();
                ImageView nativeSplash = (ImageView) root.findViewWithTag("native-club-splash");
                if (nativeSplash != null) {
                    nativeSplash.animate().alpha(0f).setDuration(300).withEndAction(() -> root.removeView(nativeSplash)).start();
                }
            }
        });

        root.addView(webView, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));

        ImageView nativeSplash = new ImageView(this);
        nativeSplash.setTag("native-club-splash");
        nativeSplash.setImageResource(R.mipmap.ic_launcher);
        nativeSplash.setScaleType(ImageView.ScaleType.FIT_CENTER);
        nativeSplash.setPadding(dp(28), dp(28), dp(28), dp(28));
        GradientDrawable logoPlate = new GradientDrawable();
        logoPlate.setShape(GradientDrawable.OVAL);
        logoPlate.setColor(Color.WHITE);
        logoPlate.setStroke(dp(1), Color.rgb(245, 225, 225));
        nativeSplash.setBackground(logoPlate);
        nativeSplash.setElevation(dp(8));
        FrameLayout.LayoutParams splashParams = new FrameLayout.LayoutParams(dp(156), dp(156), Gravity.CENTER);
        root.addView(nativeSplash, splashParams);

        setContentView(root);
        webView.loadUrl("file:///android_asset/index.html");
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
}
