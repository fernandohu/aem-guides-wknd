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
define('instore/views/variant', [
    'underscore',
    'jquery',
    'util/Util',
    'views/BaseView'
], function(_, $, Util, BaseView) {
    'use strict';

    var VariantView = BaseView.extend(/** @lends VariantView.prototype */ {

        /**
         * Class name for the wrapping element of the view.
         *
         * @type {String}
         */
        className: 'instore-VariantView',

        /**
         * Sistine options.
         *
         * @type {Object}
         */
        sistineOptions: {
            events: {
                'tap img': '_handleSelectColor'
            }
        },

        /**
         * @constructor
         * @extends BaseView
         *
         * @param {Object} [options] An object of configurable options.
         */
        constructor: function(options) {
            // this._initOptions(options, DEFAULT_OPTIONS);
            VariantView.__super__.constructor.apply(this, arguments);
            this._sistine.add(new Sistine.Tap({
                eventName: 'tap',
                taps: 1,
                delegate: this.delegate,
                delegateScope: this
            }));
        },

        _handleSelectColor: function(ev) {
            if (!this.$el.hasClass('active')) {
                this.$el.trigger('select-variant', [this.model]);
            }
        },

        /**
         * Render the view.
         *
         * @returns {VariantView} the view
         */
        render: function() {
            var axisValue = encodeURI(this.model.get(this.options.axis));
            this.$el.attr('data-path', this.model.path);
            this.options.axis && this.$el.attr('data-' + this.options.axis, axisValue);
            this.options.axis && this.$el.addClass(this.className + '--' + this.options.axis);

            var image = this.model.get('imageHref');
            if (this.options.axis === 'color' && image) {
                this.$el.append($(document.createElement('img')).attr({
                    src: Granite.HTTP.externalize(image + '/_jcr_content/renditions/cq5dam.thumbnail.319.319.png')
                }));
            }
            else {
                this.$el.text(this.model.get(this.options.axis || 'title'));
            }

            return this;
        }

    });

    // return the view
    return VariantView;
});
