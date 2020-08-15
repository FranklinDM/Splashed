/*
********************************************************************************
PROJECT:      Splash!
FILE:         splash.js
DESCRIPTION:  Main JS file for splash
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

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/ctypes.jsm");

var splash = {
    prefBranch: Cc["@mozilla.org/preferences-service;1"]
                    .getService(Ci.nsIPrefService)
                    .getBranch("extensions.splash."),
    
    init: function () {
        let splashWindow = document.getElementById("splashscreen");
        let splashImg = document.getElementById("splash.image");
        let splashBox = document.getElementById("splashBox");
        let splashTxt = document.getElementById("splash.text");
        let splashProgMeter = document.getElementById("splash.progressMeter");

        splashWindow.setAttribute("style", splash.prefBranch.getCharPref("windowStyle"));

        splashImg.src = splash.prefBranch.getCharPref("imageURL");
        splashImg.height = splash.prefBranch.getIntPref("windowHeight");
        splashImg.width = splash.prefBranch.getIntPref("windowWidth");

        let bgColor = splash.prefBranch.getCharPref("bgcolor");
        if (bgColor) {
            // XXX: Disallow setting a transparent background color for the splash screen window
            /*
             * This is a result of a still-unfixed bug affecting UXP wherein
             * setting a chromeless window's background color to transparent
             * will result to either the splash screen not being displayed or
             * a black box filling in the supposed location of the splash screen.
             */
            if (bgColor.toLowerCase() == "transparent") {
                bgColor = "-moz-Dialog";
            }
            splashBox.setAttribute("style", "background-color: " + bgColor)
        }

        let trans = splash.prefBranch.getBoolPref("trans");
        if (trans) {
            splashImg.style.opacity = splash.prefBranch.getCharPref("transvalue_img");
            splashTxt.style.opacity = splash.prefBranch.getCharPref("transvalue_txt");
            splashBox.style.opacity = splash.prefBranch.getCharPref("transvalue_box");
            splashProgMeter.style.opacity = splash.prefBranch.getCharPref("transvalue_mtr");
        }

        if (!splash.prefBranch.getBoolPref("textHide")) {
            let txColor = splash.prefBranch.getCharPref("txtcolor");
            if (txColor) {
                txColor = ";color: " + txColor;
            }

            splashTxt.setAttribute("style", splash.prefBranch.getCharPref("textStyle") + txColor);

            let textOverride = splash.prefBranch.getComplexValue("textOverride", Ci.nsISupportsString).data;
            if (textOverride) {
                textOverride = textOverride.replace(/{appVersion}/ig, Services.appinfo.version);
                textOverride = textOverride.replace(/{buildID}/ig, Services.appinfo.appBuildID);
                textOverride = textOverride.replace(/{userAgent}/ig, navigator.userAgent);

                splashTxt.value = textOverride;
            }
            splashTxt.hidden = false;
        }

        if (!splash.prefBranch.getBoolPref("progressMeterHide")) {
            splashProgMeter.hidden = false;
        }

        setTimeout(window.close, splash.prefBranch.getIntPref("timeout"));
        // XXX: Calling sizeToContent on Windows causes the window frame to
        //      be visible for a split second. Might consider computing the
        //      correct window size manually in the future as a workaround.
        window.sizeToContent();
    },

    updateWindowState: function () {
        if (Services.appinfo.OS != "WINNT") {
            return;
        }

        try {
            let lib = ctypes.open("user32.dll");
            let setWindowPos = lib.declare("SetWindowPos",
                            ctypes.winapi_abi,
                            ctypes.bool,
                            ctypes.voidptr_t,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.uint32_t);

            let baseWindow = window.QueryInterface(Ci.nsIInterfaceRequestor)
                              .getInterface(Ci.nsIWebNavigation)
                              .QueryInterface(Ci.nsIDocShellTreeItem)
                              .treeOwner
                              .QueryInterface(Ci.nsIInterfaceRequestor)
                              .getInterface(Ci.nsIBaseWindow);
            let hWndString = baseWindow.nativeHandle;
            let hWnd = ctypes.voidptr_t(ctypes.UInt64(hWndString));
            
            // Determine if the window should be topmost
            let hWndInsertAfter = -2;
            if (splash.prefBranch.getBoolPref("alwaysOnTop")) {
                hWndInsertAfter = -1;
            }
            
            // XXX: Window widget code (nsWindow.cpp) on Windows performs incorrect sizing
            //      if the the window frame is hidden and has to be manually set or else a
            //      black background appears on the unused space after calling sizeToContent.
            setWindowPos(hWnd, hWndInsertAfter, 0, 0, document.width, document.height, 18);

            lib.close();
        } catch (e) {}
    }
};
