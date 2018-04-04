# Changelog

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