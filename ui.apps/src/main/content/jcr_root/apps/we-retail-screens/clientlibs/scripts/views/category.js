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
define('instore/views/category', [
    'underscore',
    'jquery',
    'util/Util',
    'views/BaseView',
    'instore/views/product-hero',
    'ux/views/SwipeGridView',
    'instore/views/product-fullscreen'
], function(_, $, Util, BaseView, ProductView, SwipeGridView, ProductFullscreenView) {
    'use strict';

    /**
     * Default view options.
     *
     * @type {Map}
     * @static
     */
    var DEFAULT_OPTIONS = {
        width: 1920,
        height: 1080,
        fullscreenParent: '.instore-App'
    };

    var CategoryView = BaseView.extend(/** @lends CategoryView.prototype */ {

        /**
         * Class name for the wrapping element of the view.
         *
         * @type {String}
         */
        className: 'instore-CategoryView',

        /**
         * Events that the view handles.
         *
         * @type {Map}
         */
        events: {
            'product-activate': '_handleProductActivation'
        },

        /**
         * @constructor
         * @extends BaseView
         *
         * @param {Object} [options] An object of configurable options.
         */
        constructor: function(options) {
            this._initOptions(options, DEFAULT_OPTIONS);
            CategoryView.__super__.constructor.apply(this, arguments);
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
         * @returns {CategoryView} The destroyed view
         */
        destroy: function() {
            if (this._views) {
                this._views = null;
            }

            if (this._swipeView) {
                this._swipeView.destroy();
                this._swipeView = null;
            }

            if (this._productFullscreenView) {
                this._productFullscreenView.destroy();
                this._productFullscreenView = null;
            }
            return CategoryView.__super__.destroy.apply(this, arguments);
        },

        /**
         * Retrieve the view for the specified coordinates in the SwipeGridView.
         *
         * @param {Integer} x the column coordinates
         * @param {Integer} y the row coordinates
         * @returns {Backbone.View|null} the backbone view at the specified coordinates, or null
         */
        provide: function(x, y) {
            if (y < 0) {
                return null;
            }
            if (y < this._views.length) {
                var v = this._views[y];
                return v.el || v;
            }
            return null;
        },

        /**
         * Handle the activation of a product and open its fullscreen view.
         *
         * @param {Event} ev The event that triggered the action
         * @param {Product} product The product that was activated
         * @param {Integer} displayNo The index of the display the product was activated on
         */
        _handleProductActivation: function(ev, product, displayNo) {
            this._productFullscreenView = new ProductFullscreenView({
                model: product,
                category: this.model,
                left: displayNo * this.options.display.deviceWidth,
                width: this.options.display.deviceWidth,
                height: this.options.display.deviceHeight
            });
            $(this.options.fullscreenParent).append(this._productFullscreenView.render().$el);
            this._productFullscreenView.open($(ev.target).find('.instore-ProductThumbnailView'));
            this._productFullscreenView.$el.on('select-product', this._handleProductSelection.bind(this));
        },

        /**
         * Handle the selection of a product and update the swipe view position accordingly.
         *
         * @param {Event} ev The event that triggered the action
         * @param {Product} product The product that was selected
         */
        _handleProductSelection: function(ev, product) {
            var idx = this.indexOf(product);
            if (idx >= 0) {
                var self = this;
                self._swipeView.moveTo(0, idx).then(null, function() {
                    self._swipeView.set(0, idx);
                });
            }
        },

        /**
         * Finds the index of the product in this views list.
         *
         * @param {ProductModel} productModel The product to look for
         *
         * @returns {Number} the index or -1 if not found
         */
        indexOf: function(productModel) {
            for (var index = 0; index < this._views.length; index++) {
                if (this._views[index].model === productModel) {
                    return index;
                }
            }
            return -1;
        },

        /**
         * Instantiate the template markup with the provided data.
         *
         * @param {Category} category The category to render the template with.
         * @returns {String} the HTML string for the instantiated template
         */
        _template: function(category) {
            var tpl = _.template('<div class="instore-CategoryView-title"><%= category.get("title") %></div>');
            return tpl({category: category});
        },

        /**
         * Render a product.
         *
         * @param {Product} product the product to render
         *
         * @returns {ProductView} the product view
         */
        _renderProduct: function(product) {
            var productView = new ProductView({
                model: product,
                width: this.options.width,
                height: this.options.height,
                display: this.options.display
            });
            this._views.push(productView.render());
            return productView;
        },

        /**
         * Render the view.
         *
         * @returns {CategoryView} the view
         */
        render: function() {
            // prevent re-render
            if (this.setRendered(true)) {
                return this;
            }
            this._swipeView = new SwipeGridView({
                direction: SwipeGridView.SWIPE_DIRECTION_Y,
                provider: this,
                width: this.options.width,
                height: this.options.height,
                maxPointers: 2
            }).render();

            _.each(this.model.get('products').models, this._renderProduct, this);
            this.$el
                .append(this._swipeView.el)
                .css({
                    width: this.options.width,
                    height: this.options.height
                });
            return this;
        }

    });

    // return the view
    return CategoryView;

});
