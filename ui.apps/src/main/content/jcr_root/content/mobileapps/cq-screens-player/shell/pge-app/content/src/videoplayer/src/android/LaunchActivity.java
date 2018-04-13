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

package com.adobe.aem.screens.player;

import android.graphics.Color;
import android.view.View;
import android.view.SurfaceView;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ViewAnimator;

public class LaunchActivity extends MainActivity {
    private ViewAnimator viewAnimator;
    private SurfaceView surfaceView;

    public ViewAnimator getViewAnimator() {
        return viewAnimator;
    }

    public SurfaceView getSurfaceView() {
        return surfaceView;
    }

    @Override
    protected void createViews() {
        //Why are we setting a constant as the ID? This should be investigated
        appView.getView().setId(View.generateViewId());
        appView.getView().setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        viewAnimator = new ViewAnimator(this);
        surfaceView = new SurfaceView(this);
        surfaceView.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        viewAnimator.addView(appView.getView());
        viewAnimator.addView(surfaceView);
        setContentView(viewAnimator);

        if (preferences.contains("BackgroundColor")) {
            int backgroundColor = preferences.getInteger("BackgroundColor", Color.BLACK);
            // Background of activity:
            appView.getView().setBackgroundColor(backgroundColor);
        }

        appView.getView().requestFocusFromTouch();
    }
}
