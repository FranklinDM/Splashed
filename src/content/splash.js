//******************************************************************************
// PROJECT:      Splash!
// FILE:         splash.js
// DESCRIPTION:  Main javascript file for Splash
// AUTHOR:  aldreneo aka slyfox and mrtech
// LICENSE:      GNU GPL (General Public License)
//------------------------------------------------------------------------------
//Copyright (c) 2006 aldreneo aka slyfox and mrtech
//******************************************************************************

// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

var splash_PrefBranchPrefix = "splash."
var splash = {
  init: function() {
    splash.resetValues(); // reset all prefs on major upgrades

    if (!nsPreferences.getBoolPref("splash.enabled")) {
      window.close();
    }

    // custom handling for background transparency
	document.getElementById("splashscreen").setAttribute("style", "background-color: transparent;" + nsPreferences.copyUnicharPref("splash.windowStyle"));

    // If the imageURL is the default value and we are running Thunderbird, 
    // we need to change the default about image location
    var branchService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var splashURL;

    if (branchService.prefHasUserValue("splash.imageURL")) {
      splashURL = nsPreferences.copyUnicharPref("splash.imageURL");
    } else {
      splashURL = splash.getDefaultImage();
      nsPreferences.setUnicharPref("splash.imageURL", splashURL)
    }

    document.getElementById("splash.image").src = splashURL;
    document.getElementById("splash.image").height = nsPreferences.getIntPref("splash.windowHeight");
    document.getElementById("splash.image").width = nsPreferences.getIntPref("splash.windowWidth");
    
    var bgColor = nsPreferences.copyUnicharPref("splash.bgcolor");
    if (bgColor) {    
      bgColor = "background-color: " + bgColor;
      document.getElementById("splashBox").setAttribute("style", bgColor)
    }
	
  	var trans = nsPreferences.getBoolPref("splash.trans");
  	if (trans) {
  		var trans_img=nsPreferences.copyUnicharPref("splash.transvalue_img");
  		var trans_txt=nsPreferences.copyUnicharPref("splash.transvalue_txt");
  		var trans_box=nsPreferences.copyUnicharPref("splash.transvalue_box");	
  		var trans_mtr=nsPreferences.copyUnicharPref("splash.transvalue_mtr");	
  		document.getElementById("splash.image").style.opacity = trans_img;
  		document.getElementById("splash.text").style.opacity = trans_txt;
  		document.getElementById("splashBox").style.opacity = trans_box;
  		document.getElementById("splash.progressMeter").style.opacity = trans_mtr;
  	}

    if (!nsPreferences.getBoolPref("splash.textHide")) {
	
		var txColor = nsPreferences.copyUnicharPref("splash.txtcolor");
			if (txColor) {    
			txColor = ";color: " + txColor;
		}
	  
	  document.getElementById("splash.text").setAttribute("style", nsPreferences.copyUnicharPref("splash.textStyle") + txColor );

      var textOverride = nsPreferences.copyUnicharPref("splash.textOverride");
      if (textOverride) {
        var appInfo = Components.classes['@mozilla.org/xre/app-info;1'].getService(Components.interfaces.nsIXULAppInfo);
        textOverride = textOverride.replace(/{appVersion}/ig, appInfo.version);
        textOverride = textOverride.replace(/{buildID}/ig, appInfo.appBuildID);
        textOverride = textOverride.replace(/{userAgent}/ig, navigator.userAgent);

        document.getElementById("splash.text").value = textOverride; 
      }
      document.getElementById("splash.text").hidden = false; 
    }

    if (!nsPreferences.getBoolPref("splash.progressMeterHide")) {
      document.getElementById("splash.progressMeter").hidden = false;
    }

    setTimeout(window.close, nsPreferences.getIntPref("splash.timeout"));

  },
  
  initSettings: function() {
    var splashURL

    var branchService = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefBranch);

    if (branchService.prefHasUserValue("splash.imageURL")) {
      splashURL = nsPreferences.copyUnicharPref("splash.imageURL");
    } else {
      splashURL = splash.getDefaultImage();
    }

    document.getElementById("splash.previewImage").src = splashURL;
  },
 
  playSound: function(isEnabled) {
    var soundURL = nsPreferences.copyUnicharPref("splash.soundURL");
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
    splash.playSound(nsPreferences.getBoolPref("splash.soundEnabled"));
    openDialog("chrome://splash/content/splash.xul", "SplashScreen",
              "chrome,centerscreen,alwaysRaised,titlebar=no,modal=yes");
  },

  openProfileLoader: function() {
    openDialog("chrome://splash/content/profile.xul", "Profile", "centerscreen,resizeable");
  },

  resetToDefault: function() {
    var prefService = Components.classes["@mozilla.org/preferences-service;1"].
      getService(Components.interfaces.nsIPrefService);

    var nsIPrefBranchObj = prefService.getBranch("splash.");
    var prefCount = {value:0}; 
    var prefArray = nsIPrefBranchObj.getChildList("" , prefCount); 

    var branchService = Components.classes["@mozilla.org/preferences-service;1"]
                                   .getService(Components.interfaces.nsIPrefBranch);

    for (var i = 0; i < prefArray.length; ++i) {
      if (branchService.prefHasUserValue("splash." + prefArray[i])) {
         branchService.clearUserPref("splash." + prefArray[i]);
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
    nsPreferences.setUnicharPref('splash.imageURL', defaultImage)
    document.getElementById("splash.previewImage").src = defaultImage;
    setTimeout(splash.sizeToContent, 250);
  },
  
  getDimensions: function() {
    splash.sizeToContent();
    var previewImage = document.getElementById("splash.previewImage");
    
    document.getElementById("splash.windowWidth").value = previewImage.boxObject.width;
    document.getElementById("splash.windowHeight").value = previewImage.boxObject.height;
    
    nsPreferences.setIntPref("splash.windowWidth", previewImage.boxObject.width);
    nsPreferences.setIntPref("splash.windowHeight", previewImage.boxObject.height);
  },

  exportData: function() {

    var prefService = Components.classes["@mozilla.org/preferences-service;1"].
      getService(Components.interfaces.nsIPrefService);

    var nsIPrefBranchObj = prefService.getBranch(splash_PrefBranchPrefix);
    var prefCount = {value:0}; 
    var prefArray = nsIPrefBranchObj.getChildList("" , prefCount); 

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

    for (var i = 0; i < prefArray.length; ++i) {

      var tmpString // clean up import-export strings

      switch (nsIPrefBranchObj.getPrefType(prefArray[i])) {
        case nsIPrefBranchObj.PREF_STRING:  // Text = 32
          str += "nsPreferences.setUnicharPref('" + splash_PrefBranchPrefix + prefArray[i] + "', '";
          tmpString = nsPreferences.copyUnicharPref(splash_PrefBranchPrefix + prefArray[i]); 
          tmpString = tmpString.replace(/\\/g, '\\\\'); 
          tmpString = tmpString.replace(/\'/g, '\\\''); 
          str += tmpString; 
          str += "')";
          break;
        case nsIPrefBranchObj.PREF_INT:  // Integer = 64
          str += "nsPreferences.setIntPref('" + splash_PrefBranchPrefix + prefArray[i] + "', ";
          str += nsPreferences.getIntPref(splash_PrefBranchPrefix + prefArray[i]);
          str += ")";
          break;
        case nsIPrefBranchObj.PREF_BOOL:  // Boolean =128
          str += "nsPreferences.setBoolPref('" + splash_PrefBranchPrefix + prefArray[i] + "', "; 
          str += nsPreferences.getBoolPref(splash_PrefBranchPrefix + prefArray[i]);
          str += ")";
          break;
      }

      str += "\r\n"
    }
    
    stream.init(fp.file, 0x20|0x02|0x08, 0666, 0);
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
    var myResetVersion = nsPreferences.copyUnicharPref("splashext.resetVersion");
    var thisResetVersion = "1.0";
    
    if (myResetVersion != thisResetVersion) {
      var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                          .getService(Components.interfaces.nsIPrefService);
      var nsIPrefBranchObj = prefService.getBranch(splash_PrefBranchPrefix);
      var prefCount = {value:0}; 
      var prefArray = nsIPrefBranchObj.getChildList("" , prefCount); 
  
      var branchService = nsPreferences.mPrefService;
  
      for (var i = 0; i < prefArray.length; ++i) {
        if (branchService.prefHasUserValue(splash_PrefBranchPrefix + prefArray[i])) {
           branchService.clearUserPref(splash_PrefBranchPrefix + prefArray[i]);
        }
      } 
	
      nsPreferences.setUnicharPref("splashext.resetVersion", thisResetVersion);
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