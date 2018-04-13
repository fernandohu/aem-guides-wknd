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

(function(hobs, $) {
    'use strict';

    /**
     * Define the namespace for the actions.
     */
    hobs.actions.Sistine = {};

    var _handleDemoMode = function(stepOptions, selector, color, text, options) {
        if (stepOptions.demoMode === true) {
            var el = hobs.utils.highlightElement(selector, color, text, $.extend({}, options, {type: 'CENTER_BOX'}));
            this.setDemoModeHighlightDOMEl(el);
        }
    };

    var _trigger = function(el, type, options) {
        var evt = hobs.window.document.createEvent('MouseEvent');
        evt.initMouseEvent(type, true, false, null, null,
            options.clientX, options.clientY, options.clientX, options.clientY,
            false, false, false, false, options.button, null);
        evt = $.extend(evt, {width: 0, height: 0}, options);
        el.dispatchEvent(evt);
    };

    /**
     * Trigger a simple tap event on the specified element.
     *
     * @param  {jQuery}  $el       The element to trigger the event on
     * @param  {Integer} [delay=0] Delay between the various steps in the tap event
     */
    var _tap = function($el, delay) {
        var el = $($el).get(0);

        // Default event options to pass along
        var options = {
            pointerId: 1,
            bubbles: true
        };

        // Trigger the events
        _trigger(el, 'pointerdown', $.extend(options, {}));

        // el.dispatchEvent(new hobs.window.PointerEvent('pointerdown', $.extend(options, {})));
        window.setTimeout(function() {
            _trigger(el, 'pointerup', $.extend(options, {}));

            // el.dispatchEvent(new hobs.window.PointerEvent('pointerup', $.extend(options, {})));
        }, delay || 0);
    };

    /**
     * Trigger a swipe action on the specified element.
     *
     * @param  {jQuery}   $el       The element to trigger the event on
     * @param  {Object[]} positions The positions for the swipe actions (start, middle, end)
     * @param  {Integer}  [delay=0] Delay between the various steps in the swipe event
     */
    var _swipe = function($el, positions, delay) {
        var el = $($el).get(0);

        // Default event options to pass along
        var options = {
            pointerId: 1,
            bubbles: true,
            pressure: 0.5,
            clientX: 0,
            clientY: 0
        };

        // Trigger the events
        _trigger(el, 'pointerdown', $.extend(options, positions[0]));
        window.setTimeout(function() {
            _trigger(el, 'pointermove', $.extend(options, positions[1]));
        }, delay || 0);
        window.setTimeout(function() {
            _trigger(el, 'pointermove', $.extend(options, positions[2]));
            _trigger(el, 'pointerup', $.extend(options, positions[2]));
        }, 1.4 * delay || 0);
    };

    /**
     * Create a test step for the specified action.
     *
     * @param  {String}   label       The label for the action to trigger
     * @param  {Function} actionFnc   The action the test step needs to trigger
     * @param  {Function} [passedFnc] The success message to return
     * @param  {Function} [failedFnc] The failure message to return
     *
     * @return {TestStep} The test step for the specified action
     */
    var _sistineTestStep = function(label, actionFnc, passedFnc, failedFnc) {

        // Keep compatibility with older hobbes tests
        var jQSelectorPollCheckTestStep = (hobs.teststeps && hobs.teststeps.jQSelectorPollCheckTestStep || hobs.jQSelectorPollCheckTestStep);

        var testStep = function(selector, options) {
            var self = this;
            var checkTrueFct = null;

            this.selector = selector;

            checkTrueFct = function(opts) {

                // Handle Demo Mode
                _handleDemoMode.call(self, opts, self.execData('args')[0], 'blue', label || 'Pointer event');

                actionFnc(self.execData('element'), options,
                    (function() {
                        this.done(hobs.Chaining.Step.STATE_PASSED);
                    }).bind(this)
                );

            };

            var _options = $.extend({}, options, {
                timeoutFct: hobs.actions.jQSelectorPollCheckTestStepTimeoutFct.bind(this),
                checkTrueFct: checkTrueFct
            });

            jQSelectorPollCheckTestStep.call(this, null, null, selector, _options);
        };

        testStep.prototype = new jQSelectorPollCheckTestStep(); // eslint-disable-line new-cap

        testStep.prototype.constructor = _sistineTestStep;
        testStep.prototype.type = 'hobs.actions.screens.' + label;

        // Overwrite result messages
        testStep.prototype['res-msg-passed'] = passedFnc || 'Triggered action on ${DOM element:0}';
        testStep.prototype['res-msg-failed'] = failedFnc || 'Action triggered on ${DOM element:0} failed';

        return testStep;

    };

    /**
     * Simple tap action.
     *
     * @param  {String} selector  The selector to the element
     * @param  {Map}    [options] Options for the action
     */
    hobs.actions.Sistine.tap = _sistineTestStep('Tap',
        function($el, options, next) {
            _tap($el);
            next();
        },
        'Tapped ${DOM element:0}'
    );

    /**
     * Double tap action.
     *
     * @param  {String} selector  The selector to the element
     * @param  {Map}    [options] Options for the action
     */
    hobs.actions.Sistine.doubletap = _sistineTestStep('Double Tap',
        function($el, options, next) {
            var secondTap = function(ev) {
                window.setTimeout(function() {
                    _tap($el);
                    next();
                }, 0);
            };
            $el.one('pointerup', secondTap);
            _tap($el);
        },
        'Double-tapped ${DOM element:0}'
    );

    /**
     * Simple press action.
     *
     * @param  {String}  selector            The selector to the element
     * @param  {Map}     [options]           Options for the action
     * @param  {Integer} [options.delay=500] The duration for the press event
     */
    hobs.actions.Sistine.press = _sistineTestStep('Press',
        function($el, options, next) {
            _tap($el, options.delay || 500);
            next();
        },
        'Pressed ${DOM element:0}'
    );

    /**
     * Left swipe action.
     *
     * @param  {String} selector  The selector to the element
     * @param  {Map}    [options] Options for the action
     */
    hobs.actions.Sistine.swipeLeft = _sistineTestStep('Swipe Left',
        function($el, options, next) {
            var pos = {
                start: options && options.swipeStart || 100,
                end: options && options.swipeEnd || 0
            };
            pos.middle = (pos.start - pos.end) / 2;

            _swipe($el, [{clientX: pos.start}, {clientX: pos.middle}, {clientX: pos.end}], 100);
            next();
        },
        'Swiped left ${DOM element:0}'
    );

    /**
     * Right swipe action.
     *
     * @param  {String} selector  The selector to the element
     * @param  {Map}    [options] Options for the action
     */
    hobs.actions.Sistine.swipeRight = _sistineTestStep('Swipe Right',
        function($el, options, next) {
            var pos = {
                start: options && options.swipeStart || 0,
                end: options && options.swipeEnd || 100
            };
            pos.middle = (pos.end - pos.start) / 2;

            _swipe($el, [{clientX: pos.start}, {clientX: pos.middle}, {clientX: pos.end}], 100);
            next();
        },
        'Swiped right ${DOM element:0}'
    );

    /**
     * Up swipe action.
     *
     * @param  {String} selector  The selector to the element
     * @param  {Map}    [options] Options for the action
     */
    hobs.actions.Sistine.swipeUp = _sistineTestStep('Swipe Up',
        function($el, options, next) {
            var pos = {
                start: options && options.swipeStart || 100,
                end: options && options.swipeEnd || 0
            };
            pos.middle = (pos.start - pos.end) / 2;

            _swipe($el, [{clientY: pos.start}, {clientY: pos.middle}, {clientY: pos.end}], 100);
            next();
        },
        'Swiped up ${DOM element:0}'
    );

    /**
     * Down swipe action.
     *
     * @param  {String} selector  The selector to the element
     * @param  {Map}    [options] Options for the action
     */
    hobs.actions.Sistine.swipeDown = _sistineTestStep('Swipe Down',
        function($el, options, next) {
            var pos = {
                start: options && options.swipeStart || 0,
                end: options && options.swipeEnd || 100
            };
            pos.middle = (pos.end - pos.start) / 2;

            _swipe($el, [{clientY: pos.start}, {clientY: pos.middle}, {clientY: pos.end}], 100);
            next();
        },
        'Swiped down ${DOM element:0}'
    );

    hobs.registerCustomActions('sistine', hobs.actions.Sistine);

}(window.hobs, window.jQuery));
