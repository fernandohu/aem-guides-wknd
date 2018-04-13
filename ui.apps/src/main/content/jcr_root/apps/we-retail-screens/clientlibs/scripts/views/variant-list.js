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
define('instore/views/variant-list', [
    'underscore',
    'jquery',
    'util/Util',
    'views/BaseView',
    'instore/views/variant'
], function(_, $, Util, BaseView, ProductVariantView) {
    'use strict';

    var ProductVariantListView = BaseView.extend(/** @lends ProductVariantListView.prototype */ {

        /**
         * Class name for the wrapping element of the view.
         *
         * @type {String}
         */
        className: 'instore-VariantListView',

        /**
         * Events that the view handles.
         *
         * @type {Map}
         *
         * @returns {Map} The registered events
         */
        events: function() {
            return _.extend({}, ProductVariantListView.prototype.events, {
                'select-variant': '_handleVariantSelected'
            });
        },

        /**
         * Handle the selection of a product variant and update the view accordingly.
         *
         * @param {Event}   ev      The event that triggered the action
         * @param {Product} variant The variant that was selected
         */
        _handleVariantSelected: function(ev, variant) {
            this.$el.find('.instore-VariantView').removeClass('active');
            $(ev.target).addClass('active');
        },

        /**
         * Render a product variant.
         *
         * @param {Product} variant The variant to render
         *
         * @returns {ProductVariantView} the product variant view
         */
        _renderVariant: function(variant) {
            return new ProductVariantView({model: variant, axis: this.options.axis}).render().$el;
        },

        /**
         * Render the view.
         *
         * @returns {ProductVariantListView} the view
         */
        render: function() {
            var $el = this.$el;
            if (this.options.axis) {
                $el.append(
                    $(document.createElement('div')).addClass('instore-VariantListView-title').text(this.options.axis + ':')
                );
                var variants = this.model.get('variants');
                variants.forEach(function(v) {
                    var variantAxis = this.options.axis && v.get(this.options.axis);
                    if (variantAxis
                            && !$el.find('[data-' + this.options.axis + '="' + encodeURI(variantAxis) + '"]').length) {
                        $el.append(this._renderVariant(v));
                    }
                }, this);
            }

            this.$el.find('.instore-VariantView--color').first().addClass('active');

            return this;
        }

    });

    // return the view
    return ProductVariantListView;

});
