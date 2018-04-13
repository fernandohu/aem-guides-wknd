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

    var selectors = {
        authoring: {
            editModeTrigger: '.js-editor-LayerSwitcherTrigger:eq(0)',
            sidePanel: {
                components: {
                    component: '#SidePanel .sidepanel-tab-components .content-panel coral-masonry-item,#SidePanel .sidepanel-tab-components .content-panel [data-type="Component"]'
                },
                trigger: '.js-editor-SidePanel-toggle',
                componentsTab: '#SidePanel coral-tab[icon="treeExpandAll"],#SidePanel a[data-toggle="tab"][title="Components"]',
                closed: '#SidePanel.sidepanel-closed',
                opened: '#SidePanel.sidepanel-opened'
            }
        }
    };

    new hobs.TestSuite('Screens - We.Retail Authoring',
        {path: '/apps/we-retail-screens/tests/we-retail-authoring.js', register: true})

        .addTestCase(new hobs.TestCase('Sequence - Allowed Components', {demoMode: DEBUG})
            .navigateTo('/editor.html/content/screens/we-retail/channels/idle.html')
            .asserts.isTrue(function() {
                var win = hobs.context().window;
                var components = win.Granite.author.components.allowedComponents;
                return components && components.length > 0;
            })
            .asserts.isTrue(function() {
                var win = hobs.context().window;
                var components = win.Granite.author.components.allowedComponentsFor;
                return components['/content/screens/we-retail/channels/idle/jcr:content/par'] &&
                    components['/content/screens/we-retail/channels/idle/jcr:content/par'].length > 0;
            })
            .asserts.isTrue(function() {
                var $ = hobs.context().window.$;
                var opened = $(selectors.authoring.sidePanel.opened);
                if (opened.length > 0) {
                    // make sure panel is closed
                    $(selectors.authoring.sidePanel.trigger).click();
                }
                return $(selectors.authoring.sidePanel.closed).length > 0;
            })
            .click(selectors.authoring.editModeTrigger)
            .click(selectors.authoring.sidePanel.trigger)
            .click(selectors.authoring.sidePanel.componentsTab)
            .asserts.exists(selectors.authoring.sidePanel.components.component)
            .click(selectors.authoring.sidePanel.trigger)
        );

}(window, hobs));
