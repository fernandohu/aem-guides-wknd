Crosswalk Command Line Options
==============================

The file `xwalk-command-line` is used to pass the command line options to the chromium webview.
It can be used to change the chromium flags, for example `--ignore-gpu-blacklist`. 
see https://crosswalk-project.org/documentation/about/faq.html#Canvas-and-WebGL-support for details about rendering.
also http://peter.sh/experiments/chromium-command-line-switches/ for a list of other flags.

> **NOTE**: The file is [parsed like a normal commandline](https://github.com/crosswalk-project/crosswalk/blob/crosswalk-13/runtime/android/core_internal/src/org/xwalk/core/internal/XWalkViewDelegate.java#L74) and can therefore not contain any comments.

**Useful options:**

* `--ignore-gpu-blacklist`
* `--show-fps-counter`
* `--disable-web-security`