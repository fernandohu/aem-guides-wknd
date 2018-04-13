#!/usr/bin/env node

"use strict";

var fs = require('fs');
var path = require("path");

var ReplaceAction = function (searchString, replaceString, replaceAll) {
    this.searchString = searchString;
    this.replaceString = replaceString;
    this.replaceAll = replaceAll;
};

module.exports = function (context) {
    var projectRoot = context.opts.projectRoot;

    var configPath = path.join(projectRoot, 'config.xml');
    var plugin = getConfigParser(context, configPath).getPlugin(context.opts.plugin.id);
    var displayName = plugin.variables.DISPLAY_NAME;

    try {
        // The display name for android is stored in the strings.xml file
        // Make sure the android strings file exists
        // If it does, update the app_name with the appropriate display name
        replaceOccurrence(path.join(projectRoot, 'platforms', 'android', 'res', 'values', 'strings.xml'),
            [
                new ReplaceAction('<string name="app_name">AEMScreensPlayer',
                                  '<string name=\"app_name\">' + displayName, false)
            ]);
    } catch(e) {
        //Fail silently for non-android builds
    }

    try {
        // OS X uses the product name field for the target file name and tooltip over the app in the taskbar
        // Make sure the xcode project build settings file exists
        // If it does, update all occurrences of product name with the appropriate display name
        replaceOccurrence(path.join(projectRoot, 'platforms', 'osx', 'AEMScreensPlayer.xcodeproj', 'project.pbxproj'),
            [
                new ReplaceAction('AEMScreensPlayer.app', displayName + '.app', true),
                new ReplaceAction('PRODUCT_NAME = "$(TARGET_NAME)"', 'PRODUCT_NAME = "' + displayName + '"', true)
            ]);

        // Also update the menu entries in the MainViewController.xib
        replaceOccurrence(path.join(projectRoot, 'platforms', 'osx', 'AEMScreensPlayer', 'MainViewController.xib'),
            [
                new ReplaceAction('AEMScreensPlayer', displayName, true)
            ]);
    } catch(e) {
        //Fail silently for non-osx builds
    }
};

function replaceOccurrence(filePath, actions) {
    var content = fs.readFileSync(filePath, 'UTF-8');

    for (var i=0; i < actions.length; i++) {
        if (actions[i].replaceAll === true) {
            content = content.replace(new RegExp(escapeRegExp(actions[i].searchString), 'g'),
                actions[i].replaceString);
        }
        else {
            content = content.replace(actions[i].searchString, actions[i].replaceString);
        }
    }

    fs.writeFile(filePath, content);
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function getConfigParser(context, config) {
    var semver = context.requireCordovaModule('semver');
    var ConfigParser;

    if (semver.lt(context.opts.cordova.version, '5.4.0')) {
        ConfigParser = context.requireCordovaModule('cordova-lib/src/ConfigParser/ConfigParser');
    } else {
        ConfigParser = context.requireCordovaModule('cordova-common/src/ConfigParser/ConfigParser');
    }

    return new ConfigParser(config);
}