package com.adobe.cq.screens.player;

import com.adobe.aem.screens.player.R;

import android.app.Activity;
import android.os.Bundle;
import android.preference.PreferenceActivity;
import android.preference.PreferenceFragment;

public class ExportedPreferencesActivity extends me.apla.cordova.AppPreferencesActivity {

	public static class AppPFragment extends PreferenceFragment
	{
		@Override
		public void onCreate(final Bundle savedInstanceState)
		{
			super.onCreate(savedInstanceState);
			addPreferencesFromResource(R.xml.preferences);
		}
	}

}
