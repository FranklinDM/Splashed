# Changelog

### 1.4.3
* Add support for Epyrus
* Mark as compatible with Pale Moon 32

### 1.4.2
* Update install manifest

### 1.4.1
* Simplify preview image handling in options window
* Use DOMContentLoaded event for splash initialization
  - Removes workaround included in the previous version.

### 1.4.0
* Include workaround for transparent splash windows
  - Transparent backgrounds for the splash window can now be set again, by changing splash background color to `transparent` and adding `background: transparent;` to the window style.

### 1.3.0
* Retrieve splash window handle using nsIBaseWindow instead of using WinAPI GetActiveWindow
  - This should prevent cases where the main application window becomes always on top instead of the splash window
* Take device pixel ratio into account when resizing the splash window on Windows
* Use window `activate` event instead of `focus`
* Prevent unnecessary updating of splash window state

### 1.2.3
* Remove unused space around splash window frame on Windows

### 1.2.2
* Fix undefined Ci shorthand in overlay

### 1.2.1
* Revert incorrect removal of default splash image source
* Fix broken close splash on click with Basilisk

### 1.2.0
* Thanks to AHOHNMYC!
  - Reinstate and update Russian translation
  - Fix broken display of non-ASCII custom splash text
* Use upscaled extension icon (32x32 -> 64x64)
* Remove support for old (and insecure) exported preferences format
* Remove support for Pale Moon 27 and older
* Remove custom about window
* Fix broken auto-close timeout for SeaMonkey and Borealis
* Simplify command line handler component logic
  - Remove support for -splash flag 
  - Remove show splash when opening external links feature (broken due to typo)
* Further extension code cleanup and minor under-the-hood changes

### 1.1.7
* Initial support for Pale Moon 29

### 1.1.6
* Update install manifest to use separate target application blocks
* Attempt to solve #6 - set always on top to false as soon as main window is open

### 1.1.5
* Allow the splash window to be always on top (Windows only)

### 1.1.4.1
* Declare Basilisk element true in its target application block

### 1.1.4
* Allow background transparency for Pale Moon 27 (and lower) and FossaMail
  - This also adds checks for the background color.
  - If the user placed "transparent" as the value and transparency is not supported by the application, it will be ignored and instead, the splash will use -moz-Dialog as color.

### 1.1.3
* Disable background transparency for splash (temporarily)
  - This causes issues for the Pale Moon 28 and mostly, all the other supported applications no longer support making XUL windows transparent via CSS (or perhaps, it was busted by Mozilla at some point).
  - If 'transparent' was set as the background color of the splash screen, it will only show either an invisible window or a black box.
  - This is yet to be filed, I have not yet made a test extension to show this (aside from this extension).
  - Pale Moon 27 and FossaMail 27/38 are the only applications that are not exhibiting this bug.
* Add preliminary support for Pale Moon 28+
* Lower the minimum supported version for Basilisk/Firefox

### 1.1.2
* Use HTML5 color picker and update code on disabling elements
  - This also removes the integrated color picker which was made by Andrea Binello since it is no longer needed
  - Update code on disabling elements: Instead of specifying each element ID individually, use its parent element (where possible) and disable all its child elements which is more cleaner and reusable throughout
* Fix #3 - Better handling of splash preview in options window
  - No longer stretches the preview, more accurate size = more clear image
  - Instead of resizing the window (the image might be large), show scrollbars instead
* Fix missing splash image when using in combination with ABPrime
  - Set a default value for "src" attribute of the Splash image element
  - See: https://forum.palemoon.org/viewtopic.php?f=46&p=135956
* Changes under the hood (no effect in functionality)
  - Move Options window's functions to its own file
    - Main splash window no longer has to load a bunch of functions that it doesn't need
  - Stop relying on globally declared preference branch
    - Has the possibility of being overridden by another add-on (and cause adverse effects)
  - Remove useFlex preference
  - Consistent usage of spaces in source files

### 1.1.1
* Provide support for Basilisk and SeaMonkey
  - Splashed! will now work on these applications ^
  - However, transparency is disabled in these applications (probably some others) since it will cause the splash window to either not show or display a black rectangle. This bug is not present in Pale Moon/FossaMail

### 1.1.0
* The -splash cmd arg is now restored
  - Means that even if splash is disabled in the options window, you can force show it by using this command line argument (like in old FF)
* Pref naming (added extensions prefix)
  - Will lose existing configuration. Old backups won't work (because of the "extensions." prefix)
* Use own preference service, stop using nsUserSettings.js
  - In turn makes getting prefs shorter (no need to add prefix)
  - No need to create redundant copies of prefService when only one can be used instead for everything
* Add new pref (splash.notOnURL)
  - To prevent showing splash if browser was launched with -url flag
* Move splash enabled detection to component instead of splash window's onload
* Change original author's url to mozdev page
* Update add-on description and homepage url (now points to wiki)

### 1.0.0
* Initial release