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
define('instore/views/product-fullscreen', [
    'underscore',
    'jquery',
    'util/Util',
    'views/BaseView',
    'ux/views/ButtonView',
    'ux/views/DrawerComponentView',
    'instore/views/product-thumbnail',
    'instore/views/product-description',
    'instore/views/product-list',
    'instore/models/product'
], function(_, $, Util, BaseView, ButtonView, DrawerComponentView, ProductThumbnailView, ProductDescriptionView,
        ProductListView, Product) {
    'use strict';

    /**
     * Default view options.
     *
     * @type {Map}
     * @static
     */
    var DEFAULT_OPTIONS = {
        containerModel: null,
        displayAssetIdx: 0,
        width: 1920,
        height: 1080,
        left: 0,
        parent: null,
        parentClassName: '.instore-App',
        drawerClass: 'instore-ProductFullscreenView-drawer',
        handleClass: 'instore-ProductFullscreenView-handle',
        contentClass: 'instore-ProductFullscreenView-content',
        pullDirection: 'left',
        drawerOpenLocation: 0,
        drawerCloseLocation: -250,
        handleOpenLocation: 250,
        handleCloseLocation: 0,
        contentOpenLocation: 0,
        contentCloseLocation: -250,
        autoResizesContentView: true,
        contentViewMinimumSize: 0,
        contentViewMaximumSize: 1920,
        drawerWidth: 250,
        drawerHandleMargin: 1,
        animationDuration: 400
    };

    var FullScreenView = DrawerComponentView.extend(/** @lends FullScreenView.prototype */ {

        /**
         * Class name for the wrapping element of the view.
         *
         * @type {String}
         */
        className: 'instore-ProductFullscreenView',

        /**
         * Events that the view handles.
         *
         * @type {Map}
         *
         * @returns {Map} The registered events
         */
        events: function() {
            return _.extend({}, DrawerComponentView.prototype.events, {
                'select-product': '_handleProductSelected',
                'select-variant': '_handleVariantSelected'
            });
        },

        /**
         * Sistine options.
         *
         * @type {Object}
         */
        sistineOptions: {
            events: {
                'tap .icon-menu': '_toggleProductDescriptionPanel',
                'doubletap .instore-ProductFullscreenView-content .instore-ProductThumbnailView': '_handleFullscreenClose'
            }
        },

        /**
         * Creates a new full screen instance
         *
         * @constructor
         * @extends DrawerComponentView
         *
         * @param {Object}            [options]                     An object of configurable options.
         * @param {ContainerModel}    [options.containerModel=null] The model that we use to get assets to show in fullscreen
         * @param {Number}            [options.displayAssetIdx=0]   The asset at displayAssetIdx that is displayed by default in fullscreen mode
         * @param {Number}            [options.width=500]           The full width of this fullscreen instance
         * @param {Number}            [options.left=0]              The left position this fullscreen instance
         * @param {ProjectDetailView} [options.parent=null]         The parent class that owns this fullscreen instance
         * @param {Boolean}           [options.hasSidePanel=false]  If hasSidePanel is true, we will have the plus button on the top right corner to launch side panel
         */
        constructor: function(options) {
            this._initOptions(options, DEFAULT_OPTIONS);
            FullScreenView.__super__.constructor.apply(this, arguments);
            this._sistine.add(new Sistine.Tap({
                eventName: 'tap',
                taps: 1,
                delegate: this.delegate,
                delegateScope: this
            }));
            this._sistine.add(new Sistine.Tap({
                eventName: 'doubletap',
                taps: 2,
                delegate: this.delegate,
                delegateScope: this
            }));
        },

        /**
         * Generic initialization for this view.
         */
        initialize: function() {
            FullScreenView.__super__.initialize.apply(this, arguments);
            this.$el.css({
                left: this.options.left,
                width: this.options.width
            });
            this.id = Util.guid();

            this._productListView = null;
            this._productThumbnailView = null;
            this._productDescriptionView = null;
        },

        /**
         * Destroy the view.
         *
         * @returns {FullScreenView} The destroyed view
         */
        destroy: function() {
            if (this._productDescriptionView) {
                this._productDescriptionView.destroy();
                this._productDescriptionView = null;
            }

            if (this._productThumbnailView) {
                this._productThumbnailView.destroy();
                this._productThumbnailView = null;
            }

            if (this._productListView) {
                this._productListView.destroy();
                this._productListView = null;
            }

            this.dispatchEvent('destroyfullscreen', {id: this.id});
            return FullScreenView.__super__.destroy.apply(this, arguments);
        },

        /**
         * Render the view.
         *
         * @returns {FullScreenView} the view
         */
        render: function() {
            if (this._productListView) {
                // prevent re-render
                return this;
            }

            this.options.contentViewMaximumSize = this.options.width - this.options.drawerHandleMargin;
            this.options.contentViewMinimumSize = this.options.width - this.options.drawerWidth;

            this._productListView = new ProductListView({
                model: this.options.category,
                selectedItem: this.model,
                width: this.options.drawerWidth,
                height: this.options.height
            });
            this.setDrawerData(this._productListView.render().el);

            this._addProductThumbnail(this.model);

            FullScreenView.__super__.render.apply(this, arguments);

            this._addProductDescriptionPanel(this.model);

            this._isProductDescriptionVisible = false;
            return this;
        },

        /**
         * Add a thumbnail view for the product.
         *
         * @param {Product} product The product for the view
         */
        _addProductThumbnail: function(product) {
            this._productThumbnailView = new ProductThumbnailView({
                model: product,
                rendition: '/_jcr_content/renditions/original'
            });
            this.setContentData(this._productThumbnailView.render().$el);
            var $icon = $('<button class="icon icon-menu"><span class="icon-image"></span></button>');
            this._productThumbnailView.render().$el.append($icon);
        },

        /**
         * Add a description panel view for the product.
         *
         * @param {Product} product The product for the view
         */
        _addProductDescriptionPanel: function(product) {
            var self = this;

            var detailedProduct = new Product();
            detailedProduct.fetch({
                url: Granite.HTTP.externalize((product.get('basePath') || product.get('path')) + '/_jcr_content.json'),
                parse: true,
                dataType: 'json',
                success: function(p) {
                    self._productDescriptionView = new ProductDescriptionView({
                        model: p,
                        width: 480,
                        height: self.options.height
                    });
                    self.$el.append(self._productDescriptionView.render().$el);
                    self._productDescriptionView.$el.css({x: 480});
                },
                error: function(data, response) {
                    console.error(response.responseText);
                }
            });

        },

        /**
         * Toggle the product description panel.
         *
         * @param {Boolean}  [visible] Force a visiblity (`true` for visible, `false`for hidden), or just toggle the current state
         * @param {Function} [cb]      The callback function to call.
         */
        _toggleProductDescriptionPanel: function(visible, cb) {
            var self = this;
            if (visible === true || visible === false) {
                this._isProductDescriptionVisible = visible;
            }
            else {
                this._isProductDescriptionVisible = !this._isProductDescriptionVisible;
            }

            var onToggleProductDescriptionPanelAnimEnd = _.after(2, function() {
                self.$el.find('.icon-menu').toggleClass('icon-menu--open', self._isProductDescriptionVisible);
                $.isFunction(cb) && cb();
            });

            this._productThumbnailView.$el.transition({
                width: this.options.contentViewMinimumSize - (this._isProductDescriptionVisible ? 480 : 0)
            }, this.options.animationDuration, onToggleProductDescriptionPanelAnimEnd);

            this._productDescriptionView.$el.transition({
                x: this._isProductDescriptionVisible ? 0 : 480
            }, this.options.animationDuration, onToggleProductDescriptionPanelAnimEnd);
        },

        /**
         * Handle the closing of the fullscreen view.
         *
         * @param {Event} ev The event that triggered the action.
         */
        _handleFullscreenClose: function(ev) {
            if ($(ev.target).is('.instore-ProductThumbnailView')
                    || $(ev.target).closest('.instore-ProductThumbnailView').length) {
                var productModel = this._productThumbnailView.model;
                // `productPath` can either be provided by a variant or the product itself.
                var productPath = productModel.get('basePath') || productModel.get('path');
                var $destEl = $('.instore-CategoryView [data-path="' + productPath + '"]');
                this.close($(ev.target), $destEl, this.destroy.bind(this));
            }
        },

        /**
         * Handle the selection of a product and update the view accordingly.
         *
         * @param {Event}   ev      The event that triggered the action
         * @param {Product} product The product that was selected
         */
        _handleProductSelected: function(ev, product) {
            var replaceProduct = function() {
                this._productThumbnailView.destroy();
                this._addProductThumbnail(product);
                this._productDescriptionView.destroy();
                this._addProductDescriptionPanel(product);
            };
            if (this._isProductDescriptionVisible) {
                this._toggleProductDescriptionPanel(false, replaceProduct.bind(this));
            }
            else {
                replaceProduct.bind(this)();
            }
        },

        /**
         * Handle the selection of a product variant and update the view accordingly.
         *
         * @param {Event}   ev      The event that triggered the action
         * @param {Product} variant The variant that was selected
         */
        _handleVariantSelected: function(ev, variant) {
            this._productThumbnailView.destroy();
            this._addProductThumbnail(variant);
            this._productThumbnailView.$el.width(this.options.contentViewMinimumSize - 480);
            this.$el.find('.icon-menu').toggleClass('icon-menu--open', true);
        },

        /**
         * Open the fullscreen view.
         *
         * @param {HTMLElement|jQuery} srcEl The source element that was clicked
         * @param {Function}           [cb]  A callback to use when the animation finished
         */
        open: function(srcEl, cb) {
            var self = this;
            var $srcEl = $(srcEl);
            this._productListView.$el.find('[data-path]').removeClass('active')
                .filter('[data-path="' + $srcEl.attr('data-path') + '"]').addClass('active');

            this._productListView.invalidate();

            $srcEl.css({visibility: 'hidden'});
            var rect = Util.getBoundingClientRect($srcEl);

            var $ghost = $srcEl.clone();
            $ghost.addClass('instore-GhostImage');
            $('body').append($ghost);

            this._productThumbnailView.$el.css({visibility: 'hidden'});

            this.toggleDrawer();

            var onOpenAnimEnd = _.after(2, function() {
                $srcEl.css({visibility: ''});
                self._productThumbnailView.$el.css({visibility: ''});
                self._productThumbnailView.$el.find('.icon').css({visibility: ''});
                $ghost.remove();
                if (_.isFunction(cb)) {
                    cb.call(self);
                }
            });

            var ghostScaleRatio;
            if (rect.width > rect.height) {
                ghostScaleRatio = rect.height / this.options.height;
            } else {
                ghostScaleRatio = rect.width / this.options.contentViewMinimumSize;
            }

            $ghost.css({
                x: rect.left + (rect.width - this.options.contentViewMinimumSize * ghostScaleRatio) / 2,
                y: rect.top + (rect.height - this.options.height * ghostScaleRatio) / 2,
                width: this.options.contentViewMinimumSize,
                height: this.options.height,
                scale: ghostScaleRatio,
                transformOrigin: '0 0 0',
                visibility: ''
            }).transition({
                x: this.options.left + this.options.drawerWidth,
                y: 0,
                scale: 1
            }, this.options.animationDuration, onOpenAnimEnd);

            this.$el.css({
                opacity: 0
            }).transition({
                opacity: 1
            }, this.options.animationDuration, 'easeInExpo', onOpenAnimEnd);
        },

        /**
         * Close the fullscreen view.
         *
         * @param {HTMLElement|jQuery} srcEl  The source element that was clicked
         * @param {HTMLElement|jQuery} destEl The destination element to transition to
         * @param {Function}           [cb]   A callback to use when the animation finished
         */
        close: function(srcEl, destEl, cb) {
            var self = this;
            var $srcEl = $(srcEl);
            var $destEl = $(destEl);
            var srcRect = Util.getBoundingClientRect($srcEl);
            var destRect = Util.getBoundingClientRect($destEl);

            var $ghost = $srcEl.clone();
            $ghost.addClass('instore-GhostImage');
            $ghost.find('.icon').remove();
            $('body').append($ghost);

            $destEl.css({visibility: 'hidden'});
            $srcEl.css({visibility: 'hidden'});
            this._productThumbnailView.$el.find('.icon').css({visibility: 'hidden'});

            this.toggleDrawer();
            this._toggleProductDescriptionPanel(false);

            var onCloseAnimEnd = _.after(2, function() {
                // remove the sample image since we are done with animating
                $ghost.remove();
                $destEl.css({visibility: ''});
                $srcEl.css({visibility: ''});
                if (_.isFunction(cb)) {
                    cb.call(self);
                }
            });

            var ghostScaleRatio;
            if (destRect.width > destRect.height) {
                ghostScaleRatio = srcRect.height / destRect.height;
            } else {
                ghostScaleRatio = srcRect.width / destRect.width;
            }

            $ghost.css({
                x: srcRect.left + (srcRect.width - destRect.width * ghostScaleRatio) / 2,
                y: srcRect.top + (srcRect.height - destRect.height * ghostScaleRatio) / 2,
                width: destRect.width,
                height: destRect.height,
                scale: ghostScaleRatio,
                transformOrigin: '0 0 0'
            }).transition({
                x: destRect && destRect.left || this.options.left || 0,
                y: destRect && destRect.top || this.options.top || 0,
                scale: 1
            }, this.options.animationDuration, onCloseAnimEnd);

            this.$el.transition({
                opacity: 0
            }, this.options.animationDuration, 'easeInExpo', onCloseAnimEnd);
        }

    });

    // return the view
    return FullScreenView;

});
