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
    init: function () {
        var prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
        var prefBranch = prefService.getBranch("extensions.splash.");
        var splashWindow = document.getElementById("splashscreen"),
        splashImg = document.getElementById("splash.image"),
        splashBox = document.getElementById("splashBox"),
        splashTxt = document.getElementById("splash.text"),
        splashProgMeter = document.getElementById("splash.progressMeter");

        splashWindow.setAttribute("style", prefBranch.getCharPref("windowStyle"));

        splashImg.src = prefBranch.getCharPref("imageURL");
        splashImg.height = prefBranch.getIntPref("windowHeight");
        splashImg.width = prefBranch.getIntPref("windowWidth");

        var bgColor = prefBranch.getCharPref("bgcolor");
        if (bgColor) {
            // XXX: Disallow setting a transparent background color for the splash screen window
            /*
             * This is a result of a still-unfixed bug affecting UXP wherein
             * setting a chromeless window's background color to transparent
             * will result to either the splash screen not being displayed or
             * a black box filling in the supposed location of the splash screen.
             */
            if (bgColor.toLowerCase() == "transparent")
            {
                bgColor = "-moz-Dialog";
            }
            splashBox.setAttribute("style", "background-color: " + bgColor)
        }

        var trans = prefBranch.getBoolPref("trans");
        if (trans) {
            splashImg.style.opacity = prefBranch.getCharPref("transvalue_img");
            splashTxt.style.opacity = prefBranch.getCharPref("transvalue_txt");
            splashBox.style.opacity = prefBranch.getCharPref("transvalue_box");
            splashProgMeter.style.opacity = prefBranch.getCharPref("transvalue_mtr");
        }

        if (!prefBranch.getBoolPref("textHide")) {
            var txColor = prefBranch.getCharPref("txtcolor");
            if (txColor) {
                txColor = ";color: " + txColor;
            }

            splashTxt.setAttribute("style", prefBranch.getCharPref("textStyle") + txColor);

            var textOverride = prefBranch.getCharPref("textOverride");
            if (textOverride) {
                textOverride = textOverride.replace(/{appVersion}/ig, Services.appinfo.version);
                textOverride = textOverride.replace(/{buildID}/ig, Services.appinfo.appBuildID);
                textOverride = textOverride.replace(/{userAgent}/ig, navigator.userAgent);

                splashTxt.value = textOverride;
            }
            splashTxt.hidden = false;
        }

        if (!prefBranch.getBoolPref("progressMeterHide")) {
            splashProgMeter.hidden = false;
        }

        setTimeout(window.close, prefBranch.getIntPref("timeout"));
    },

    setAlwaysOnTop: function (topmost) {
        try {
            let lib = ctypes.open("user32.dll");
            let getActiveWindow = 0;

            try {
                getActiveWindow = lib.declare("GetActiveWindow", ctypes.winapi_abi, ctypes.int32_t);
            } catch (e) {
                getActiveWindow = lib.declare("GetActiveWindow", ctypes.stdcall_abi, ctypes.int32_t);
            }

            if (getActiveWindow != 0) {
                let setWindowPos = 0;
                try {
                    setWindowPos = lib.declare("SetWindowPos",
                            ctypes.winapi_abi,
                            ctypes.bool,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.uint32_t);
                } catch (e) {
                    setWindowPos = lib.declare("SetWindowPos",
                            ctypes.stdcall_abi,
                            ctypes.bool,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.int32_t,
                            ctypes.uint32_t);
                }

                // Determine whether to set the window as always on top
                let HWND = -2;
                if (topmost)
                    HWND = -1;

                setWindowPos(getActiveWindow(), HWND, 0, 0, 0, 0, 19);
            }

            lib.close();
        } catch (e) {}
    },
    
    determineOnTop: function () {
        if (Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("extensions.splash.").getBoolPref("alwaysOnTop"))
            splash.setAlwaysOnTop(true);
    }
};
