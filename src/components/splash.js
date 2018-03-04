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
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

const nsICommandLineHandler = Components.interfaces.nsICommandLineHandler;
const nsISupportsString     = Components.interfaces.nsISupportsString;
const nsIWindowWatcher      = Components.interfaces.nsIWindowWatcher;
const nsIIOService          = Components.interfaces.nsIIOService;
const nsISound              = Components.interfaces.nsISound;
const nsIPrefService        = Components.interfaces.nsIPrefService;
const prefService           = Components.classes["@mozilla.org/preferences-service;1"].getService(nsIPrefService);
const prefBranch            = prefService.getBranch("extensions.splash.");

function SplashCmdLineHandler() {}

SplashCmdLineHandler.prototype = {
    classDescription: "Splashed Command Line Handler",
    classID: Components.ID("{924217E9-F8FE-4B92-B8E1-F781D4ABB31E}"),
    contractID: "@mozilla.org/commandlinehandler/general-startup;1?type=splash",
    chromeUrlForTask: "chrome://splash/content/splash.xul",
    helpText: "Start with Splash.",
    handlesArgs: true,
    defaultArgs: "",
    openWindowWithArgs: true,
    firstTime: true,

    /* Needed for XPCOMUtils NSGetModule */
    _xpcom_categories: [{
            category: "command-line-handler",
            entry: "m-splash"
        }
    ],

    /* nsISupports */
    QueryInterface: XPCOMUtils.generateQI([nsICommandLineHandler]),

    /* nsICommandLineHandler */
    handle: function handler_handle(cmdLine) {
        var showSplash = false;

        if (this.firstTime) {
            // There are two cases in which to show the splash screen:
            // 1) extensions.splash.enabled is set to True
            // 2) The -splash flag is included in the command line arguments
            // But don't show the splash screen if the browser was invoked by an external URL
            // Unless extensions.splash.notOnURL is set to False
            if (cmdLine.findFlag("url", false) == -1 | !prefBranch.getBoolPref("notOnURL")) {
                if (prefBranch.getBoolPref("enabled")) {
                    showSplash = true;
                } else if (cmdLine.findFlag("splash", false) != -1) {
                    showSplash = true;
                }
            }
        }

        if (showSplash) {
            var isEnabled = prefBranch.getBoolPref("soundEnabled");
            var soundURL = prefBranch.getComplexValue("soundURL", nsISupportsString).data;

            if (soundURL && isEnabled) {
                var gSound = Components.classes["@mozilla.org/sound;1"].createInstance(nsISound);

                gSound.init();

                var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(nsIIOService);
                var url = ioService.newURI(soundURL, null, null);

                gSound.play(url);
            }

            var wwatch = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(nsIWindowWatcher);
            var myModal = "modal=" + (prefBranch.getBoolPref("closeWithMainWindow") ? "no" : "yes");

            wwatch.openWindow(null, this.chromeUrlForTask, "_blank", "chrome,centerscreen,alwaysRaised=yes," + myModal, null);
            this.firstTime = false;
        }
    },

    helpInfo: "  Splash \n"
};

if (XPCOMUtils.generateNSGetFactory)
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([SplashCmdLineHandler]);
else
    var NSGetModule = XPCOMUtils.generateNSGetModule([SplashCmdLineHandler]);
