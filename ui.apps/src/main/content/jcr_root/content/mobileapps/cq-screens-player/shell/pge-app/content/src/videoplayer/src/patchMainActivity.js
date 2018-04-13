#!/usr/bin/env node

"use strict";

var fs = require('fs');
var path = require('path');

module.exports = function (context) {
    var projectRoot = context.opts.projectRoot;
    var source = path.join(__dirname, 'android', 'LaunchActivity.java');
    var target = path.join(projectRoot, 'platforms', 'android', 'src', 'com', 'adobe', 'aem', 'screens', 'player', 'LaunchActivity.java');

    console.log('Copying ' + source + ' to ' + target);

    try {
        fs.accessSync(source, fs.F_OK);
        fs.writeFileSync(target, fs.readFileSync(source));

        var manifest = path.join(projectRoot, 'platforms', 'android', 'AndroidManifest.xml');
        console.log('Updating ' + manifest);
        fs.readFile(manifest, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            var result = data.replace(/MainActivity/g, 'LaunchActivity');

            fs.writeFile(manifest, result, 'utf8', function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    } catch (e) {
        // Source file does not exist. Could be a non-android build. Fail silently
    }
};


