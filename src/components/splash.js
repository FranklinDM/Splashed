/*
********************************************************************************
PROJECT:      Splash!
FILE:         splash.js
DESCRIPTION:  Main JS component for startup
AUTHOR:       aldreneo aka slyfox, mrtech, Franklin DM
LICENSE:      GNU GPL (General Public License)
--------------------------------------------------------------------------------
Copyright (c) 2006 aldreneo aka slyfox and mrtech
Copyright (c) 2017 Franklin DM
********************************************************************************

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

const Ci = Components.interfaces;
const Cc = Components.classes;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

function SplashCmdLineHandler() {}

SplashCmdLineHandler.prototype = {
    classDescription: "Splashed Command Line Handler",
    classID: Components.ID("{924217E9-F8FE-4B92-B8E1-F781D4ABB31E}"),
    contractID: "@mozilla.org/commandlinehandler/general-startup;1?type=splash",
    chromeUrlForTask: "chrome://splash/content/splash.xul",
    splashShown: false,

    /* Needed for XPCOMUtils NSGetModule */
    _xpcom_categories: [{
            category: "command-line-handler",
            entry: "m-splash"
        }
    ],

    /* nsISupports */
    QueryInterface: XPCOMUtils.generateQI([Ci.nsICommandLineHandler]),

    /* nsICommandLineHandler */
    handle: function handler_handle(cmdLine) {
        let prefBranch = Cc["@mozilla.org/preferences-service;1"]
                            .getService(Ci.nsIPrefService)
                            .getBranch("extensions.splash.");
        let splashEnabled = prefBranch.getBoolPref("enabled");
        
        if (this.splashShown || !splashEnabled) {
            return;
        }

        let soundEnabled = prefBranch.getBoolPref("soundEnabled");
        let soundURL = prefBranch.getComplexValue("soundURL", Ci.nsISupportsString).data;

        if (soundEnabled && soundURL) {
            let gSound = Cc["@mozilla.org/sound;1"].createInstance(Ci.nsISound);
            gSound.init();
            let ioService = Cc["@mozilla.org/network/io-service;1"]
                               .getService(Ci.nsIIOService);
            let soundURI = ioService.newURI(soundURL, null, null);
            gSound.play(soundURI);
        }

        let windowWatcher = Cc["@mozilla.org/embedcomp/window-watcher;1"]
                               .getService(Ci.nsIWindowWatcher);
        let windowModal = "modal=" + (prefBranch.getBoolPref("closeWithMainWindow") ? "no" : "yes");
        let windowFeatures = "chrome,centerscreen,alwaysRaised=yes," + windowModal;
        windowWatcher.openWindow(null, this.chromeUrlForTask, "_blank", windowFeatures, null);
        
        this.splashShown = true;
    },

    helpInfo: "  Splash \n"
};

if (XPCOMUtils.generateNSGetFactory) {
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([SplashCmdLineHandler]);
} else {
    var NSGetModule = XPCOMUtils.generateNSGetModule([SplashCmdLineHandler]);
}
