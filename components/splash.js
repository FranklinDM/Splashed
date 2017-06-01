/* Most of the contents of this file were based on DOM Inspector's component for command line handling */

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

const nsICommandLineHandler = Components.interfaces.nsICommandLineHandler;
const nsISupportsString     = Components.interfaces.nsISupportsString;
const nsIWindowWatcher      = Components.interfaces.nsIWindowWatcher;
const nsIIOService			= Components.interfaces.nsIIOService;
const nsISound				= Components.interfaces.nsISound;
const nsIPrefBranch			= Components.interfaces.nsIPrefBranch;

function SplashCmdLineHandler() {}

SplashCmdLineHandler.prototype = {

  classDescription: "Splashed Command Line Handler",
  classID: Components.ID("{924217E9-F8FE-4B92-B8E1-F781D4ABB31E}"),
  contractID: "@mozilla.org/commandlinehandler/general-startup;1?type=splash",
  firstTime: true,

  /* Needed for XPCOMUtils NSGetModule */
  _xpcom_categories: [{category: "command-line-handler",
                       entry: "m-splash"}],
  
  /* nsISupports */
  QueryInterface : XPCOMUtils.generateQI([nsICommandLineHandler]),
  
  /* nsICommandLineHandler */
  handle : function handler_handle(cmdLine) {
    if (this.firstTime) {
      var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(nsIPrefBranch)

      var isEnabled = prefService.getBoolPref("splash.soundEnabled")
      var soundURL = prefService.getComplexValue("splash.soundURL", nsISupportsString).data;

      if (soundURL && isEnabled) {
        var gSound = Components.classes["@mozilla.org/sound;1"].createInstance(nsISound);

        gSound.init();

        var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(nsIIOService);
        var url = ioService.newURI(soundURL, null, null);
        
        gSound.play(url);
      }

      var args = null;
      var wwatch = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(nsIWindowWatcher);
      var myModal = "modal=" + (prefService.getBoolPref("splash.closeWithMainWindow") ? "no" : "yes")

      wwatch.openWindow(null, "chrome://splash/content/splash.xul", "_blank", "chrome,centerscreen,alwaysRaised=yes,titlebar=no," + myModal, args);
      this.firstTime = false;
    }
  },
  
  helpInfo : "  Splash \n"
};

if (XPCOMUtils.generateNSGetFactory)
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([SplashCmdLineHandler]);
else
    var NSGetModule = XPCOMUtils.generateNSGetModule([SplashCmdLineHandler]);