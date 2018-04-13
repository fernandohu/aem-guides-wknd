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
define('instore/views/product-callout', [
    'underscore',
    'jquery',
    'util/Util',
    'views/BaseView',
    'instore/views/star-rating',
    'instore/views/scrollable-panel'
], function(_, $, Util, BaseView, StarRatingView, ScrollablePanelView) {
    'use strict';

    /**
     * Default view options.
     *
     * @type {Map}
     * @static
     */
    var DEFAULT_OPTIONS = {
        scrollLines: 6
    };

    var ProductCalloutView = BaseView.extend(/** @lends ProductCalloutView.prototype */ {

        /**
         * Class name for the wrapping element of the view.
         *
         * @type {String}
         */
        className: 'instore-ProductCalloutView',

        /**
         * Sistine options.
         *
         * @type {Object}
         */
        sistineOptions: {
            events: {
                'tap .icon-scroll': '_handleScroll'
            }
        },

        /**
         * @constructor
         * @extends BaseView
         *
         * @param {Object} [options] An object of configurable options.
         */
        constructor: function(options) {
            this._initOptions(options, DEFAULT_OPTIONS);
            ProductCalloutView.__super__.constructor.apply(this, arguments);
            this._sistine.add(new Sistine.Tap({
                eventName: 'tap',
                taps: 1,
                delegate: this.delegate,
                delegateScope: this
            }));
        },

        /**
         * Handles scrolling the product summary view.
         *
         * @param {Event} ev The event that triggered the action
         */
        _handleScroll: function(ev) {
            var $summary = this.$el.find('.instore-ProductCalloutView-summary');
            var lineHeight = parseFloat($summary.css('line-height'));
            var direction = $(ev.target).hasClass('icon-scroll--up') ? -1 : 1;
            $summary.scrollTop($summary.scrollTop() + direction * this.options.scrollLines * lineHeight);
            this.$el.find('.icon-scroll--up').toggle($summary.scrollTop() > 0);
            this.$el.find('.icon-scroll--down').toggle(
                $summary.scrollTop() + $summary.height() < $summary.get(0).scrollHeight);
        },

        /**
         * Instantiate the template markup with the provided data.
         *
         * @param {Product} product The product to render the template with.
         * @returns {String} the HTML string for the instantiated template
         */
        _template: function(product) {
            var tpl = _.template(
                '<div class="instore-ProductCalloutView-title"><%= title %></div>' +
                '<div class="instore-ProductCalloutView-rating"></div>' +
                '<div class="instore-ProductCalloutView-image"><img src="<%= imageHref %>" alt=""/></div>' +
                '<div class="instore-ProductCalloutView-price"><%= price %></div>' +
                '<div class="instore-ProductCalloutView-summary"></div>'
            );
            return tpl({
                title: product.get('title'),
                price: parseFloat(product.get('price')).toFixed(2),
                summary: product.get('summary'),
                imageHref: Granite.HTTP.externalize(product.get('imageHref') + '/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg')
            });
        },

        /**
         * Render the view.
         *
         * @returns {ProductCalloutView} the view
         */
        render: function() {
            // prevent re-render
            if (this.setRendered(true)) {
                return this;
            }
            this.$el.prepend(this._template(this.model));

            this.$el.find('.instore-ProductCalloutView-summary').append(new ScrollablePanelView({
                model: {content: this.model.get('summary')}
            }).render().$el);

            StarRatingView.create(this.$el.find('.instore-ProductCalloutView-rating'), {
                model: this.model
            });

            return this;
        }

    });

    // return the view
    return ProductCalloutView;

});
