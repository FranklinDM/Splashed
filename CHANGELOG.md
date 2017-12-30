# Changelog

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