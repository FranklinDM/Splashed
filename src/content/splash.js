/*
******************************************************************************
PROJECT:      Splash!
FILE:         splash.js
DESCRIPTION:  Main JS file for splash
AUTHOR:  	  aldreneo aka slyfox, mrtech, Franklin DM
LICENSE:      GNU GPL (General Public License)
------------------------------------------------------------------------------
Copyright (c) 2006 aldreneo aka slyfox and mrtech
Copyright (c) 2017 Franklin DM
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
var prefService			= Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
var prefBranch			= prefService.getBranch("extensions.splash.");
var prefBranchOld		= prefService.getBranch("splash.");

var splash = {
  init: function() {
    splash.resetValues(); // reset all prefs on major upgrades

    // custom handling for background transparency
	document.getElementById("splashscreen").setAttribute("style", "background-color: transparent;" + prefBranch.getCharPref("windowStyle"));

    // If the imageURL is the default value and we are running Thunderbird,
    // we need to change the default about image location
    //var branchService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
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
  		var trans_img=prefBranch.getCharPref("transvalue_img");
  		var trans_txt=prefBranch.getCharPref("transvalue_txt");
  		var trans_box=prefBranch.getCharPref("transvalue_box");
  		var trans_mtr=prefBranch.getCharPref("transvalue_mtr");
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

  initSettings: function() {
    var splashURL;
    if (prefBranch.prefHasUserValue("imageURL")) {
      splashURL = prefBranch.getCharPref("imageURL");
    } else {
      splashURL = splash.getDefaultImage();
    }

    document.getElementById("splash.previewImage").src = splashURL;
  },

  playSound: function(isEnabled) {
    var soundURL = prefBranch.getCharPref("soundURL");
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

  getAppName: function() {
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

  openURL: function(myLink) {
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

  previewSplashScreen: function() {
    splash.playSound(prefBranch.getBoolPref("soundEnabled"));
    openDialog("chrome://splash/content/splash.xul", "SplashScreen", "chrome,centerscreen,alwaysRaised,modal=yes");
  },

  resetToDefault: function() {
    var prefCount = {value:0};
    var prefArray = prefBranch.getChildList("", prefCount);

    for (var i = 0; i < prefArray.length; i++) {
      if (prefBranch.prefHasUserValue(prefArray[i])) {
         prefBranch.clearUserPref(prefArray[i]);
      }
    }

    document.getElementById("splash.previewImage").src = document.getElementById("splash.imageURL").value;

    setTimeout(splash.sizeToContent, 500);
  },

  getSoundFile: function() {
    var mStrings = document.getElementById("splashStrings");

    const nsIFilePicker = Components.interfaces.nsIFilePicker;

    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, mStrings.getString("splash_select_sound"), nsIFilePicker.modeOpen);
    fp.appendFilter(mStrings.getString("splash_sound_filter_label"), "*.wav");

    var ret = fp.show();

    if(ret == nsIFilePicker.returnOK) {
     document.getElementById("pref_splash.soundURL").value = fp.fileURL.spec;
    }
  },

  getImageFile: function() {
    var mStrings = document.getElementById("splashStrings");

    const nsIFilePicker = Components.interfaces.nsIFilePicker;

    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, mStrings.getString("splash_select_image"), nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterImages);
    var previewImage = document.getElementById("splash.previewImage");


    var ret = fp.show();

    if(ret == nsIFilePicker.returnOK) {
      document.getElementById("pref_splash.imageURL").value = fp.fileURL.spec;
      document.getElementById("splash.previewImage").src = fp.fileURL.spec;
      setTimeout(splash.sizeToContent, 250);
    }
  },

  getDefaultImage: function() {
    var splashDefaultURL

    switch (splash.getAppName()) {
      case "Thunderbird":
        splashDefaultURL = "chrome://branding/content/about-thunderbird.png";
        break;
      default:
        splashDefaultURL = "chrome://branding/content/about.png";
    }
    return splashDefaultURL;
  },

  setDefaultImage: function() {
    var defaultImage = splash.getDefaultImage();
    prefBranch.setCharPref('imageURL', defaultImage)
    document.getElementById("splash.previewImage").src = defaultImage;
    setTimeout(splash.sizeToContent, 250);
  },

  getDimensions: function() {
    splash.sizeToContent();
    var previewImage = document.getElementById("splash.previewImage");

    document.getElementById("splash.windowWidth").value = previewImage.boxObject.width;
    document.getElementById("splash.windowHeight").value = previewImage.boxObject.height;

    prefBranch.setIntPref("windowWidth", previewImage.boxObject.width);
    prefBranch.setIntPref("windowHeight", previewImage.boxObject.height);
  },
  
  extendInt: function(aInput) {
    if(aInput < 10) return "0" + aInput.toString();
    else return aInput;
  },

  exportData: function() {
    var prefCount = {value:0};
    var prefArray = prefBranch.getChildList("", prefCount);

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
	
    for (var i = 0; i < prefArray.length; ++i) {

      var tmpString // clean up import-export strings

      switch (prefBranch.getPrefType(prefArray[i])) {
        case prefBranch.PREF_STRING:	// Text = 32
          str += "prefBranch.setCharPref('" + prefArray[i] + "', '";
          tmpString = prefBranch.getCharPref(prefArray[i]);
          tmpString = tmpString.replace(/\\/g, '\\\\');
          tmpString = tmpString.replace(/\'/g, '\\\'');
          str += tmpString;
          str += "')";
          break;
        case prefBranch.PREF_INT:		// Integer = 64
          str += "prefBranch.setIntPref('" + prefArray[i] + "', ";
          str += prefBranch.getIntPref(prefArray[i]);
          str += ")";
          break;
        case prefBranch.PREF_BOOL:		// Boolean =128
          str += "prefBranch.setBoolPref('" + prefArray[i] + "', ";
          str += prefBranch.getBoolPref(prefArray[i]);
          str += ")";
          break;
      }

      str += "\r\n"
    }

    stream.init(fp.file, 0x20|0x02|0x08, 0o666, 0);
    stream.write(str, str.length);
    stream.close();
  },

  importData: function(bReset) {
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker)

    fp.init(window, "", Components.interfaces.nsIFilePicker.modeOpen);
    fp.defaultString = "export_splash.txt";
    fp.defaultExtension = "txt";
    fp.appendFilters(fp.filterText);
    fp.appendFilters(fp.filterAll);

    var retVal = fp.show()

    if (retVal == Components.interfaces.nsIFilePicker.returnOK) {
      var mIOService = Components.classes["@mozilla.org/network/io-service;1"]
                         .getService(Components.interfaces.nsIIOService)
      var mFileProtocolHandler = mIOService.getProtocolHandler("file")
                                   .QueryInterface(Components.interfaces.nsIFileProtocolHandler)
      var mURL = mFileProtocolHandler.newFileURI(fp.file)
                   .QueryInterface(Components.interfaces.nsIURL);

      var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
        getService(Components.interfaces.mozIJSSubScriptLoader);
      loader.loadSubScript(mURL.spec);
    }

    splash.initSettings();
  },

  resetValues: function() {
    var myResetVersion = "1.0.0", thisResetVersion = "1.1.0";
	if (prefBranch.getPrefType("resetVersion")) myResetVersion = prefBranch.getCharPref("resetVersion");

	if (myResetVersion != thisResetVersion) {
      var prefCount    = {value:0};
      var prefArray    = prefBranch.getChildList("", prefCount);
      var prefArrayOld = prefBranchOld.getChildList("", prefCount);

      for (var i = 0; i < prefArray.length; ++i) {
        if (prefBranch.prefHasUserValue(prefArray[i])) {
           prefBranch.clearUserPref(prefArray[i]);
        }
      }
	  
	  // Old prefs (Splash and Splashed v1)
      for (var i = 0; i < prefArrayOld.length; ++i) {
        if (prefBranchOld.prefHasUserValue(prefArrayOld[i])) {
           prefBranchOld.clearUserPref(prefArrayOld[i]);
        }
      }
	  
	  prefBranch.setCharPref("resetVersion", thisResetVersion);
	}
  },

  opencsseditor: function(setting) {
  		var url = "chrome://splash/content/webcolornames/webcolornames.xul";
  		var win = openDialog(url, "webcolornames", "chrome,centerscreen,resizable", setting);
  },

  sizeToContent: function() {
      window.sizeToContent();
  }
}

function logString(aLogString) {
  var mConsoleService = Components.classes["@mozilla.org/consoleservice;1"]
         .getService(Components.interfaces.nsIConsoleService)

	if(mConsoleService) {
  	mConsoleService.logStringMessage("Splash: " + aLogString + "\n");
  }
}