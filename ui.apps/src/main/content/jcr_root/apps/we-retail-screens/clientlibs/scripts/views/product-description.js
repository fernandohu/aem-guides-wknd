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
define('instore/views/product-description', [
    'underscore',
    'jquery',
    'util/Util',
    'views/BaseView',
    'instore/views/star-rating',
    'instore/views/scrollable-panel',
    'instore/views/variant-list'
], function(_, $, Util, BaseView, StarRatingView, ScrollablePanelView, ProductVariantListView) {
    'use strict';

    /**
     * Default view options.
     *
     * @type {Map}
     * @static
     */
    var DEFAULT_OPTIONS = {
        width: 300,
        height: 1080
    };

    var ProductDescriptionView = BaseView.extend(/** @lends ProductDescriptionView.prototype */ {

        /**
         * Class name for the wrapping element of the view.
         *
         * @type {String}
         */
        className: 'instore-ProductDescriptionView',

        /**
         * @constructor
         * @extends BaseView
         *
         * @param {Object} [options] An object of configurable options.
         */
        constructor: function(options) {
            this._initOptions(options, DEFAULT_OPTIONS);
            ProductDescriptionView.__super__.constructor.apply(this, arguments);
        },

        /**
         * Destroy the view.
         *
         * @returns {ProductDescriptionView} The destroyed view
         */
        destroy: function() {
            if (this._scrollablePanel) {
                this._scrollablePanel.destroy();
                this._scrollablePanel = null;
            }
            return ProductDescriptionView.__super__.destroy.apply(this, arguments);
        },

        /**
         * Instantiate the template markup for the product summary with the provided data.
         *
         * @param {Product} product The product to render the template with.
         * @returns {String} the HTML string for the instantiated template
         */
        _templateSummary: function(product) {
            var tpl = _.template('<div class="instore-ProductDescriptionView-summary"><%= summary %></div>');
            return tpl({summary: product.get('summary')});
        },

        /**
         * Instantiate the template markup for the product features with the provided data.
         *
         * @param {Product} product The product to render the template with.
         * @returns {String} the HTML string for the instantiated template
         */
        _templateFeatures: function(product) {
            var tpl = _.template('<div class="instore-ProductDescriptionView-features"><%= features %></div>');
            return tpl({features: product.get('features')});
        },

        /**
         * Instantiate the template markup with the provided data.
         *
         * @param {Product} product The product to render the template with.
         * @returns {String} the HTML string for the instantiated template
         */
        _template: function(product) {
            var tpl = _.template(
                '<div class="instore-ProductDescriptionView-title"><%= title %></div>' +
                '<div class="instore-ProductDescriptionView-description"><%= description %></div>' +
                '<div class="instore-ProductDescriptionView-rating"></div>' +
                '<div class="instore-ProductDescriptionView-price"><%= price %></div>' +
                '<div class="instore-ProductDescriptionView-variants"></div>' +
                '<div class="instore-ProductDescriptionView-tabs">Description</div>' +
                '<div class="instore-ProductDescriptionView-tabs-panel"></div>'
            );
            return tpl({
                title: product.get('title'),
                description: product.get('description'),
                price: parseFloat(product.get('price')).toFixed(2),
                summary: product.get('summary'),
                features: product.get('features')
            });
        },

        /**
         * Render the view.
         *
         * @returns {ProductDescriptionView} the view
         */
        render: function() {
            // prevent re-render
            if (this.setRendered(true)) {
                return this;
            }
            this.$el
                .prepend(this._template(this.model))
                .css({
                    width: this.options.width,
                    height: this.options.height
                });

            this._scrollablePanel = new ScrollablePanelView({
                model: {
                    content: this._templateSummary(this.model) + this._templateFeatures(this.model)
                }
            });
            this.$el.find('.instore-ProductDescriptionView-tabs-panel').append(this._scrollablePanel.render().$el);

            StarRatingView.create(this.$el.find('.instore-ProductDescriptionView-rating'), {
                model: this.model
            });

            var variantAxes = this.model.get('variantAxes');
            for (var v in variantAxes) {
                this.$el.find('.instore-ProductDescriptionView-variants').append(
                    new ProductVariantListView({
                        model: this.model,
                        axis: variantAxes[v]
                    }).render().$el
                );
            }

            var self = this;
            window.setTimeout(function() {
                var $scrollablePanelContent = self.$el.find('.instore-ScrollablePanelView-content');
                var offsetBottom = _.reduce($scrollablePanelContent.parents(), function(sum, el) {
                    sum += parseFloat($(el).css('margin-bottom')) + parseFloat($(el).css('padding-bottom'));
                    return sum;
                }, 0);
                $scrollablePanelContent.css('max-height',
                    window.innerHeight - offsetBottom - $scrollablePanelContent.offset().top
                );
                self._scrollablePanel.update();
            }, 0);

            // this.$el.find('.instore-ProductDescriptionView-variants').append(
            //     new ProductVariantListView({model: this.model}).render().$el
            // );

            // this.$el.find('.instore-ProductDescriptionView-tabs').append(
            //     new TablistComponentView({
            //         tabs: {
            //             'Description': $(document.createElement('div')).html('description'),
            //             'Reviews': new ProductReviewListView({model: this.model})
            //         }
            //     }).render().$el
            // );

            return this;
        }

    });

    // return the view
    return ProductDescriptionView;

});
