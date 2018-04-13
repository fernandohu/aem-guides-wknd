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
(function() {
    'use strict';

    function getPointer(id) {
        var elem = document.getElementById('pointer-' + id);
        if (!elem) {
            elem = document.createElement('div');
            elem.setAttribute('id', 'pointer-' + id);
            elem.className = 'pointer';
            document.body.appendChild(elem);
        }
        return elem;
    }

    function updatePointer(id, x, y, evt, delta) {
        if (!delta) {
            delta = 24;
        }
        var el = getPointer(id);
        el.style.left = (x - delta) + 'px';
        el.style.top = (y - delta) + 'px';
        el.style.display = '';
        el.innerHTML = '<span>id:' + id + ', x:' + x + ', y:' + y + ' (' + evt.type + ')</span>';

        if (('' + id).indexOf('touch-') === 0) {
            el.className = 'pointer touch';
        } else {
            el.className = 'pointer ';
        }
    }

    // pointer events
    function onPointerDown(e) {
        updatePointer(e.pointerId, e.clientX, e.clientY, e);
    }

    function onPointerMove(e) {
        updatePointer(e.pointerId, e.clientX, e.clientY, e);
    }

    function onPointerUp(e) {
        var el = getPointer(e.pointerId);
        el.style.display = 'none';
    }

    // touch events
    function onTouchStart(e) {
        var touchlist = e.changedTouches;
        for (var i = 0; i < touchlist.length; i++) {
            var t = touchlist[i];
            updatePointer('touch-' + t.identifier, t.clientX, t.clientY, e);
        }
    }

    function onTouchMove(e) {
        var touchlist = e.changedTouches;
        for (var i = 0; i < touchlist.length; i++) {
            var t = touchlist[i];
            updatePointer('touch-' + t.identifier, t.clientX, t.clientY, e);
        }
    }

    function onTouchEnd(e) {
        var touchlist = e.changedTouches;
        for (var i = 0; i < touchlist.length; i++) {
            var t = touchlist[i];
            var el = getPointer('touch-' + t.identifier);
            el.style.display = 'none';
        }
    }

    // mouse events
    function onMouseDown(e) {
        updatePointer('mouse', e.clientX, e.clientY, e, 12);
    }

    function onMouseMove(e) {
        updatePointer('mouse', e.clientX, e.clientY, e, 12);
    }

    function onMouseUp(e) {
        updatePointer('mouse', e.clientX, e.clientY, e, 12);
    }

    window.addEventListener('pointerdown', onPointerDown, false);
    window.addEventListener('pointermove', onPointerMove, false);
    window.addEventListener('pointerup', onPointerUp, false);
    window.addEventListener('pointercancel', onPointerUp, false);

    window.addEventListener('touchstart', onTouchStart, false);
    window.addEventListener('touchmove', onTouchMove, false);
    window.addEventListener('touchend', onTouchEnd, false);
    window.addEventListener('touchcancel', onTouchEnd, false);

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mouseup', onMouseUp, false);


}());
