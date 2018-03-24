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
    get mStrings() {
        return document.getElementById("splashStrings");
    },

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

        if (document.documentElement.getButton('extra2')) {
            var extra2 = document.documentElement.getButton('extra2');
            extra2.setAttribute('id', 'splash-settings-button');
            extra2.setAttribute('popup', 'splash-settings-popup');
            extra2.setAttribute('dir', 'reverse');
        }

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
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
        fp.init(window, this.mStrings.getString("splash_select_sound"), fp.modeOpen);
        fp.appendFilter(this.mStrings.getString("splash_sound_filter_label"), "*.wav");

        if (fp.show() == fp.returnOK) {
            document.getElementById("pref_splash.soundURL").value = fp.fileURL.spec;
        }
    },

    getImageFile: function () {
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
        fp.init(window, this.mStrings.getString("splash_select_image"), fp.modeOpen);
        fp.appendFilters(fp.filterImages);
        var previewImage = document.getElementById("splash.previewImage");

        if (fp.show() == fp.returnOK) {
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

    exportData: function (mode) {
        function extendInt(input) {
            if (input < 10)
                return "0" + input.toString();
            else
                return input;
        }

        var now = new Date();
        var sDate = extendInt(now.getMonth() + 1) + "/" + extendInt(now.getDate()) + "/" + now.getFullYear();
        var sTtime = extendInt(now.getHours()) + ":" + extendInt(now.getMinutes()) + ":" + extendInt(now.getSeconds());
        var sGMT = now.toGMTString();

        var contents = [];
        contents[0] = "/*\n";
        contents[0] += " * Splashed! Exported Preferences file v2\n";
        contents[0] += " * " + sDate + ", " + sTtime + " (" + sGMT + ")\n";
        contents[0] += " */\n";

        var childList = this.prefBranch.getChildList("");

        for (let i = 0; i < childList.length; i++) {
            switch (this.prefBranch.getPrefType(childList[i])) {
            case this.prefBranch.PREF_BOOL:
                contents[i + 1] = childList[i] + '=' + this.prefBranch.getBoolPref(childList[i]);
                break;
            case this.prefBranch.PREF_INT:
                contents[i + 1] = childList[i] + '=' + this.prefBranch.getIntPref(childList[i]);
                break;
            case this.prefBranch.PREF_STRING:
                // Replace new lines with space
                let tmpString = this.prefBranch.getCharPref(childList[i]);
                tmpString = tmpString.replace(/\n/g, " ");
                contents[i + 1] = childList[i] + '=' + tmpString;
                break;
            }
        }

        // Sort settings alphabetically
        contents.sort();

        // Create string
        var exportString = "";
        for (var i = 0; i < contents.length; i++) {
            exportString += contents[i] + "\n";
        }

        // Copy the string to the clipboard
        if (mode == "copy") {
            var gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
            gClipboardHelper.copyString(exportString);

            alert(this.mStrings.getString('prefs.copy'));
        }
        // Save the string to a text file
        else if (mode == "save") {
            var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
            var stream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);

            fp.init(window, "", fp.modeSave);
            fp.defaultExtension = 'txt';
            fp.defaultString = 'export_splash';
            fp.appendFilters(fp.filterText);

            if (fp.show() != fp.returnCancel) {
                if (fp.file.exists())
                    fp.file.remove(true);
                fp.file.create(fp.file.NORMAL_FILE_TYPE, 0o666);
                stream.init(fp.file, 0x02, 0x200, null);

                stream.write(exportString, exportString.length);
                stream.close();
            }
        }
    },

    importData: function (bReset) {
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
        var useOld = true;

        // Initialize file picker window
        fp.init(window, "", Components.interfaces.nsIFilePicker.modeOpen);
        fp.defaultString = "export_splash.txt";
        fp.defaultExtension = "txt";
        fp.appendFilters(fp.filterText);

        // Show the file picker window and load up selected file
        if (fp.show() != fp.returnCancel) {
            let stream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
            let streamIO = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);

            stream.init(fp.file, 0x01, 0o444, null);
            streamIO.init(stream);

            var input = streamIO.read(stream.available());
            streamIO.close();
            stream.close();

            var linebreak = input.match(/(((\n+)|(\r+))+)/m)[1]; // first: whole match -- second: backref-1 -- etc..
            var pattern = input.split(linebreak);
        }

        // If file was empty/cancelled, return
        if (!pattern)
            return;

        // Check if imported preferences file uses v1 format
        if (!pattern[1].includes('Splashed')) {
            alert(this.mStrings.getString('prefs.invalid'));
            return;
        }

        // If exported preferences is of v2 format, don't use old parser
        if (pattern[1].includes('v2')) {
            useOld = false;
        }

        // Confirm if user really wants to proceed with import
        if (!confirm(this.mStrings.getString('prefs.import')))
            return;

        if (useOld) {
            var mIOService = Components.classes["@mozilla.org/network/io-service;1"]
                .getService(Components.interfaces.nsIIOService);
            var mFileProtocolHandler = mIOService.getProtocolHandler("file")
                .QueryInterface(Components.interfaces.nsIFileProtocolHandler);
            var mURL = mFileProtocolHandler.newFileURI(fp.file)
                .QueryInterface(Components.interfaces.nsIURL);

            var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                getService(Components.interfaces.mozIJSSubScriptLoader);
            loader.loadSubScript(mURL.spec);
        } else {
            var contents = [];
            for (let i = 4; i < pattern.length; i++) {
                var index = pattern[i].indexOf("=");

                if (index > 0) {
                    contents[i] = [];
                    contents[i].push(pattern[i].substring(0, index));
                    contents[i].push(pattern[i].substring(index + 1, pattern[i].length));
                }
            }

            for (let i = 4; i < contents.length; i++) {
                try {
                    switch (this.prefBranch.getPrefType(contents[i][0])) {
                    case this.prefBranch.PREF_STRING:
                        this.prefBranch.setCharPref(contents[i][0], contents[i][1]);
                        break;
                    case this.prefBranch.PREF_BOOL:
                        this.prefBranch.setBoolPref(contents[i][0], /true/i.test(contents[i][1]));
                        break;
                    case this.prefBranch.PREF_INT:
                        this.prefBranch.setIntPref(contents[i][0], contents[i][1]);
                        break;
                    }
                } catch (e) {}
            }
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

// For compatibility
var prefBranch = splashOpt.prefBranch;
