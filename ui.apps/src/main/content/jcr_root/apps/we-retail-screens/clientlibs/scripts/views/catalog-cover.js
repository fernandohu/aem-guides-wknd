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
define('instore/views/catalog-cover', [
    'underscore',
    'jquery',
    'util/Util',
    'instore/models/product',
    'views/BaseView',
    'instore/views/product-callout'
], function(_, $, Util, Product, BaseView, ProductCalloutView) {
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
        animationDuration: 400,
        calloutMargin: 10
    };

    var CatalogCoverView = BaseView.extend(/** @lends CatalogCoverView.prototype */ {

        /**
         * Class name for the wrapping element of the view.
         *
         * @type {String}
         */
        className: 'instore-CatalogCoverView',

        /**
         * Sistine options.
         *
         * @type {Object}
         */
        sistineOptions: {
            events: {
                'tap .icon-info': '_handleToggleCallout'
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
            CatalogCoverView.__super__.constructor.apply(this, arguments);
            this._sistine.add(new Sistine.Tap({
                eventName: 'tap',
                taps: 1,
                delegate: this.delegate,
                delegateScope: this
            }));
        },

        /**
         * Generic initialization for this view
         */
        initialize: function() {
        },

        /**
         * Toggle a callout.
         *
         * @param {HTMLElement|jQuery} btn        The button that handles the callout to toggle
         * @param {Number}             [duration] The animation duration (in seconds)
         */
        toggleCallout: function(btn, duration) {
            var $btn = $(btn);
            var fnc = $btn.next().is(':visible') ? this.hideCallout : this.showCallout;
            fnc.call(this, $btn, duration);
        },

        /**
         * Show a callout.
         *
         * @param {HTMLElement|jQuery} btn        The button that handles the callout to show
         * @param {Number}             [duration] The animation duration (in seconds)
         */
        showCallout: function(btn, duration) {
            var $btn = $(btn);
            var $panel = $btn.next();
            if ($panel.is(':visible')) {
                return;
            }

            var panelTop = parseFloat($panel.css('top')) / 100 * window.innerHeight;
            var panelLeft = parseFloat($panel.css('left')) / 100 * window.innerWidth;
            var btnLeftOffset = $btn.position().left - this.options.calloutMargin;
            var btnRightOffset = $btn.position().left + $btn.width() + this.options.calloutMargin;
            var windowButtomOffset = window.innerHeight - this.options.calloutMargin;

            $panel.css({
                transformOrigin: '0 0',
                display: 'block'
            }).transition({
                x: $btn.position().left < panelLeft ?
                    Math.max(0, btnRightOffset - panelLeft) :
                    Math.min(0, btnLeftOffset - $panel.outerWidth() - panelLeft),
                y: Math.min(0, windowButtomOffset - $panel.outerHeight() - panelTop),
                scale: 1.0,
                opacity: 1
            },
            duration || 0
            );
        },

        /**
         * Hide a callout.
         *
         * @param {HTMLElement|jQuery} btn        The button that handles the callout to hide
         * @param {Number}             [duration] The animation duration (in seconds)
         */
        hideCallout: function(btn, duration) {
            var $btn = $(btn);
            var $panel = $btn.next();

            var panelTop = parseFloat($panel.css('top'));
            var panelLeft = parseFloat($panel.css('left'));

            $panel.css({
                transformOrigin: '0 0'
            }).transition({
                x: $btn.position().left - panelLeft,
                y: $btn.position().top - panelTop,
                scale: $btn.height() / $panel.outerHeight(),
                opacity: 0
            },
            duration || 0,
            function onHideCalloutAnimEnd() {
                $panel.css({display: 'none'});
            });
        },

        /**
         * Handle the callout toggling.
         *
         * @param {Event} ev The event that triggered the action
         */
        _handleToggleCallout: function(ev) {
            var $openCallout = this.$el.find('.instore-ProductCalloutView:visible');
            if ($openCallout.length) {
                var $openBtn = $openCallout.prev();
                if ($openBtn.get(0) !== ev.target) {
                    this.toggleCallout($openBtn, this.options.animationDuration);
                }
            }
            this.toggleCallout($(ev.target), this.options.animationDuration);
        },

        /**
         * Instantiate the template markup with the provided data.
         *
         * @param {Catalog} catalog The catalog to render the template with.
         * @returns {String} the HTML string for the instantiated template
         */
        _template: function(catalog) {
            var tpl = _.template(
                '<div class="instore-CatalogView-background" style="background-image: url(<%= imagePath %>); "></div>'
            );
            return tpl({
                imagePath: Granite.HTTP.externalize(catalog.get('coverImage'))
            });
        },

        /**
         * Render a callout.
         *
         * @param {Object} callout The callout to render.
         */
        _renderCallout: function(callout) {
            var self = this;
            var product = new Product();
            product.fetch({
                url: Granite.HTTP.externalize(callout.product + '/_jcr_content.json'),
                success: function(p) {
                    var calloutView = new ProductCalloutView({model: p});
                    calloutView.$el.css({
                        left: callout.position[0] + '%',
                        top: callout.position[1] + '%'
                    });
                    var $btn = $(document.createElement('button'))
                        .addClass('icon icon-info')
                        .css({
                            left: callout.buttonPosition[0] + '%',
                            top: callout.buttonPosition[1] + '%'
                        });
                    self.$el.append($btn);
                    var $panel = calloutView.render().$el;
                    self.$el.append($panel);
                    $panel.css({visibility: 'hidden'});
                    window.setTimeout(function() {
                        self.hideCallout($btn, 0);
                        $panel.css({visibility: ''});
                    }, 0);
                }
            });
        },

        /**
         * Render the view.
         *
         * @returns {CatalogCoverView} the view
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

            _.each(this.model.get('callouts'), this._renderCallout.bind(this));

            // Preload cover
            var img = new Image();
            img.src = Granite.HTTP.externalize(this.model.get('coverImage'));

            return this;
        }

    });

    // return the view
    return CatalogCoverView;

});
