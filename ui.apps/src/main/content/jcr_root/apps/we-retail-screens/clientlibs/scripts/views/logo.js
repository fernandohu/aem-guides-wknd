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
define('instore/views/logo', [
    'underscore',
    'jquery',
    'util/Util',
    'views/BaseView'
], function(_, $, Util, BaseView) {
    'use strict';

    var LogoView = BaseView.extend(/** @lends LogoView.prototype */ {

        /**
         * Class name for the wrapping element of the view.
         *
         * @type {String}
         */
        className: 'instore-LogoView',

        /**
         * Render the view.
         *
         * @returns {LogoView} the view
         */
        render: function() {
            var imgSrc = Granite.HTTP.externalize('/content/dam/we-retail-screens/we-retail-instore-logo.png');
            this.$el.html('<img src="' + imgSrc + '" alt="" title="We.Retail Instore"/>');
            return this;
        }
    });

    // return the view
    return LogoView;
});
