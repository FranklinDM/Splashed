//******************************************************************************
// PROJECT:      Splash! from Web Color Names
// FILE:         webcolornames.js
// DESCRIPTION:  Javascript file for main window taken from extension "Web Color Names"
// AUTHOR:  aldreneo aka slyfox and mrtech
// ORIGINAL AUTHOR: Andrea Binello
// LICENSE:      GNU GPL (General Public License)
//------------------------------------------------------------------------------
//Original  Copyright (c) 2004 Andrea Binello
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


//-- Array with the 140 standard web color names --
var splash_color_names = new Array
(
	"transparent",
    "aliceblue"           , "antiquewhite"        , "aqua"                ,
    "aquamarine"          , "azure"               , "beige"               ,
    "bisque"              , "black"               , "blanchedalmond"      ,
    "blue"                , "blueviolet"          , "brown"               ,
    "burlywood"           , "cadetblue"           , "chartreuse"          ,
    "chocolate"           , "coral"               , "cornflowerblue"      ,
    "cornsilk"            , "crimson"             , "cyan"                ,
    "darkblue"            , "darkcyan"            , "darkgoldenrod"       ,
    "darkgray"            , "darkgreen"           , "darkkhaki"           ,
    "darkmagenta"         , "darkolivegreen"      , "darkorange"          ,
    "darkorchid"          , "darkred"             , "darksalmon"          ,
    "darkseagreen"        , "darkslateblue"       , "darkslategray"       ,
    "darkturquoise"       , "darkviolet"          , "deeppink"            ,
    "deepskyblue"         , "dimgray"             , "dodgerblue"          ,
    "firebrick"           , "floralwhite"         , "forestgreen"         ,
    "fuchsia"             , "gainsboro"           , "ghostwhite"          ,
    "gold"                , "goldenrod"           , "gray"                ,
    "green"               , "greenyellow"         , "honeydew"            ,
    "hotpink"             , "indianred"           , "indigo"              ,
    "ivory"               , "khaki"               , "lavender"            ,
    "lavenderblush"       , "lawngreen"           , "lemonchiffon"        ,
    "lightblue"           , "lightcoral"          , "lightcyan"           ,
    "lightgoldenrodyellow", "lightgreen"          , "lightgrey"           ,
    "lightpink"           , "lightsalmon"         , "lightseagreen"       ,
    "lightskyblue"        , "lightslategray"      , "lightsteelblue"      ,
    "lightyellow"         , "lime"                , "limegreen"           ,
    "linen"               , "magenta"             , "maroon"              ,
    "mediumaquamarine"    , "mediumblue"          , "mediumorchid"        ,
    "mediumpurple"        , "mediumseagreen"      , "mediumslateblue"     ,
    "mediumspringgreen"   , "mediumturquoise"     , "mediumvioletred"     ,
    "midnightblue"        , "mintcream"           , "mistyrose"           ,
    "moccasin"            , "navajowhite"         , "navy"                ,
    "oldlace"             , "olive"               , "olivedrab"           ,
    "orange"              , "orangered"           , "orchid"              ,
    "palegoldenrod"       , "palegreen"           , "paleturquoise"       ,
    "palevioletred"       , "papayawhip"          , "peachpuff"           ,
    "peru"                , "pink"                , "plum"                ,
    "powderblue"          , "purple"              , "red"                 ,
    "rosybrown"           , "royalblue"           , "saddlebrown"         ,
    "salmon"              , "sandybrown"          , "seagreen"            ,
    "seashell"            , "sienna"              , "silver"              ,
    "skyblue"             , "slateblue"           , "slategray"           ,
    "snow"                , "springgreen"         , "steelblue"           ,
    "tan"                 , "teal"                , "thistle"             ,
    "tomato"              , "turquoise"           , "violet"              ,
    "wheat"               , "white"               , "whitesmoke"          ,
    "yellow"              , "yellowgreen"
);


