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
define('instore/collections/catalogs', [
    'underscore',
    'jquery',
    'backbone',
    'instore/models/catalog',
    'instore/collections/categories'
], function(_, $, Backbone, Catalog, CategoryCollection) {
    'use strict';

    /**
     * @constructor
     * @augments module:Backbone.Collection
     */
    var CatalogCollection = Backbone.Collection.extend(/** @lends CatalogCollection.prototype */{

        /**
         * The model for the collection
         *
         * @type {Catalog}
         */
        model: Catalog,

        /**
         * The url to fetch the collection.
         *
         * @returns {String} the url for the collection
         */
        url: function() {
            return Granite.HTTP.externalize(this.path + '/_jcr_content.json');
        },

        /**
         * Generic initialization for the collection.
         *
         * @param {Backbone.Models[]} [models] The initial models for this collection.
         * @param {Map} config The optional configuration options
         * @param {String} config.path The base url to load the collection from
         */
        initialize: function(models, config) {
            this.path = config && config.path;
        },

        /**
         * Parse the specified content into a collection.
         *
         * @param {String|Array} response A string representation or the actual models to be parsed.
         * @returns {Catalog[]} the parsed catalogs
         */
        parse: function(response) {
            var catalogs = [];
            if (response) {
                var data = $.isArray(response) ? response : JSON.parse(response).children;
                var categories;
                _.each(data, function(catalog) {
                    categories = new CategoryCollection();
                    categories.models = categories.parse(catalog.children);
                    catalogs.push(
                        new Catalog({
                            title: catalog.title,
                            path: catalog.path,
                            coverImage: catalog.coverImage,
                            callouts: catalog.callouts,
                            categories: categories
                        })
                    );
                });
            }
            return catalogs;
        }

    });

    // return the collection
    return CatalogCollection;

});
