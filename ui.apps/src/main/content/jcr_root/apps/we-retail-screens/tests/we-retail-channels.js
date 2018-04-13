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
        sequence: {
            item: '.cq-Sequence-item'
        },
        firmware: {
            tooltip: '.aem-ScreensPlayer-tooltip',
            osd: {
                trigger: '.aem-ScreensPlayer-osd-trigger',
                close: '.aem-ScreensPlayer-osd-close',
                visible: '.aem-ScreensPlayer-osd.is-visible',
                hidden: '.aem-ScreensPlayer-osd.is-hidden',
                button: '.aem-ScreensPlayer-osd-channelButton'
            }
        },
        app: {
            catalog: {
                cover: {
                    view: '.instore-CatalogView:last .instore-CatalogCoverView',
                    background: '.instore-CatalogView-background'
                }
            }
        },
        zones: {
            channels: '.screens-Channel',
            a1: '#screens-zone-a1',
            a2: '#screens-zone-a2'
        },
        channels: {
            idleNight: {
                item: '.cq-Sequence-item',
                image1: '.cq-Sequence-item:first'
            }
        }
    };

    var data = {
        app: {
            path: '/content/screens/we-retail/apps/virtual-showroom'
        },
        channels: {
            idleNight: {
                role: 'idle-night'
            }
        },
        firmware: {
            osd: {
                trigger: {
                    clickX: 25,
                    clickY: 25
                }
            }
        }
    };

    function getOSDTrigger() {
        var context = hobs.context();
        var $ = context.window.$;
        var doc = context.window.document;
        var y = $(document).height() - data.firmware.osd.trigger.clickY;
        var els = hobs.utils.elementsFromPoint(data.firmware.osd.trigger.clickX, y, doc);

        return $(els[0]);
    }

    new hobs.TestSuite('Screens - We.Retail Channels',
        {path: '/apps/we-retail-screens/tests/we-retail-channels.js', register: true})

        .addTestCase(new hobs.TestCase('Idle channel sequence', {
            demoMode: DEBUG,
            after: hobs.screens.steps.resetContext
        })
            .navigateTo(PLAYER_PATH + '/content/screens/we-retail/locations/demo/flagship/single/device0?date=' + new Date(new Date().setHours(10)).toISOString())
            .wait(3000)
            .screens.setChannelContext()
            .asserts.exists(selectors.sequence.item + ':eq(3)')
            .asserts.exists(selectors.sequence.item + ':eq(4)', false)
            .asserts.exists(selectors.sequence.item + ':eq(0):visible')
            .asserts.exists(selectors.sequence.item + ':eq(1):hidden')
            .asserts.exists(selectors.sequence.item + ':eq(2):hidden')
            .asserts.exists(selectors.sequence.item + ':eq(3):hidden')
            .wait(3000)
            .asserts.exists(selectors.sequence.item + ':eq(0):hidden')
            .asserts.exists(selectors.sequence.item + ':eq(1):visible')
            .asserts.exists(selectors.sequence.item + ':eq(2):hidden')
            .asserts.exists(selectors.sequence.item + ':eq(3):hidden')
            .wait(3000)
            .asserts.exists(selectors.sequence.item + ':eq(0):hidden')
            .asserts.exists(selectors.sequence.item + ':eq(1):hidden')
            .asserts.exists(selectors.sequence.item + ':eq(2):visible')
            .asserts.exists(selectors.sequence.item + ':eq(3):hidden')
            .wait(3000)
            .asserts.exists(selectors.sequence.item + ':eq(0):hidden')
            .asserts.exists(selectors.sequence.item + ':eq(1):hidden')
            .asserts.exists(selectors.sequence.item + ':eq(2):hidden')
            .asserts.exists(selectors.sequence.item + ':eq(3):visible')
            .wait(3000)
            .asserts.exists(selectors.sequence.item + ':eq(0):visible')
            .asserts.exists(selectors.sequence.item + ':eq(1):hidden')
            .asserts.exists(selectors.sequence.item + ':eq(2):hidden')
            .asserts.exists(selectors.sequence.item + ':eq(3):hidden')
        )

        .addTestCase(new hobs.TestCase('Idle-Night channel sequence', {
            demoMode: DEBUG,
            after: hobs.screens.steps.resetContext
        })
            .navigateTo(PLAYER_PATH + '/content/screens/we-retail/locations/demo/flagship/single/device0?date=' + new Date(new Date().setHours(20)).toISOString())
            .wait(3000)
            .screens.setChannelContext()
            .asserts.exists(selectors.sequence.item + ':eq(1)')
            .asserts.exists(selectors.sequence.item + ':eq(2)', false)
            .asserts.exists(selectors.sequence.item + ':eq(0):visible')
            .asserts.exists(selectors.sequence.item + ':eq(1):hidden')
            .wait(3000)
            .asserts.exists(selectors.sequence.item + ':eq(0):hidden')
            .asserts.exists(selectors.sequence.item + ':eq(1):visible')
            .wait(3000)
            .asserts.exists(selectors.sequence.item + ':eq(0):visible')
            .asserts.exists(selectors.sequence.item + ':eq(1):hidden')
        )

        .addTestCase(new hobs.TestCase('Attraction loop', {
            demoMode: DEBUG,
            after: hobs.screens.steps.resetContext
        })
            .navigateTo(PLAYER_PATH + '/content/screens/we-retail/locations/demo/flagship/single/device0')
            .wait(3000)
            .screens.setFirmwareContext()
            .click(selectors.firmware.tooltip)
            .wait(3000)
            .screens.setChannelContext()
            .asserts.exists('body[data-apppath="' + data.app.path + '"]')
            .asserts.isVisible([selectors.app.catalog.cover.view + ':first',
                selectors.app.catalog.cover.background].join(' '))
            .asserts.isInViewport([selectors.app.catalog.cover.view + ':first',
                selectors.app.catalog.cover.background].join(' '))

        )

        .addTestCase(new hobs.TestCase('Dual zone', {
            demoMode: DEBUG,
            after: hobs.screens.steps.resetContext
        })
            .navigateTo(PLAYER_PATH + '/content/screens/we-retail/locations/demo/flagship/zdual/device0')
            .wait(3000)
            .screens.setDisplayContext()
            .asserts.exists(selectors.zones.channels + ':eq(1)')
            .asserts.exists(selectors.zones.channels + ':eq(2)', false)
            .asserts.exists('iframe' + selectors.zones.a1)
            .asserts.exists('iframe' + selectors.zones.a2)
            .screens.setChannelContext(0)
            .asserts.exists(selectors.sequence.item + ':eq(1)')
            .asserts.exists(selectors.sequence.item + ':eq(2)', false)
            .screens.setChannelContext(1)
            .asserts.exists(selectors.sequence.item + ':eq(1)')
            .asserts.exists(selectors.sequence.item + ':eq(2)', false)
        )

        .addTestCase(new hobs.TestCase('OSD channel switching', {
            demoMode: DEBUG,
            after: hobs.screens.steps.resetContext
        })
            .navigateTo(PLAYER_PATH + '/content/screens/we-retail/locations/demo/flagship/single/device0')
            .wait(3000)
            .asserts.exists(selectors.firmware.osd.hidden)
            .asserts.exists(selectors.firmware.osd.visible, false)
            .asserts.isTrue(function() {
                var elem = getOSDTrigger();
                // verify if elem that will be "tap hold" is the osd triggre
                return elem.length === 1 && elem.is(selectors.firmware.osd.trigger);
            })
            .execFct(function() {
                var elem = getOSDTrigger();
                elem.trigger('pointerdown');
            })
            .wait(3000) // give time for OSD trigger to react and for OSD to open
            .asserts.exists(selectors.firmware.osd.hidden, false)
            .asserts.exists(selectors.firmware.osd.visible)
            .click(selectors.firmware.osd.button + '[data-role=' + data.channels.idleNight.role + ']')
            .wait(3000) // channel needs to load
            .screens.setChannelContext()
            .asserts.isInViewport(selectors.channels.idleNight.image1)
            .screens.setFirmwareContext()
            .click(selectors.firmware.osd.close)
            .asserts.exists(selectors.firmware.osd.hidden)
            .asserts.exists(selectors.firmware.osd.visible, false)

        );

}(window, hobs));
