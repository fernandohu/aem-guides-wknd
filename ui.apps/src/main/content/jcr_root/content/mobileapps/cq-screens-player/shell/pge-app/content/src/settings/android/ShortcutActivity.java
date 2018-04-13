/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * __________________
 *
 *  Copyright 2015 Adobe Systems Incorporated
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
package com.adobe.cq.screens.player;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.adobe.aem.screens.player.R;
import com.adobe.cq.screens.player.ExportedPreferencesActivity;

public class ShortcutActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent.ShortcutIconResource icon = Intent.ShortcutIconResource.fromContext(this, R.mipmap.icon);
        Intent intent = new Intent();

        Intent launchIntent = new Intent(this,ExportedPreferencesActivity.class);

        intent.putExtra(Intent.EXTRA_SHORTCUT_INTENT, launchIntent);
        intent.putExtra(Intent.EXTRA_SHORTCUT_NAME, getText(R.string.preferences_launcher_name));
        intent.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE, icon);
        setResult(RESULT_OK, intent);

        finish();
    }
}