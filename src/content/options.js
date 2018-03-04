/*
********************************************************************************
PROJECT:      Splash!
FILE:         options.js
DESCRIPTION:  Options JS file for splash
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

var splashOpt = {
    prefService: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService),

    get prefBranch() {
        return this.prefService.getBranch("extensions.splash.");
    },
	
    get prefBranchOld() {
        return this.prefService.getBranch("splash.");
    },

    initSettings: function () {
        var splashURL;
        if (this.prefBranch.prefHasUserValue("imageURL")) {
            splashURL = this.prefBranch.getCharPref("imageURL");
        } else {
            splashURL = splash.getDefaultImage();
        }

        document.getElementById("splash.previewImage").src = splashURL;

        this.updateColorPicker('bg');
        this.updateColorPicker('txt');

        this.toggleElementChildren(document.getElementById('splash.timeout.opt'), this.prefBranch.getBoolPref("closeWithMainWindow"));
        this.toggleElementChildren(document.getElementById('splash.text.opt'), this.prefBranch.getBoolPref("textHide"));
        this.toggleElementChildren(document.getElementById('splash.trans.opt'), !this.prefBranch.getBoolPref("trans"));

        this.removeOldPrefs();
    },

    playSound: function (isEnabled) {
        var soundURL = this.prefBranch.getCharPref("soundURL");
        if (soundURL && isEnabled) {
            var gSound = Components.classes["@mozilla.org/sound;1"].
                createInstance(Components.interfaces.nsISound);
            gSound.init();

            var ioService = Components.classes["@mozilla.org/network/io-service;1"].
                getService(Components.interfaces.nsIIOService);
            var url = ioService.newURI(soundURL, null, null);

            gSound.play(url);
        }
    },

    openURL: function (myLink) {
        var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
            .getService(Components.interfaces.nsIWindowMediator);

        var browserWindow = wm.getMostRecentWindow("navigator:browser");

        if (browserWindow) {
            var browserWindow = browserWindow.getBrowser();
            var newTab = browserWindow.addTab(myLink, null, null);
            browserWindow.selectedTab = newTab;
        } else {
            var ioService = Components.classes["@mozilla.org/network/io-service;1"]
                .getService(Components.interfaces.nsIIOService);
            var uri = ioService.newURI(myLink, null, null);
            var extProtocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
                .getService(Components.interfaces.nsIExternalProtocolService);

            extProtocolSvc.loadUrl(uri);
        }
    },

    previewSplashScreen: function () {
        this.playSound(this.prefBranch.getBoolPref("soundEnabled"));
        openDialog("chrome://splash/content/splash.xul", "SplashScreen", "chrome,centerscreen,alwaysRaised,modal=yes");
    },

    resetToDefault: function () {
        var prefArray = this.prefBranch.getChildList("");

        for (let i = 0; i < prefArray.length; i++) {
            if (this.prefBranch.prefHasUserValue(prefArray[i])) {
                this.prefBranch.clearUserPref(prefArray[i]);
            }
        }

        document.getElementById("splash.previewImage").src = document.getElementById("splash.imageURL").value;

        this.getDimensions();
    },

    getSoundFile: function () {
        var mStrings = document.getElementById("splashStrings");

        const nsIFilePicker = Components.interfaces.nsIFilePicker;

        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        fp.init(window, mStrings.getString("splash_select_sound"), nsIFilePicker.modeOpen);
        fp.appendFilter(mStrings.getString("splash_sound_filter_label"), "*.wav");

        var ret = fp.show();

        if (ret == nsIFilePicker.returnOK) {
            document.getElementById("pref_splash.soundURL").value = fp.fileURL.spec;
        }
    },

    getImageFile: function () {
        var mStrings = document.getElementById("splashStrings");

        const nsIFilePicker = Components.interfaces.nsIFilePicker;

        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        fp.init(window, mStrings.getString("splash_select_image"), nsIFilePicker.modeOpen);
        fp.appendFilters(nsIFilePicker.filterImages);
        var previewImage = document.getElementById("splash.previewImage");

        var ret = fp.show();

        if (ret == nsIFilePicker.returnOK) {
            document.getElementById("pref_splash.imageURL").value = fp.fileURL.spec;
            document.getElementById("splash.previewImage").src = fp.fileURL.spec;
            this.getDimensions();
        }
    },

    getDimensions: function () {
        var previewImage = document.getElementById("splash.previewImage");

        var height = previewImage.height;
        var width = previewImage.width;

        // Set text box values
        document.getElementById("splash.windowWidth").value = width;
        document.getElementById("splash.windowHeight").value = height;

        // Set pref values
        splashOpt.prefBranch.setIntPref("windowWidth", width);
        splashOpt.prefBranch.setIntPref("windowHeight", height);
    },

    setDefaultImage: function () {
        var defaultImage = splash.getDefaultImage();
        this.prefBranch.setCharPref('imageURL', defaultImage)
        document.getElementById("splash.previewImage").src = defaultImage;
        this.getDimensions();
    },

    extendInt: function (aInput) {
        if (aInput < 10)
            return "0" + aInput.toString();
        else
            return aInput;
    },

    // TODO: Revise Import & Export data - imposes a security risk
	//		 User might import a script that may do something else
    exportData: function () {
        var prefArray = this.prefBranch.getChildList("");

        var stream = Components.classes['@mozilla.org/network/file-output-stream;1']
            .createInstance(Components.interfaces.nsIFileOutputStream);
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker)

            fp.init(window, "", fp.modeSave);
        fp.defaultExtension = "txt";
        fp.defaultString = "export_splash.txt";
        fp.appendFilters(fp.filterText);
        fp.appendFilters(fp.filterAll);

        if (fp.show() == fp.returnCancel)
            return;

        var str = ""

            prefArray.sort();

        var now = new Date();
        var sDate = this.extendInt(now.getMonth() + 1) + "/" + this.extendInt(now.getDate()) + "/" + now.getFullYear();
        var sTtime = this.extendInt(now.getHours()) + ":" + this.extendInt(now.getMinutes()) + ":" + this.extendInt(now.getSeconds());
        var sGMT = now.toGMTString();

        // File header
        str += "/*\n";
        str += "Splashed! Exported Preferences file\n";
        str += sDate + ", " + sTtime + " (" + sGMT + ")\n";
        str += "*/\n";

        for (let i = 0; i < prefArray.length; ++i) {

            var tmpString // clean up import-export strings

            switch (this.prefBranch.getPrefType(prefArray[i])) {
            case this.prefBranch.PREF_STRING: // Text = 32
                str += "prefBranch.setCharPref('" + prefArray[i] + "', '";
                tmpString = this.prefBranch.getCharPref(prefArray[i]);
                tmpString = tmpString.replace(/\\/g, '\\\\');
                tmpString = tmpString.replace(/\'/g, '\\\'');
                str += tmpString;
                str += "')";
                break;
            case this.prefBranch.PREF_INT: // Integer = 64
                str += "prefBranch.setIntPref('" + prefArray[i] + "', ";
                str += this.prefBranch.getIntPref(prefArray[i]);
                str += ")";
                break;
            case this.prefBranch.PREF_BOOL: // Boolean =128
                str += "prefBranch.setBoolPref('" + prefArray[i] + "', ";
                str += this.prefBranch.getBoolPref(prefArray[i]);
                str += ")";
                break;
            }

            str += "\r\n";
        }

        stream.init(fp.file, 0x20 | 0x02 | 0x08, 0o666, 0);
        stream.write(str, str.length);
        stream.close();
    },

    importData: function (bReset) {
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);

        fp.init(window, "", Components.interfaces.nsIFilePicker.modeOpen);
        fp.defaultString = "export_splash.txt";
        fp.defaultExtension = "txt";
        fp.appendFilters(fp.filterText);
        fp.appendFilters(fp.filterAll);

        var retVal = fp.show()

            if (retVal == Components.interfaces.nsIFilePicker.returnOK) {
                var mIOService = Components.classes["@mozilla.org/network/io-service;1"]
                    .getService(Components.interfaces.nsIIOService);
                var mFileProtocolHandler = mIOService.getProtocolHandler("file")
                    .QueryInterface(Components.interfaces.nsIFileProtocolHandler);
                var mURL = mFileProtocolHandler.newFileURI(fp.file)
                    .QueryInterface(Components.interfaces.nsIURL);

                var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                    getService(Components.interfaces.mozIJSSubScriptLoader);
                loader.loadSubScript(mURL.spec);
            }

            this.initSettings();
    },

    removeOldPrefs: function () {
        var prefArrayOld = this.prefBranchOld.getChildList("");

        // Old prefs (Splash and Splashed v1)
        for (let i = 0; i < prefArrayOld.length; ++i) {
            if (this.prefBranchOld.prefHasUserValue(prefArrayOld[i])) {
                this.prefBranchOld.clearUserPref(prefArrayOld[i]);
            }
        }
    },

    updateColorPicker: function (type) {
        switch (type) {
        case "bg":
            document.getElementById('splash.bgcolorpicker').value = document.getElementById('splash.bgcolor').value;
            break;
        case "txt":
            document.getElementById('splash.txtcolorpicker').value = document.getElementById('splash.txtcolor').value;
            break;
        default:
            // do nothing
        }
    },

    toggleElementChildren: function (elem, state) {
        for (let i = 0; i < elem.children.length; i++) {
            elem.children[i].disabled = state;
            // If element still has children, go and set its state also
            if (elem.children[i].children.length != 0) {
                this.toggleElementChildren(elem.children[i], state);
            }
        }
    }
}
