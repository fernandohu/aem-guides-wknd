package com.adobe.aem.screens.player;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.adobe.aem.screens.player.LaunchActivity;

public class StartupReceiver extends BroadcastReceiver {

    public StartupReceiver() {
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        System.out.println("StartupReceiver....");
        Intent i = new Intent(context, LaunchActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(i);
    }
}
