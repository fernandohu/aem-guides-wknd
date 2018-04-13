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
define('instore/views/product-thumbnail', [
    'underscore',
    'jquery',
    'util/Util',
    'views/BaseView'
], function(_, $, Util, BaseView) {
    'use strict';

    /**
     * Default view options.
     *
     * @type {Map}
     * @static
     */
    var DEFAULT_OPTIONS = {
    };

    var ProductThumbnailView = BaseView.extend(/** @lends ProductThumbnailView.prototype */ {

        /**
         * Class name for the wrapping element of the view.
         *
         * @type {String}
         */
        className: 'instore-ProductThumbnailView',

        /**
         * @constructor
         * @extends BaseView
         *
         * @param {Object} [options] An object of configurable options.
         */
        constructor: function(options) {
            this._initOptions(options, DEFAULT_OPTIONS);
            ProductThumbnailView.__super__.constructor.apply(this, arguments);
        },

        /**
         * Render the view.
         *
         * @returns {ProductThumbnailView} the view
         */
        render: function() {
            // prevent re-render
            if (this.setRendered(true)) {
                return this;
            }
            this.$el.css('background-image', 'url("' + Granite.HTTP.externalize(this.model.get('imageHref')) +
                (this.options.rendition || '') + '")');
            this.$el.attr('data-path', this.model.get('path'));
            this.$el.toggleClass('active', this.options.active);
            return this;
        }

    });

    // return the view
    return ProductThumbnailView;

});
