var nsPreferences2 = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

//****ZIP STUFF****************************
//@mozilla.org/libjar/zip-reader;1			*
//nsIZipReader						*
//void open ()						*
//getInputStream ( char* zipEntry )			*
//void extract ( char* zipEntry , nsIFile outFile )	*
//void close ( )						*
//******************************************

//End Test Stuff
						  
						  
//Profile Selector

function remf() {
        tree = document.getElementById ("splash.profile.tree");
        idx = tree.currentIndex;
		var splashtestname = nsPreferences.copyUnicharPref("profile.list.splash");
	    var splashtestparsed = splashtestname.split(";");
		rem(splashtestparsed[idx]);
}

function rem(toremove){
	var splash_cur_PrefBranchPrefix = "profile.splash." + toremove;
//alert(splash_cur_PrefBranchPrefix);
	var prefService = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService);
	var nsIPrefBranchObj = prefService.getBranch(splash_cur_PrefBranchPrefix);
	var prefCount = {value:0}; 
    var prefArray = nsIPrefBranchObj.getChildList("" , prefCount);   
	var branchService = nsPreferences.mPrefService;
		for (var i = 0; i < prefArray.length; ++i) {
			if (branchService.prefHasUserValue(splash_cur_PrefBranchPrefix + prefArray[i])) {
				branchService.clearUserPref(splash_cur_PrefBranchPrefix + prefArray[i]);
			}
	}
	var splashtestname2 = nsPreferences.copyUnicharPref("profile.list.splash");
	var splashtestparsed2 = splashtestname2.split(";");
    for (i=0; i<splashtestparsed2.length; i++)
    {
	//alert(splashtestparsed2[i]);
		if (!(splashtestparsed2[i]==toremove)) {
		if (!(i==0)){
			newpref=newpref+";"+splashtestparsed2[i];
			} else {newpref=splashtestparsed2[i];}
		}
	}
//alert(newpref);
	nsPreferences2.setCharPref("profile.list.splash", newpref);
	window.location.reload();
}


function use_splash(){
        tree = document.getElementById ("splash.profile.tree");
        idx = tree.currentIndex;
		var splashtestname = nsPreferences.copyUnicharPref("profile.list.splash");
	    var splashtestparsed = splashtestname.split(";");
		var selected=splashtestparsed[idx];
		var id=nsPreferences.copyUnicharPref("profile.splash."+selected+".id");
		var file = Components.classes["@mozilla.org/file/directory_service;1"]
                     .getService(Components.interfaces.nsIProperties)
                     .get("ProfD", Components.interfaces.nsIFile);
		file.append("splash");
		file.append(id);
		file.append("main.js");
		      var mIOService = Components.classes["@mozilla.org/network/io-service;1"]
                         .getService(Components.interfaces.nsIIOService)
		 var mFileProtocolHandler = mIOService.getProtocolHandler("file")
                                   .QueryInterface(Components.interfaces.nsIFileProtocolHandler)
								   
      var mURL = mFileProtocolHandler.newFileURI(file)
                   .QueryInterface(Components.interfaces.nsIURL);

      var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
       getService(Components.interfaces.mozIJSSubScriptLoader);
      loader.loadSubScript(mURL.spec);
}


function load() {

//Stuff for the splash directory creation
var file = Components.classes["@mozilla.org/file/directory_service;1"]
                     .getService(Components.interfaces.nsIProperties)
                     .get("ProfD", Components.interfaces.nsIFile);
file.append("splash");
if( !file.exists() || !file.isDirectory() ) {   // if it doesn't exist, create
   file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0664);
}

	var splashtestname = nsPreferences.copyUnicharPref("profile.list.splash");

	var splashtestparsed = splashtestname.split(";");

    treechildren = document.getElementById ('treechildren-splash');

    for (i=0; i<splashtestparsed.length; i++)
    {
        treeitem = document.createElement ('treeitem');
        treerow = document.createElement ('treerow');

		//treecell = document.createElement ('treecell');
		//var treecelllable=splashtestparsed[i];
        //treecell.setAttribute ("label",treecelllable);
        //treerow.appendChild (treecell);
		
        treecell = document.createElement ('treecell');
		var treecelllable=nsPreferences.copyUnicharPref("profile.splash."+splashtestparsed[i]+".name");
        treecell.setAttribute ("label",treecelllable);
        treerow.appendChild (treecell);
		
		treecell = document.createElement ('treecell');
		var treecelllable2=nsPreferences.copyUnicharPref("profile.splash."+splashtestparsed[i]+".author");
        treecell.setAttribute ("label",treecelllable2);
        treerow.appendChild (treecell);
		
		treecell = document.createElement ('treecell');
		var treecelllable3=nsPreferences.copyUnicharPref("profile.splash."+splashtestparsed[i]+".description");
        treecell.setAttribute ("label",treecelllable3);
        treerow.appendChild (treecell);
		

        treeitem.appendChild (treerow);
        treechildren.appendChild (treeitem);
    }
}