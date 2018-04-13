/*
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2016 Adobe Systems Incorporated
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
'use strict';

var argscheck = require('cordova/argscheck');
var exec = require('cordova/exec');

function ScreensPlayerStorage() {
    console.log("ScreensPlayerStorage initialized.")
}

ScreensPlayerStorage.prototype = {

    /**
     * Retrieves the disk usage of the player storage.
     * @param {Function} successCallback is called with the result object
     * @param {Function} errorCallback is called with an error
     */
    getUsage: function(successCallback, errorCallback) {
        argscheck.checkArgs('FF', 'ScreensPlayerStorage.getUsage', arguments);
        var success = successCallback && function(result) {
                // complete missing values
                if (!result.used) {
                    result.used = result.total - result.free;
                }
                successCallback(result);
            };
        exec(success, errorCallback, "ScreensPlayerStorage", "getUsage", []);
    }

};

module.exports = new ScreensPlayerStorage();
