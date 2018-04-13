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
package com.adobe.cq.screens.player.storage;

import android.os.Environment;
import android.os.StatFs;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class PlayerStorage extends CordovaPlugin {

    /**
     * Constructor.
     */
    public PlayerStorage() {
    }

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action          The action to execute.
     * @param args            JSONArray of arguments for the plugin.
     * @param callbackContext The callback id used when calling back into JavaScript.
     * @return True if the action was valid, false if not.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("getUsage".equals(action)) {
            String dataDirectory = cordova.getActivity().getFilesDir().getAbsolutePath();
            StatFs stat = new StatFs(dataDirectory);

            JSONObject r = new JSONObject();
            r.put("path", dataDirectory);
            r.put("volume", Environment.getDataDirectory().getName());
            r.put("free", stat.getAvailableBytes());
            r.put("used", stat.getTotalBytes() - stat.getFreeBytes());
            r.put("total", stat.getTotalBytes());
            callbackContext.success(r);
            return true;
        }
        return false;
    }
}