/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * __________________
 *
 *  Copyright 2016 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 ************************************************************************/
package com.adobe.aem.screens.player.videoplayer;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaInterface;

import java.net.URL;
import java.util.Map;
import java.util.HashMap;
import java.net.MalformedURLException;
import java.lang.reflect.Method;

import android.net.Uri;
import android.view.SurfaceHolder;
import android.webkit.CookieManager;
import android.view.SurfaceView;
import android.widget.ViewAnimator;
import android.media.MediaPlayer;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;
import android.app.Activity;
import com.adobe.aem.screens.player.LaunchActivity;
import jk.cordova.plugin.kiosk.KioskActivity;

public class VideoPlayer extends CordovaPlugin implements
        MediaPlayer.OnCompletionListener, MediaPlayer.OnPreparedListener,
        MediaPlayer.OnErrorListener, MediaPlayer.OnBufferingUpdateListener,
        MediaPlayer.OnInfoListener, SurfaceHolder.Callback {
    public static final String ACTION_PLAY_VIDEO = "playVideo";
    private static final int ACTIVITY_CODE_PLAY_MEDIA = 7;
    private CallbackContext callbackContext;
    private static final String TAG = "ScreensVideoPlayer";

    private ViewAnimator viewAnimator = null;
    private SurfaceView surfaceView = null;
    private View webview = null;
    private MediaPlayer mediaPlayer = null;
    private JSONObject options = null;

    private Object xwalkCookieManager = null;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        Activity launchActivity = cordova.getActivity();

        if (launchActivity instanceof LaunchActivity) {
            Log.d(TAG, "This player is not in Kiosk Mode");
            this.surfaceView = ((LaunchActivity) launchActivity).getSurfaceView();
            this.viewAnimator = ((LaunchActivity) launchActivity).getViewAnimator();
        }
        else if (launchActivity instanceof KioskActivity) {
            Log.d(TAG, "This player is in Kiosk Mode");
            this.surfaceView = ((KioskActivity) launchActivity).getSurfaceView();
            this.viewAnimator = ((KioskActivity) launchActivity).getViewAnimator();
        }

        if ((this.surfaceView == null) || (this.viewAnimator == null)) {
            return;
        }

        surfaceView.getHolder().addCallback(this);
        this.webview = this.viewAnimator.getChildAt(0);

        // Listen to long press and touch events
        this.surfaceView.setOnTouchListener(new OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                final int action = event.getAction();
                webview.dispatchTouchEvent(MotionEvent.obtain(event));

                switch (action & MotionEvent.ACTION_MASK) {
                    case MotionEvent.ACTION_UP: {
                        closeVideo();
                    }
                }
                return true;
            }
        });

        try {
            Class<?> XWalkCookieManager = Class.forName("org.xwalk.core.XWalkCookieManager");
            this.xwalkCookieManager = XWalkCookieManager.newInstance();
        }
        catch(Exception e) {
            Log.i(TAG, "This player does not use XWalk");
        }
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        this.callbackContext = callbackContext;

        try {
            if ((this.surfaceView == null) || (this.viewAnimator == null)) {
                callbackContext.error("Could not initialize Native Video plugin.");
                return false;
            }

            if (args.length() < 2) {
                callbackContext.error("Invalid parameters. Please pass the video URL and callback options.");
                return false;
            }
            options = args.getJSONObject(1);
        } catch (JSONException e) {
            PluginResult result = new PluginResult(PluginResult.Status.ERROR,
                    "Error reading parameters");
            result.setKeepCallback(false);
            callbackContext.sendPluginResult(result);
            return false;
        }

        if (ACTION_PLAY_VIDEO.equals(action)) {
            PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
            play(args.getString(0), options);
            return true;
        } else {
            callbackContext.error("videoplayer." + action + " is not a supported method.");
            return false;
        }
    }

    private void closeVideo() {
        if (this.mediaPlayer == null) {
            return; //Discard any late events after an exit is triggered
        }

        if (this.mediaPlayer.isPlaying()) {
            mediaPlayer.stop();
            mediaPlayer.reset();
            mediaPlayer.release();
            this.mediaPlayer = null;
        }

        JSONObject response = new JSONObject();
        PluginResult result = null;
        try {
            response.put("id", options.get("id"));
            response.put("success", false);
            response.put("message", "video-close-event");
            result = new PluginResult(PluginResult.Status.ERROR, response);
        } catch (JSONException je) {
            result = new PluginResult(PluginResult.Status.ERROR, "video-close-event");
        }

        result.setKeepCallback(false);
        callbackContext.sendPluginResult(result);
        callbackContext = null;

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                viewAnimator.showPrevious();
                Log.d(TAG, "Returning to webview on user interrupt");
            }
        });
    }

    private void play(final String url, final JSONObject options) {
        final Uri videoUri = Uri.parse(url); //Video URL to play

        // TODO Implement queueing?
        if (this.mediaPlayer != null) {
            Log.e(TAG, "Request to play video when another video is playing");
            return;
        }

        this.mediaPlayer = new MediaPlayer();
        mediaPlayer.setOnCompletionListener(this);
        mediaPlayer.setOnPreparedListener(this);
        mediaPlayer.setOnErrorListener(this);
        mediaPlayer.setOnInfoListener(this);
        mediaPlayer.setOnBufferingUpdateListener(this);

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                viewAnimator.showNext();
                try {
                    Map<String, String> params = getCookies(url);
                    if (params != null) {
                        mediaPlayer.setDataSource(cordova.getActivity(), videoUri, params);
                    } else {
                        mediaPlayer.setDataSource(url);
                    }
                    mediaPlayer.prepareAsync();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            public Map<String, String> getCookies(String url) throws MalformedURLException {
                //Get session cookies for the URL's domain if any
                Map<String, String> params = new HashMap<String, String>(1);
                URL mediaurl = new URL(url);
                String baseUrl = mediaurl.getProtocol() + "://" + mediaurl.getHost();
                String cookies = null;

                if (xwalkCookieManager != null) {
                    try {
                        Method getCookie=xwalkCookieManager.getClass().getMethod("getCookie", String.class);
                        cookies = (String) getCookie.invoke(xwalkCookieManager, baseUrl);

                    }
                    catch(Exception e) {
                        Log.e(TAG, "Unable to read cookies from Xwalk");
                    }
                }
                else {
                    CookieManager cookieManager = CookieManager.getInstance();
                    if (cookieManager.hasCookies()) {
                        cookies = cookieManager.getCookie(baseUrl);
                    }
                }

                if (cookies != null) {
                    params.put("Cookie", cookies);
                    Log.d(TAG, cookies);
                    return params;
                }

                Log.d(TAG, "No cookies found");
                return null;
            }
        });
    }

    @Override
    public void onPrepared(MediaPlayer mp) {
        Log.d(TAG, "Stream is prepared");
        mp.setDisplay(surfaceView.getHolder());
        surfaceView.requestFocus();
        mp.start();
    }

    public void onCompletion(MediaPlayer mp) {
        Log.d(TAG, "Video completed successfully");
        if (mp != null) {
            mp.stop();
            mp.reset();
            mp.release();
            this.mediaPlayer = null;
        }

        JSONObject response = new JSONObject();
        PluginResult result = null;
        try {
            response.put("id", this.options.get("id"));
            response.put("success", true);
            response.put("message", "Video finished playing successfully");
            result = new PluginResult(PluginResult.Status.OK, response);
        } catch (JSONException je) {
            result = new PluginResult(PluginResult.Status.ERROR, "Error sending response");
        }
        result.setKeepCallback(false);
        this.callbackContext.sendPluginResult(result);
        this.callbackContext = null;

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                viewAnimator.showPrevious();
            }
        });
    }

    private void pause() {
        Log.d(TAG, "Pausing video.");
        mediaPlayer.pause();
    }

    private void stop() {
        Log.d(TAG, "Stopping video.");
        mediaPlayer.stop();
    }

    public boolean onInfo(MediaPlayer mp, int what, int extra) {
        StringBuilder sb = new StringBuilder();
        sb.append("MediaPlayer Info: ");
        switch (what) {
            case MediaPlayer.MEDIA_INFO_BUFFERING_START:
                sb.append("Buffering started");
                break;
            case MediaPlayer.MEDIA_INFO_BUFFERING_END:
                sb.append("Buffering Ended");
                break;
            case MediaPlayer.MEDIA_INFO_VIDEO_RENDERING_START:
                sb.append("Rendering started");
                break;
            case MediaPlayer.MEDIA_INFO_NOT_SEEKABLE:
                sb.append("Media not seekable");
                break;
            case MediaPlayer.MEDIA_INFO_METADATA_UPDATE:
                sb.append("Metadata Update");
                break;
            case MediaPlayer.MEDIA_INFO_UNSUPPORTED_SUBTITLE:
                sb.append("Unsupported Subtitle");
                break;
            case MediaPlayer.MEDIA_INFO_SUBTITLE_TIMED_OUT:
                sb.append("Subtitle Timed Out");
                break;
            case MediaPlayer.MEDIA_INFO_VIDEO_TRACK_LAGGING:
                sb.append("Video Track Lagging");
                break;
            case MediaPlayer.MEDIA_INFO_UNKNOWN:
                sb.append("Unknown");
                break;
            default:
                sb.append(" Non standard (");
                sb.append(what);
                sb.append(")");
        }
        sb.append(" (" + what + ") ");
        sb.append(extra);
        Log.i(TAG, sb.toString());

        return true;
    }

    public boolean onError(MediaPlayer mp, int what, int extra) {
        Log.d(TAG, "Video completed with error");
        StringBuilder sb = new StringBuilder();
        sb.append("MediaPlayer Error: ");
        switch (what) {
            case MediaPlayer.MEDIA_ERROR_NOT_VALID_FOR_PROGRESSIVE_PLAYBACK:
                sb.append("Not Valid for Progressive Playback");
                break;
            case MediaPlayer.MEDIA_ERROR_SERVER_DIED:
                sb.append("Server Died");
                break;
            case MediaPlayer.MEDIA_ERROR_UNKNOWN:
                sb.append("Unknown");
                break;
            default:
                sb.append(" Non standard (");
                sb.append(what);
                sb.append(")");
        }
        sb.append(" (" + what + ") ");
        sb.append(extra);
        Log.e(TAG, sb.toString());

        if (mp != null) {
            mp.stop();
            mp.reset();
            mp.release();
            this.mediaPlayer = null;
        }

        JSONObject response = new JSONObject();
        PluginResult result = null;
        try {
            response.put("id", this.options.get("id"));
            response.put("success", false);
            response.put("message", sb.toString());
            result = new PluginResult(PluginResult.Status.ERROR, response);
        } catch (JSONException je) {
            result = new PluginResult(PluginResult.Status.ERROR, sb.toString());
        }

        result.setKeepCallback(false);
        this.callbackContext.sendPluginResult(result);
        this.callbackContext = null;

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                viewAnimator.showPrevious();
                Log.d(TAG, "Returning to webview");
            }
        });

        return true;
    }

    public void onBufferingUpdate(MediaPlayer mp, int percent) {
        Log.d(TAG, "Buffering : " + percent + "%");
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        Log.i(TAG, "Surface View created");
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        Log.i(TAG, "Surface View changed");
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        Log.i(TAG, "Surface View destroyed");
    }
}
