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

/* globals hobs */
(function(window, hobs) {
    'use strict';

    var DEBUG = false;
    var PLAYER_PATH = '/content/mobileapps/cq-screens-player/firmware.html';

    var selectors = {
        firmware: {
            tooltip: {
                container: '.aem-ScreensPlayer-tooltip',
                inner: '.aem-ScreensPlayer-tooltip-inner'
            }
        },
        app: {
            catalog: {
                products: {
                    view: '.instore-ProductThumbnailView'
                }
            }
        }
    };

    var data = {
        app: {
            path: '/content/screens/we-retail/apps/virtual-showroom',
            image1: '/content/screens/we-retail/apps/virtual-showroom/en/women/coats/sleek-insulated-coat'
        }
    };

    new hobs.TestSuite('Screens - We.Retail Devices',
        {path: '/apps/we-retail-screens/tests/we-retail-devices.js', register: true})

        .addTestCase(new hobs.TestCase('Single display', {
            demoMode: DEBUG,
            after: hobs.screens.steps.resetContext
        })
            .navigateTo(PLAYER_PATH + '/content/screens/we-retail/locations/demo/flagship/single/device0')
            .wait(3000)
            .asserts.exists(selectors.firmware.tooltip.inner + ':eq(0)')
            .asserts.exists(selectors.firmware.tooltip.inner + ':eq(1)')
            .click(selectors.firmware.tooltip.container) // switch to we-retail app
            .wait(3000)
            .screens.setChannelContext()
            .asserts.exists('body[data-apppath="' + data.app.path + '"]') // app must be loaded
            .asserts.isInViewport(selectors.app.catalog.products.view + '[data-path="' + data.app.image1 + '"]', false) // first image product should not be in viewport
        )

        .addTestCase(new hobs.TestCase('Dual display', {
            demoMode: DEBUG,
            after: hobs.screens.steps.resetContext
        })
            .navigateTo(PLAYER_PATH + '/content/screens/we-retail/locations/demo/flagship/dual/device0')
            .wait(3000)
            .asserts.exists(selectors.firmware.tooltip.inner + ':eq(0)')
            .asserts.exists(selectors.firmware.tooltip.inner + ':eq(1)')
            .asserts.exists(selectors.firmware.tooltip.inner + ':eq(2)')
            .click(selectors.firmware.tooltip.container) // switch to we-retail app
            .wait(3000)
            .screens.setChannelContext()
            .asserts.exists('body[data-apppath="' + data.app.path + '"]') // app must be loaded
            .asserts.isInViewport(selectors.app.catalog.products.view + '[data-path="' + data.app.image1 + '"]') // some products should be in viewport
        );

}(window, hobs));
