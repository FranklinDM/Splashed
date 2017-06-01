function setup(){
//Test stuff
nsPreferences2.setCharPref("profile.list.splash", "default;cool");

nsPreferences2.setCharPref("profile.splash.default.name", "Default Splash Screen");
nsPreferences2.setCharPref("profile.splash.default.author", "Mozilla");
nsPreferences2.setCharPref("profile.splash.default.description", "The default splash screen for your application");
nsPreferences2.setCharPref("profile.splash.default.id", "a57827d893a9adbad093c336fc0e7ea7");
var id=nsPreferences.copyUnicharPref("profile.splash.default.id");
var file = Components.classes["@mozilla.org/file/directory_service;1"]
                     .getService(Components.interfaces.nsIProperties)
                     .get("ProfD", Components.interfaces.nsIFile);
file.append("splash");
file.append(id);
if( !file.exists() || !file.isDirectory() ) {   // if it doesn't exist, create
   file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0664);
}

nsPreferences2.setCharPref("profile.splash.cool.name", "Cool Awsome Splash Screen");
nsPreferences2.setCharPref("profile.splash.cool.author", "Slyfox");
nsPreferences2.setCharPref("profile.splash.cool.description", "Its like Shiny and stuff!!!");
nsPreferences2.setCharPref("profile.splash.cool.id", "4a3bdec5eaa5b739d6c2c52bdf6cc009");

var id2=nsPreferences.copyUnicharPref("profile.splash.cool.id");
file=file.parent;
file.append(id2);
if( !file.exists() || !file.isDirectory() ) {   // if it doesn't exist, create
   file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0664);
}

window.location.reload();
alert("System Setup, All you need to do is go into the splash folder in your profile, and for each ID folder add a main.js(Exported from prefrences) to get the prefs for that splash screen");
}


function new2(splashtestname) {
var splashtestname = nsPreferences.copyUnicharPref("profile.list.splash");
var nename1 = prompt("Splash's name ID", "Enter Short Name Here")
if (!nename1) {exit;}
var nename = prompt("Splash's name", "Enter Name Here")
if (!nename) {exit;}
var neauth = prompt("Splash's author", "Enter Author Name Here")
if (!neauth) {exit;}
var nedesc = prompt("Splash's description", "Enter Description Here")
if (!nedesc) {exit;}
var neid = prompt("Splash's ID", "Enter Some Random Crap Here")
if (!neid) {exit;}
splashtestname=splashtestname+";"+nename1;
nsPreferences2.setCharPref("profile.list.splash", splashtestname);
nsPreferences2.setCharPref("profile.splash."+nename1+".name", nename);
nsPreferences2.setCharPref("profile.splash."+nename1+".author", neauth);
nsPreferences2.setCharPref("profile.splash."+nename1+".description", nedesc);
nsPreferences2.setCharPref("profile.splash."+nename1+".id", neid);
window.location.reload();
}