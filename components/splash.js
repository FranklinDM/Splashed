/*
********************************************************************************
PROJECT:      Splash!
FILE:         splash.js
DESCRIPTION:  Main JS component for startup
AUTHOR:  	  aldreneo aka slyfox, mrtech, FranklinDM
LICENSE:      GNU GPL (General Public License)
------------------------------------------------------------------------------
Original copyright (c) 2006 aldreneo aka slyfox and mrtech
Copyright (c) 2017 FranklinDM
******************************************************************************
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/
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

      var wwatch = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(nsIWindowWatcher);
      var myModal = "modal=" + (prefService.getBoolPref("splash.closeWithMainWindow") ? "no" : "yes")
	  
	  wwatch.openWindow(null, "chrome://splash/content/splash.xul", "_blank", "chrome,centerscreen,alwaysRaised=yes," + myModal, null);
      this.firstTime = false;
    }
  },
  
  helpInfo : "  Splash \n"
};

if (XPCOMUtils.generateNSGetFactory)
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([SplashCmdLineHandler]);
else
    var NSGetModule = XPCOMUtils.generateNSGetModule([SplashCmdLineHandler]);