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
define('instore/views/star-rating', [
    'underscore',
    'jquery',
    'util/Util',
    'views/BaseView'
], function(_, $, Util, BaseView) {
    'use strict';

    /**
     * Default view options.
     *
     * @type {Map}
     * @static
     */
    var DEFAULT_OPTIONS = {
    };

    var StarRatingView = BaseView.extend(/** @lends StarRatingView.prototype */{

        /**
         * Class name for the wrapping element of the view.
         *
         * @type {String}
         */
        className: 'instore-StarRatingView',

        /**
         * Events that the view handles.
         *
         * @type {Map}
         */
        events: {
            // 'click .instore-StarRatingView-rate': '_handleStarPress'
        },

        /**
         * @constructor
         * @extends GenericContainerView
         *
         * @param {Object} [options] An object of configurable options.
         */
        constructor: function(options) {
            this._initOptions(options, DEFAULT_OPTIONS);
            StarRatingView.__super__.constructor.apply(this, arguments);
        },

        /**
         * Destroy the view.
         *
         * @returns {StarRatingView} the destroyed view
         */
        destroy: function() {
            return StarRatingView.__super__.destroy.apply(this, arguments);
        },

        /**
         * Handle pressing the star.
         *
         * @param {Event} ev The event that triggered the action.
         */
        _handleStarPress: function(ev) {
            var curRating = $(ev.currentTarget).data('star');
            var oldRating = +(this.model.get('rating'));
            var newSize = +(this.model.get('ratingCount')) + 1;
            var newRating = oldRating + (curRating - oldRating) / newSize;

            this.model.set({
                'rating': newRating,
                'ratingCount': newSize
            }).save();

            this._updateStars(newRating, newSize);
        },

        /**
         * Update the star rating and count.
         *
         * @param {Number} val    The new rating value
         * @param {Number} amount The new rating count
         */
        _updateStars: function(val, amount) {
            var v = Math.round(val) - 1;
            var stars = this.$el.find('.instore-StarRatingView-rate');

            stars.each(function(i, e) {
                $(e).toggleClass('is-filled', i <= v);
            });

            this.$el.find('.instore-StarRatingView-count').text(amount);
        },

        /**
         * Instantiate the template markup.
         *
         * @returns {String} the HTML string for the instantiated template
         */
        _template: function() {
            var tmpl = _.template(
                '<span class="instore-StarRatingView-rate" data-star="1">' +
                '<i class="instore-StarRatingView-rate-frame"></i>' +
                '<i class="instore-StarRatingView-rate-fill"></i>' +
                '</span>' +
                '<span class="instore-StarRatingView-rate" data-star="2">' +
                '<i class="instore-StarRatingView-rate-frame"></i>' +
                '<i class="instore-StarRatingView-rate-fill"></i>' +
                '</span>' +
                '<span class="instore-StarRatingView-rate" data-star="3">' +
                '<i class="instore-StarRatingView-rate-frame"></i>' +
                '<i class="instore-StarRatingView-rate-fill"></i>' +
                '</span>' +
                '<span class="instore-StarRatingView-rate" data-star="4">' +
                '<i class="instore-StarRatingView-rate-frame"></i>' +
                '<i class="instore-StarRatingView-rate-fill"></i>' +
                '</span>' +
                '<span class="instore-StarRatingView-rate" data-star="5">' +
                '<i class="instore-StarRatingView-rate-frame"></i>' +
                '<i class="instore-StarRatingView-rate-fill"></i>' +
                '</span>' +
                '<span class="instore-StarRatingView-count"></span>'
            );

            return tmpl({});
        },

        /**
         * Render the view.
         *
         * @returns {StarRatingView} the view
         */
        render: function() {
            StarRatingView.__super__.render.apply(this, arguments);

            var elem = $(this._template({
                title: this.model.get('title')
            }));

            this.$el.append(elem);

            this._updateStars(
                this.model.get('rating'),
                this.model.get('ratingCount')
            );

            return this;
        }

    }, {

        /**
         * Create the instance.
         *
         * @param {HTMLElement|jQuery} anchor The element to align the dialog to
         * @param {Object} [options] Options for the view
         *
         * @returns {StarRatingView} the initialized view
         */
        create: function(anchor, options) {
            var rating = new StarRatingView(options).render();

            rating.$el.appendTo(anchor);

            return rating;
        }
    });

    // return the view
    return StarRatingView;

});
