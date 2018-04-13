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
define('instore/models/product', [
    'underscore',
    'jquery',
    'backbone',
    'instore/models/variant'
], function(_, $, Backbone, ProductVariant) {
    'use strict';

    /**
     * @constructor
     * @augments module:Backbone.Model
     */
    var Product = Backbone.Model.extend(/** @lends Product.prototype */{

        /**
         * Default model options.
         *
         * @type {Map}
         * @static
         */
        defaults: {
            title: '',
            description: '',
            path: '',
            productPath: '',
            imageHref: '',
            variants: '',
            variantAxes: '',
            rating: 0,
            ratingCount: 0,
            summary: '',
            features: ''
        },

        /**
         * The url to fetch the full model details.
         *
         * @returns {String} the url for the collection
         */
        url: function() {
            return Granite.HTTP.externalize(this.get('productPath'));
        },

        /**
         * Generic initialization for the model.
         *
         * @param {Map} [options] Options for the model.
         */
        initialize: function(options) {
            if (!this.get('variants')) {
                this.set('variants', []);
            }
        },

        /**
         * Parse the specified content into a model.
         *
         * @param {String|Object} response A string representation or the actual model to be parsed.
         * @returns {Product} the parsed model
         */
        parse: function(response) {
            var product = $.isPlainObject(response) ? response : JSON.parse(response);
            var variants = [];
            var variant;
            for (var v in product.variants) {
                variant = product.variants[v];
                variants.push(new ProductVariant(variant));
            }
            product.variants = variants;

            return product;
        }

    });

    // return the model
    return Product;

});
