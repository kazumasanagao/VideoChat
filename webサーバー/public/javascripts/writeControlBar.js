// 表示元のページ名を取得。
/*
var dirArray = location.href.split("/"); 
var page_name = dirArray[dirArray.length -1];
if (!page_name) {
    page_name = "history";
}
*/

var title = "";
var checkbox0 = "";
var checkbox1 = "";
var checkbox2 = "";

switch (page_name) {
    case "room":
        title = "Room";
        checkbox0 = '<div id="checkbox0"><input id="checkbox_box0" name="starred" type="checkbox" value="true" class="selections" /><label class="selections labels" id="checkbox_label0" for="checkbox_box0">Starred</label></div>';
        checkbox1 = '<div id="checkbox1"><input id="checkbox_box1" name="always" type="checkbox" value="true" class="selections" /><label class="selections labels" id="checkbox_label1" for="checkbox_box1">Always apply this</label></div>';
        break;
    case "chat":
        title = "Chat";
        checkbox0 = '<div id="checkbox0"><input id="checkbox_box0" type="checkbox" name="loginnow" value="true" class="selections" /><label class="selections labels" id="checkbox_label0" for="checkbox_box0">Login Now</label></div>';
        checkbox1 = '<div id="checkbox1"><input id="checkbox_box1" name="starred" type="checkbox" value="true" class="selections" /><label class="selections labels" id="checkbox_label1" for="checkbox_box1">Starred</label></div>';
        break;
    case "history":
        title = "History";
        checkbox0 = '<div id="checkbox0"><input id="checkbox_box0" type="checkbox" name="loginnow" value="true" class="selections" /><label class="selections labels" id="checkbox_label0" for="checkbox_box0">Login Now</label></div>';
        checkbox1 = '<div id="checkbox1"><input id="checkbox_box1" name="starred" type="checkbox" value="true" class="selections" /><label class="selections labels" id="checkbox_label1" for="checkbox_box1">Starred</label></div>';
        checkbox2 = '<div id="checkbox2"><input id="checkbox_box2" name="blocking" type="checkbox" value="true" class="selections" /><label class="selections labels" id="checkbox_label2" for="checkbox_box2">Blocking</label></div>';
        break;
    default:
        title = "Room";
        checkbox0 = '<div id="checkbox0"><input id="checkbox_box0" name="starred" type="checkbox" value="true" class="selections" /><label class="selections labels" id="checkbox_label0" for="checkbox_box0">Starred</label></div>';
        checkbox1 = '<div id="checkbox1"><input id="checkbox_box1" name="always" type="checkbox" value="true" class="selections" /><label class="selections labels" id="checkbox_label1" for="checkbox_box1">Always apply this</label></div>';
        break;
}

function writeControlBar() {
    var html = ''+
        '<div id="control_bar" class="yellow">' +
        '<span id="control_bar_title" class="deepgray_font">'+ title +'</span>' +
        '<span id="showoptions" class="deepgray_font" onclick="showoptions()">Show Options</span>' +
        '<span id="hideoptions">' +
        '<span id="selection_bar">' +
            '<select id="language" class="selections pulldown yellow deepgray_font">' +
                '<option value="">Language</option>' +
                languagesHTML +
            '</select>' +
            '<select id="gender" class="selections pulldown yellow deepgray_font">' +
                '<option value="">Gender</option>' +
                gendersHTML +
            '</select>' +
            '<select id="region" class="selections pulldown yellow deepgray_font" onChange="changeRegion();">' +
                '<option value="">Region</option>' +
                regionsHTML +
            '</select>' +
            '<select id="country" class="selections pulldown yellow deepgray_font">' +
                '<option value="">Country</option>' +
                countriesHTML +
            '</select>' +
            '<input id="freeword" class="selections yellow deepgray_font" placeholder="Free Word"/>' +
        '</span>' +
        '<div id="checkboxes" class="deepgray_font">' +
            checkbox0 +
            checkbox1 +
            checkbox2 +
        '</div>' +
        '<button id="reload" class="selections yellow deepgray_font">Reload</button>' +
        '</span>' +
    '</div>'
    document.write(html);
    if (title == "Room") {
        setInitialVal();
    }
    if (page_name == "history" && !isMobile) {
        var box = document.getElementById("checkboxes");
        box.style.position = 'relative';
        box.style.top = '-10px';
    }
}

function setInitialVal() {
    var cookie = getCookie("pref");
    var isPref = false;
    if (cookie) {
        var pref_array = cookie.split(",");
        var pref = {};
        for (i = 0; i < pref_array.length; i++) {
            ele = pref_array[i].split(":");
            pref[ele[0]] = ele[1];
        }
        
        document.getElementById("checkbox_box1").setAttribute("checked","checked");

        if (pref.language) {
            setoption('language', pref.language);
        }
        if (pref.gender) {
            setoption('gender', pref.gender);
        }
        if (pref.region) {
            setoption('region', pref.region);
            changeRegion(); // regionがある場合は、countryはそのregionの中から選ぶ
        }
        if (pref.country) {
            setoption('country', pref.country);
        }
        if (pref.freeword) {
            document.getElementById("freeword").setAttribute("value", pref.freeword);
        }
        if (pref.star == "true") {
            document.getElementById("checkbox_box0").setAttribute("checked","checked");
        }
    }
}

function setoption(name, val) {
    document.querySelector('#' + name + ' option[value="'+ val + '"]').setAttribute("selected","selected");
}

function showoptions() {
    if ($("#showoptions").html() == "Show Options") {
        $("#hideoptions").fadeIn();
        $("#showoptions").html("Hide Options");
    } else {
        $("#hideoptions").fadeOut();
        $("#showoptions").html("Show Options");
    }
}