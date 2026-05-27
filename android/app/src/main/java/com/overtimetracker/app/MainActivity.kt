package com.overtimetracker.app

import android.os.Bundle
import android.webkit.JsResult
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val webView = WebView(this)
        setContentView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            setSupportMultipleWindows(false)
        }
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = object : WebChromeClient() {
            override fun onJsConfirm(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                val builder = android.app.AlertDialog.Builder(this@MainActivity)
                builder.setMessage(message)
                    .setPositiveButton("OK") { _, _ -> result?.confirm() }
                    .setNegativeButton("Cancel") { _, _ -> result?.cancel() }
                    .setOnCancelListener { result?.cancel() }
                    .show()
                return true
            }
        }
        WebView.setWebContentsDebuggingEnabled(true)
        webView.loadUrl("file:///android_asset/index.html")
    }

    override fun onBackPressed() {
        val wv = findViewById<WebView>(android.R.id.content).getChildAt(0) as? WebView
        if (wv?.canGoBack() == true) wv.goBack() else super.onBackPressed()
    }
}