//-- Array with the 140 standard web color values --
var splash_color_values = new Array
(
	"transparent",
    "F0F8FF", "FAEBD7", "00FFFF", "7FFFD4", "F0FFFF", "F5F5DC", "FFE4C4",
    "000000", "FFEBCD", "0000FF", "8A2BE2", "A52A2A", "DEB887", "5F9EA0",
    "7FFF00", "D2691E", "FF7F50", "6495ED", "FFF8DC", "DC143C", "00FFFF",
    "00008B", "008B8B", "B8860B", "A9A9A9", "006400", "BDB76B", "8B008B",
    "556B2F", "FF8C00", "9932CC", "8B0000", "E9967A", "8FBC8F", "483D8B",
    "2F4F4F", "00CED1", "9400D3", "FF1493", "00BFFF", "696969", "1E90FF",
    "B22222", "FFFAF0", "228B22", "FF00FF", "DCDCDC", "F8F8FF", "FFD700",
    "DAA520", "808080", "008000", "ADFF2F", "F0FFF0", "FF69B4", "CD5C5C",
    "4B0082", "FFFFF0", "F0E68C", "E6E6FA", "FFF0F5", "7CFC00", "FFFACD",
    "ADD8E6", "F08080", "E0FFFF", "FAFAD2", "90EE90", "D3D3D3", "FFB6C1",
    "FFA07A", "20B2AA", "87CEFA", "778899", "B0C4DE", "FFFFE0", "00FF00",
    "32CD32", "FAF0E6", "FF00FF", "800000", "66CDAA", "0000CD", "BA55D3",
    "9370D8", "3CB371", "7B68EE", "00FA9A", "48D1CC", "C71585", "191970",
    "F5FFFA", "FFE4E1", "FFE4B5", "FFDEAD", "000080", "FDF5E6", "808000",
    "688E23", "FFA500", "FF4500", "DA70D6", "EEE8AA", "98FB98", "AFEEEE",
    "D87093", "FFEFD5", "FFDAB9", "CD853F", "FFC0CB", "DDA0DD", "B0E0E6",
    "800080", "FF0000", "BC8F8F", "4169E1", "8B4513", "FA8072", "F4A460",
    "2E8B57", "FFF5EE", "A0522D", "C0C0C0", "87CEEB", "6A5ACD", "708090",
    "FFFAFA", "00FF7F", "4682B4", "D2B48C", "008080", "D8BFD8", "FF6347",
    "40E0D0", "EE82EE", "F5DEB3", "FFFFFF", "F5F5F5", "FFFF00", "9ACD32"
);


var splash_color_hsb_idxnames = new Array
(
	0  ,
    7  , 40 , 50 , 24 , 122, 68 , 46 , 137, 136, 126,
    114, 64 , 55 , 11 , 42 , 80 , 31 , 113, 92 , 117,
    132, 32 , 16 , 100, 70 , 121, 120, 15 , 116, 118,
    107, 108, 78 , 6  , 29 , 12 , 1  , 129, 94 , 8  ,
    106, 93 , 99 , 135, 96 , 43 , 23 , 49 , 18 , 48 ,
    62 , 58 , 102, 26 , 57 , 5  , 75 , 66 , 97 , 138,
    139, 98 , 28 , 52 , 14 , 61 , 53 , 33 , 103, 67 ,
    44 , 77 , 25 , 51 , 76 , 119, 85 , 127, 91 , 87 ,
    81 , 3  , 133, 71 , 88 , 4  , 65 , 104, 35 , 130,
    22 , 2  , 20 , 36 , 13 , 111, 63 , 39 , 123, 72 ,
    128, 0  , 41 , 125, 73 , 74 , 17 , 115, 47 , 59 ,
    90 , 95 , 21 , 82 , 9  , 124, 34 , 86 , 84 , 10 ,
    56 , 30 , 37 , 83 , 131, 110, 134, 112, 27 , 45 ,
    79 , 101, 89 , 38 , 54 , 105, 60 , 19 , 109, 69
);


//-- Get red/green/blue values from hex color --
function splash_get_rgb (hexcolor)
{
    var rgb = new Array ();

    rgb[0] = parseInt (hexcolor.substring (0, 2), 16);  // Red
    rgb[1] = parseInt (hexcolor.substring (2, 4), 16);  // Green
    rgb[2] = parseInt (hexcolor.substring (4, 6), 16);  // Blue

    return rgb;
}

