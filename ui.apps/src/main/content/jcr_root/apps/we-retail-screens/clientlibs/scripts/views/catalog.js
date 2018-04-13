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
define('instore/views/catalog', [
    'underscore',
    'jquery',
    'util/Util',
    'views/BaseView',
    'instore/views/category',
    'instore/views/catalog-cover',
    'scroll/ScrollView'
], function(_, $, Util, BaseView, CategoryView, CatalogCoverView, ScrollView) {
    'use strict';

    /**
     * Default view options.
     *
     * @type {Map}
     * @static
     */
    var DEFAULT_OPTIONS = {
        width: 1920,
        height: 1080
    };

    var CatalogView = BaseView.extend(/** @lends CatalogView.prototype */ {

        /**
         * Class name for the wrapping element of the view.
         *
         * @type {String}
         */
        className: 'instore-CatalogView',

        /**
         * @constructor
         * @extends BaseView
         *
         * @param {Object} [options] An object of configurable options.
         */
        constructor: function(options) {
            this._initOptions(options, DEFAULT_OPTIONS);
            CatalogView.__super__.constructor.apply(this, arguments);
        },

        /**
         * Generic initialization for this view
         */
        initialize: function() {
            this._views = [];
        },

        /**
         * Destroy the view.
         *
         * @returns {CatalogView} the destroyed view
         */
        destroy: function() {
            if (this._views) {
                this._views = null;
            }
            return CatalogView.__super__.destroy.apply(this, arguments);
        },

        /**
         * Render a category.
         *
         * @param {Category} category The category model for the view
         * @returns {CatalogCoverView} the category view
         */
        _renderCategory: function(category) {
            var categoryView = new CategoryView({
                model: category,
                width: this.options.display.deviceWidth / 2,
                height: this.options.display.deviceHeight,
                display: this.options.display
            }).render();
            this._views.push(categoryView);
            return categoryView;
        },

        /**
         * Render the view.
         *
         * @returns {CatalogView} the view
         */
        render: function() {
            // prevent re-render
            if (this.setRendered(true)) {
                return this;
            }
            this.scrollview = new ScrollView(this.$el, {
                direction: ScrollView.DIRECTION_X,
                edgeMargin: [0, 0],
                snap: true,
                maxPointers: 2
            });
            this.coverView = new CatalogCoverView({
                model: this.model,
                width: this.options.display.deviceWidth,
                height: this.options.display.deviceHeight
            });
            this._views.push(this.coverView.render());
            _.each(this.model.get('categories').models, this._renderCategory, this);
            this.scrollview.splice(_.map(this._views, function(v) {
                return v.el;
            }));
            this.invalidate();
            return this;
        },

        invalidate: function() {
            var self = this;
            window.requestAnimationFrame(function() {
                self.scrollview.recalculateSize();
                self.scrollview.invalidateAll();
            });
            return this;
        }

    });

    // return the view
    return CatalogView;

});
