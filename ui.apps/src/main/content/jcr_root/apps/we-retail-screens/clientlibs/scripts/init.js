/*
 *
 * Copyright 2016 Adobe Systems Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* globals ES6Promise */
require([
    'jquery',
    'Instore',
    'util/ScreensChannel'
], function($, Instore, Channel) {
    'use strict';

    ES6Promise.polyfill();

    var $body = $('body');

    var defaultConfig = {
        rootElement: $body,
        lang: $body.attr('lang') || 'en',
        devicePath: $body.data('devicepath') || '',
        displayPath: $body.data('displaypath') || '',
        appPath: $body.data('apppath') || '',
        display: {
            config: [1, 1],
            deviceWidth: $(window).width(),
            deviceHeight: $(window).height()
        }
    };

    // get the display data from the current channel
    $(function() {
        if (Channel.getDisplay()) {

            // On success, pass the display and device info to the app
            var handleDisplayDataSuccess = function(displayData) {
                console.log('Instore got data:', displayData);
                var config = defaultConfig;

                if (displayData.display && displayData.display.layout) {
                    var displayConfig = [
                        displayData.display.layout.numCols,
                        displayData.display.layout.numRows
                    ];

                    config.display = {
                        config: displayConfig,
                        deviceWidth: $(window).width() / displayConfig[0],
                        deviceHeight: $(window).height() / displayConfig[1]
                    };
                }
                config.devicePath = displayData.device && displayData.device.path;
                config.displayPath = displayData.display && displayData.display.path;

                window.instore = new Instore(config);
            };

            // On failure just initialize the app as is
            var handleDisplayDataFailure = function() {
                window.instore = new Instore(defaultConfig);
            };

            Channel.getDisplay().getData()
                .then(handleDisplayDataSuccess)
                .catch(handleDisplayDataFailure);

        } else {
            // defaults
            window.instore = new Instore(defaultConfig);
        }

    });

    // Conditionally disables context menu if debugClientLibs is turned off for "production" environment
    if (!/.*debugClientLibs.*/.test(window.location.search)) {
        $(document).on('MSHoldVisual', false);
        $(document).on('contextmenu', false);
    }
});