//-- Load trees --
function splash_load_trees ()
{
    var treechildren;
    var treeitem;
    var treerow;
    var treecell;
    var i, k;

    treechildren = document.getElementById ('splash-treechildren1');

    for (i=0; i<140; i++)
    {
        treeitem = document.createElement ('treeitem');
        treerow = document.createElement ('treerow');

        treecell = document.createElement ('treecell');
        treecell.setAttribute ("label", splash_color_names[i]);
        treerow.appendChild (treecell);

        treecell = document.createElement ('treecell');
		if (!(splash_color_values[i]=="transparent")) {
        treecell.setAttribute ("label", "#" + splash_color_values[i]);
		} else {treecell.setAttribute ("label", splash_color_values[i]);}
        treecell.setAttribute ("properties", "clrvalue");
        treerow.appendChild (treecell);

        treecell = document.createElement ('treecell');
        treecell.setAttribute ("properties", splash_color_names[i] + " sample");
        treerow.appendChild (treecell);

        treeitem.appendChild (treerow);
        treechildren.appendChild (treeitem);
    }

    treechildren = document.getElementById ('splash-treechildren2');

    for (i=0; i<140; i++)
    {
        k = splash_color_hsb_idxnames[i];

        treeitem = document.createElement ('treeitem');
        treerow = document.createElement ('treerow');

        treecell = document.createElement ('treecell');
        treecell.setAttribute ("label", splash_color_names[k]);
        treerow.appendChild (treecell);

        treecell = document.createElement ('treecell');

		if (!(splash_color_values[k]=="transparent"))
			{
			treecell.setAttribute ("label", "#" + splash_color_values[k]);
			}
			else {treecell.setAttribute ("label", splash_color_values[k]); }

        treecell.setAttribute ("properties", "clrvalue");
        treerow.appendChild (treecell);

        treecell = document.createElement ('treecell');
        treecell.setAttribute ("properties", splash_color_names[k] + " sample");
        treerow.appendChild (treecell);

        treeitem.appendChild (treerow);
        treechildren.appendChild (treeitem);
    }
}


//-- Color selection function --
function splash_select_color (tree_idx)
{
    var tree;
    var idx;
    var rgb;
    var textbox;
    var label;

    if (tree_idx == 1)
    {
    	//-- Selected tree 1 (colors sorted by name) --
        tree = document.getElementById ("splash-tree1");
        idx = tree.currentIndex;
    }
    else if (tree_idx == 2)
    {
    	//-- Selected tree 2 (colors sorted by value) --
        tree = document.getElementById ("splash-tree2");
        idx = splash_color_hsb_idxnames[tree.currentIndex];
    }

    rgb = splash_get_rgb (splash_color_values[idx]);

    textbox = document.getElementById ("splash-textbox-info-name");
    textbox.value = splash_color_names[idx];

    textbox = document.getElementById ("splash-textbox-info-value");
		if (!(splash_color_values[idx]=="transparent"))
			{
			textbox.value = "#" + splash_color_values[idx];
			} else {textbox.value = splash_color_values[idx]; }


	if(!(splash_color_values[idx]=="transparent")) {
    textbox = document.getElementById ("splash-textbox-info-redvalue");
    textbox.value = rgb[0];

    textbox = document.getElementById ("splash-textbox-info-greenvalue");
    textbox.value = rgb[1];

    textbox = document.getElementById ("splash-textbox-info-bluevalue");
    textbox.value = rgb[2];
	} else {

    textbox = document.getElementById ("splash-textbox-info-redvalue");
    textbox.value = "N/A";

    textbox = document.getElementById ("splash-textbox-info-greenvalue");
    textbox.value = "N/A";

    textbox = document.getElementById ("splash-textbox-info-bluevalue");
    textbox.value = "N/A";


	}

    label = document.getElementById ("splash-label-info-colorsample");

		if (!(splash_color_values[idx]=="transparent"))
			{
			label.setAttribute ("style", "background-color: #" + splash_color_values[idx] + ";");
			} else {label.setAttribute ("style", "background-color: " + splash_color_values[idx] + ";");}

}

//-- Initialize application --
function splash_init_application ()
{
    splash_load_trees ();
}

function set_setting ()
{
  var element = document.getElementById ('splash-textbox-info-value');
	var settings = window.arguments[0];
	var alertpipe = document.getElementById ('dtdalertpipe').value
	if (settings=="splash.txtcolor") {
  	if (element.value=="transparent") {
      alert(alertpipe)
  	} else {
  		set_settings_final ()
  	}

  	//Set the setting  (option)  to the variable element.value
  } else {
		set_settings_final ()
	}
}

function set_settings_final () {
  var element = document.getElementById ('splash-textbox-info-value');

  if (!element || !element.value || element.value == "") {
    window.close();
    return;
  };

  var settings = window.arguments[0];

  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  prefs.setCharPref ( settings , element.value );
	window.close();
}