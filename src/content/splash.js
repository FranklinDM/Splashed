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

var splash = {
    init: function () {
        var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
        var prefBranch = prefService.getBranch("extensions.splash.");
        // custom handling for background transparency
        switch (splash.getAppName()) {
            // Pale Moon & FossaMail don't exhibit the transparency bug (yet to be filed)
            // When the background is set to transparent, other browsers
            // don't show the window or show a black square with nothing inside it
        case "Pale Moon":
        case "FossaMail":
            document.getElementById("splashscreen").setAttribute("style", "background-color: transparent;" + prefBranch.getCharPref("windowStyle"));
            break;
        default:
            document.getElementById("splashscreen").setAttribute("style", prefBranch.getCharPref("windowStyle"));
        }

        // If the imageURL is the default value and we are running Thunderbird,
        // we need to change the default about image location
        var splashURL;

        if (prefBranch.prefHasUserValue("imageURL")) {
            splashURL = prefBranch.getCharPref("imageURL");
        } else {
            splashURL = splash.getDefaultImage();
            prefBranch.setCharPref("imageURL", splashURL)
        }

        document.getElementById("splash.image").src = splashURL;
        document.getElementById("splash.image").height = prefBranch.getIntPref("windowHeight");
        document.getElementById("splash.image").width = prefBranch.getIntPref("windowWidth");

        var bgColor = prefBranch.getCharPref("bgcolor");
        if (bgColor) {
            bgColor = "background-color: " + bgColor;
            document.getElementById("splashBox").setAttribute("style", bgColor)
        }

        var trans = prefBranch.getBoolPref("trans");
        if (trans) {
            var trans_img = prefBranch.getCharPref("transvalue_img");
            var trans_txt = prefBranch.getCharPref("transvalue_txt");
            var trans_box = prefBranch.getCharPref("transvalue_box");
            var trans_mtr = prefBranch.getCharPref("transvalue_mtr");
            document.getElementById("splash.image").style.opacity = trans_img;
            document.getElementById("splash.text").style.opacity = trans_txt;
            document.getElementById("splashBox").style.opacity = trans_box;
            document.getElementById("splash.progressMeter").style.opacity = trans_mtr;
        }

        if (!prefBranch.getBoolPref("textHide")) {
            var txColor = prefBranch.getCharPref("txtcolor");
            if (txColor) {
                txColor = ";color: " + txColor;
            }

            document.getElementById("splash.text").setAttribute("style", prefBranch.getCharPref("textStyle") + txColor);

            var textOverride = prefBranch.getCharPref("textOverride");
            if (textOverride) {
                var appInfo = Components.classes['@mozilla.org/xre/app-info;1'].getService(Components.interfaces.nsIXULAppInfo);
                textOverride = textOverride.replace(/{appVersion}/ig, appInfo.version);
                textOverride = textOverride.replace(/{buildID}/ig, appInfo.appBuildID);
                textOverride = textOverride.replace(/{userAgent}/ig, navigator.userAgent);

                document.getElementById("splash.text").value = textOverride;
            }
            document.getElementById("splash.text").hidden = false;
        }

        if (!prefBranch.getBoolPref("progressMeterHide")) {
            document.getElementById("splash.progressMeter").hidden = false;
        }

        if (prefBranch.getBoolPref("useFlex")) {
            document.getElementById("f1").flex = 1;
            document.getElementById("f2").flex = 1;
        }

        setTimeout(window.close, prefBranch.getIntPref("timeout"));
    },

    getAppName: function () {
        var myBrandingPath = null;
        var myStringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"]
            .getService(Components.interfaces.nsIStringBundleService);

        if (typeof Components.interfaces.nsIXULAppInfo == "undefined") {
            myBrandingPath = "chrome://global/locale/brand.properties"
        } else {
            myBrandingPath = "chrome://branding/locale/brand.properties"
        }

        var myBrandStrings = myStringBundleService.createBundle(myBrandingPath);

        return myBrandStrings.GetStringFromName("brandShortName");
    },

    getDefaultImage: function () {
        var splashDefaultURL

        switch (splash.getAppName()) {
        case "Thunderbird":
            splashDefaultURL = "chrome://branding/content/about-thunderbird.png";
            break;
        default:
            splashDefaultURL = "chrome://branding/content/about.png";
        }
        return splashDefaultURL;
    }
}
