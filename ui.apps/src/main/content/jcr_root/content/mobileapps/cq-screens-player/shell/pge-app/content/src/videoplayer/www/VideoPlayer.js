"use strict";

function ScreensVideoPlayer() {
    console.log('Android Native full screen video player initialized');
}

/**
* Plays a video in native full screen in Android.
* @param {url} URL of Video to  play
* @param {options} video view options 
*/
ScreensVideoPlayer.prototype.playVideo = function (url, options) {
    options = options || {};
    cordova.exec(options.successCallback || null, options.errorCallback || null, 'ScreensVideoPlayer', 'playVideo', [url, options]);
};

module.exports = new ScreensVideoPlayer();
