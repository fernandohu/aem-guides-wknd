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
define('Instore', [
    'underscore',
    'jquery',
    'instore/models/app',
    'instore/collections/catalogs',
    'views/BaseView',
    'ux/views/SwipeGridView',
    'instore/views/logo',
    'instore/views/catalog'
], function(_, $, AppConfig, CatalogCollection, BaseView, SwipeGridView, LogoView, CatalogView) {
    'use strict';

    /**
     * Default view options.
     *
     * @type {Map}
     * @static
     */
    var DEFAULT_OPTIONS = {
        devicePath: '',
        appPath: ''
    };

    var Instore = BaseView.extend(/** @lends Instore.prototype */ {

        /**
         * Class name for the wrapping element of the view.
         *
         * @type {String}
         */
        className: 'instore-App',

        /**
         * Attributes for the wrapping element of the view.
         *
         * @type {Map}
         */
        attributes: {
            'touch-action': 'none'
        },

        /**
         * Events that the view handles.
         *
         * @type {Map}
         */
        events: {
            'afterswipe': '_onAfterSwipe'
        },

        /**
         * @constructor
         * @extends BaseView
         *
         * @param {Object} [options] An object of configurable options.
         */
        constructor: function(options) {
            this._initOptions(options, DEFAULT_OPTIONS);
            Instore.__super__.constructor.apply(this, arguments);
        },

        /**
         * Generic initialization for this view
         */
        initialize: function() {
            var self = this;
            this._views = [];
            this.model = new AppConfig({
                name: 'We.Retail In-Store App'
            });

            // Load catalogs for the current language.
            this.catalogs = new CatalogCollection([], {
                path: this.options.appPath + '/' + this.options.lang
            });
            this.catalogs.fetch({
                parse: true,
                dataType: 'html',
                success: function() {
                    self.render();
                }
            });
        },

        /**
         * Destroy the view.
         *
         * @returns {Instore} the destroyed view
         */
        destroy: function() {
            if (this._views) {
                this._views = null;
            }

            if (this._swipeView) {
                this._swipeView.destroy();
                this._swipeView = null;
            }

            return Instore.__super__.destroy.apply(this, arguments);
        },

        /**
         * Retrieve the view for the specified coordinates in the SwipeGridView.
         *
         * @param {Number} x the column coordinates
         * @param {Number} y the row coordinates
         * @returns {Backbone.View|null} the backbone view at the specified coordinates, or null
         */
        provide: function(x, y) {
            if (y < 0) {
                return null;
            }
            if (y < this._views.length) {
                var v = this._views[y];
                window.requestAnimationFrame(function() {
                    v.invalidate();
                });
                return v.el || v;
            }
            return null;
        },

        /**
         * Handle the 'afterswip' event.
         *
         * @param {Event} e the event that was triggered
         */
        _onAfterSwipe: function(e) {
            e = e.originalEvent;
            if (e.target.viewController === this._swipeView) {
                // todo: maybe fade in callouts ?
            }
        },

        /**
         * Render the application logo.
         *
         * @returns {LogoView} the logo view
         */
        _renderLogo: function() {
            var logoView = new LogoView({});
            return logoView.render();
        },

        /**
         * Render a catalog.
         *
         * @param {Catalog} catalog The catalog to render
         *
         * @returns {CatalogView} the catalog view
         */
        _renderCatalog: function(catalog) {
            var catalogView = new CatalogView({
                model: catalog,

                // todo: use tiles
                width: window.innerWidth,
                height: window.innerHeight,
                display: this.options.display
            });
            this._views.push(catalogView.render());
            return catalogView;
        },

        /**
         * Render the view.
         *
         * @returns {Instore} the view
         */
        render: function() {
            // prevent re-render
            if (this.setRendered(true)) {
                return this;
            }

            this.$el.appendTo(this.options.rootElement);

            this._swipeView = new SwipeGridView({
                direction: SwipeGridView.SWIPE_DIRECTION_Y,
                provider: this
            });

            this.$el.append(this._renderLogo().$el);
            _.each(this.catalogs.models, this._renderCatalog, this);
            this.$el.append(this._swipeView.render().el);

            return this;
        }

    });

    // return the view
    return Instore;

});
