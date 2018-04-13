/*
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2014 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 */
/* globals module*/

// -----------------------------------------------------------------------------------------------------------------
// touch events handling
// -----------------------------------------------------------------------------------------------------------------

(function() {
    'use strict';

    /**
     * Simple trick to fake touch event support
     * this is enough for most libraries like Modernizr and Hammer
     *
     * Note: copied from  https://github.com/hammerjs/touchemulator/blob/master/touch-emulator.js
     */
    function fakeTouchSupport() {
        var objs = [window, document.documentElement];
        var props = ['ontouchstart', 'ontouchmove', 'ontouchcancel', 'ontouchend'];

        for (var o = 0; o < objs.length; o++) {
            for (var p = 0; p < props.length; p++) {
                if (objs[o] && !objs[o][props[p]]) {
                    objs[o][props[p]] = null;
                }
            }
        }
    }

    function Touch(opts) {
        return opts;
    }

    function TouchList() {
        var touchList = [];

        touchList.item = function(index) {
            return this[index] || null;
        };

        touchList.identifiedTouch = function(id) {
            for (var i = 0; i < touchList.length; i++) {
                var t = touchList[i];
                if (t.identifier === id) {
                    return t;
                }
            }
            return null;
        };

        touchList.replaceTouch = function(id, touch) {
            for (var i = 0; i < touchList.length; i++) {
                if (touchList[i].identifier === id) {
                    if (touch) {
                        return touchList.splice(i, 1, touch)[0];
                    }
                    return touchList.splice(i, 1)[0];
                }
            }
            if (touch) {
                touchList.push(touch);
            }
            return null;
        };

        return touchList;
    }


    // list of active touches
    var activeTouches = new TouchList();

    // STETouch action to touch event type map
    var ACTION_TO_TOUCH_EVT_TYPE = ['', '', 'touchmove', '', 'touchend', '', '', '', 'touchstart'];

    function dispatchTouchEvent(target, action, tid, x, y) {
        var type = ACTION_TO_TOUCH_EVT_TYPE[action];
        if (!type || type === '') {
            return;
        }
        // ensure tid is a string
        tid = '' + tid;

        x = Math.round(x);
        y = Math.round(y);

        // create touch
        var prevTouch;
        var touch = new Touch({
            screenX: x,
            screenY: y,
            clientX: x,
            clientY: y,
            pageX: x,
            pageY: y,
            force: 0.5,
            identifier: tid,
            radiusX: 0,
            radiusY: 0,
            rotationAngle: 0
        });

        var changedTouches = new TouchList();
        changedTouches.push(touch);

        if (type === 'touchstart') {
            activeTouches.replaceTouch(tid, touch);
            touch.target = target;

        } else if (type === 'touchmove') {
            prevTouch = activeTouches.replaceTouch(tid, touch);
            if (prevTouch) {
                // send event from the target that received the touch start
                target = touch.target = prevTouch.target;
            }

        } else { // touch end
            prevTouch = activeTouches.replaceTouch(tid, null);
            if (prevTouch) {
                // send event from the target that received the touch start
                target = prevTouch.target;
            }

        }

        var evt = document.createEvent('Event');
        evt.initEvent(type, true, true);

        evt.touches = activeTouches;
        evt.targetTouches = activeTouches;
        evt.changedTouches = changedTouches;

        target.dispatchEvent(evt);
    }

    // --------------------------------------------------------
    // pointer event handling
    // --------------------------------------------------------

    // pointer type for touch
    var POINTER_TYPE_TOUCH = 0x00000002;

    // STETouch action to pointer event type map
    var ACTION_TO_POINTER_EVT_TYPE = ['', '', 'pointermove', '', 'pointerup', '', '', '', 'pointerdown'];

    function dispatchPointerEvent(target, action, tid, x, y) {
        var type = ACTION_TO_POINTER_EVT_TYPE[action];
        if (!type || type === '') {
            return;
        }

        var evt = new MouseEvent(type, {
            view: window,
            bubbles: true,
            cancelable: true,
            screenX: x,
            screenY: y,
            clientX: x,
            clientY: y
        });
        evt.pointerType = POINTER_TYPE_TOUCH;
        evt.width = 0;
        evt.height = 0;
        evt.pressure = 0.5; // sistine.js requires pressure > 0
        evt.pointerId = 1 + tid; // mouse must always be 1
        evt.tiltX = 0;
        evt.tiltY = 0;
        evt.hwTimestamp = 0; // we do not support it for now
        target.dispatchEvent(evt);
    }

    // --------------------------------------------------------
    // click event handling
    // --------------------------------------------------------
    var CLICK_THRESHOLD = 20;
    var CLICK_TIMEOUT = 200;

    function Click(target, view, x, y) {
        this.complete = false;
        this.target = target;
        this.view = view;
        this.start = {
            x: x,
            y: y
        };

        var self = this;
        this._timeout = setTimeout(function() {
            self.cleanup();
        }, CLICK_TIMEOUT);
    }

    Click.prototype.end = function(x, y) {
        console.log('> click.end');
        if (this.complete) {
            return;
        }

        // check if touch moved too much
        var deltaX = this.start.x - x;
        var deltaY = this.start.y - y;
        var delta = Math.sqrt(Math.exp(deltaX, 2) + Math.exp(deltaY, 2));

        if (delta > CLICK_THRESHOLD) {
            this.cleanup();
            return;
        }

        x = Math.round(this.start.x);
        y = Math.round(this.start.y);

        var evt = new MouseEvent('click', {
            view: this.view,
            bubbles: true,
            cancelable: true,
            screenX: x,
            screenY: y,
            clientX: x,
            clientY: y
        });

        this.target.dispatchEvent(evt);

        this.cleanup();
    };

    Click.prototype.cleanup = function() {
        if (this._timeout) {
            window.clearTimeout(this._timeout);
        }
        this.complete = true;
        this._timeout = null;
        this.start = null;
        this.target = null;
        this.view = null;
    };

    var clickTrackerCache = {};
    function dispatchClickEvent(target, view, action, tid, x, y) {
        var type = ACTION_TO_POINTER_EVT_TYPE[action];
        if (!type || type === '') {
            return;
        }

        var pointerId = 1 + tid; // mouse must always be 1

        if (type === 'pointerdown') {
            clickTrackerCache[pointerId] = new Click(target, view, x, y);
        } else if (type === 'pointerup') {
            var c = clickTrackerCache[pointerId];
            if (c) {
                c.end(x, y);
            }
            clickTrackerCache[pointerId] = null;
        }
    }

    // --------------------------------------------------------
    // exported bridge object
    // --------------------------------------------------------

    function SistineBridge() {
        fakeTouchSupport();
    }

    SistineBridge.prototype = {

        handleTouch: function(action, tid, x, y) {
            // find target element but traverse iframes
            var doc = document;
            var target = null;
            var view = window;
            while (!target) {
                target = doc.elementFromPoint(x, y);
                if (!target) {
                    target = doc;
                } else if (target.contentDocument && target.contentDocument !== doc) {
                    view = target.contentWindow;
                    doc = target.contentDocument;
                    target = null;
                }
            }
            dispatchPointerEvent(target, action, tid, x, y);
            dispatchTouchEvent(target, action, tid, x, y);
            dispatchClickEvent(target, view, action, tid, x, y);
        }

    };

    if (typeof module === 'undefined') {
        window.SistineBridge = new SistineBridge();
    } else {
        module.exports = {
            SistineBridge: new SistineBridge()
        };
    }

}());
