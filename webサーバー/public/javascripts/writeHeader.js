// 表示元のページ名を取得。
var dirArray = location.href.split("/"); 
var page_name = dirArray[dirArray.length -1];
if (!page_name) {
    page_name = "history";
}

// 人数表示のためのクッキーを取得
var num_cookie = getCookie("num");
var p_num = "";
var c_num = "";
if (num_cookie) {
    p_num = num_cookie.split(":")[0];
    c_num = num_cookie.split(":")[1];
}
var nodata;
if (p_num && c_num) {
    nodata = "";
} else {
    nodata = 'style="visibility:hidden;"';
}

// カレントページを非活性化するための作業
var room_html = '<span id="room" class="options"><a href="/room">Room</a></span>';
var chat_html = '<span id="chat" class="options"><a href="/chat">Chat</a><span class="pop" id="newmessage">new</span></span>';
var history_html = '<span id="history" class="options"><a href="/history">History</a></span>';
var map_html = '<span id="map" class="options"><a href="/map">Map</a></span>';
var setting_html = '<span id="Settings" class="options ultra_lightgray_font" onclick="getSettings();">Settings</span>';
var faq_html = '<span id="faq" class="options"><a href="/faq">FAQ</a></span>';
var premium_html = '';//'<span id="premium" class="options ultra_lightgray_font">Premium</span>';
switch (page_name) {
    case "room":
        room_html = '<span id="room" class="options">Room</span>';
        break;
    case "chat":
        chat_html = '<span id="chat" class="options">Chat<span class="pop" id="newmessage">new</span></span>';
        break;
    case "history":
        history_html = '<span id="history" class="options">History</span>';
        break;
    case "map":
        map_html = '<span id="map" class="options">Map</span>';
        break;
    case "faq":
        faq_html = '<span id="faq" class="options">FAQ</span>';
        break;
    default:
        break;
}

function writeHeader() {
    var html;
    if (page_name == "restrict") {
        html = ''+
        '<div id="title_bar">'+
            '<a href="/"><img id="logo" src="../images/logo.png" width="240" height="55" alt="Chample"></a>'+
            '<span id="counter" class="yellow_font" '+nodata+'>You talked <span class="emphasis">'+p_num+'</span> persons from <span class="emphasis">'+c_num+'</span> countries.</span>'+
            '<span id="topright_main" class="yellow_font">' +
                '<span id="login" style="cursor:pointer;">Logout</span> ・ ' +
                '<span id="features"><a href="/features" class="yellow_font">Features</a></span> ・ ' +
                '<span onclick="openChatOfficial()" style="cursor:pointer;">Contact Us</span> ・ ' +
                '<span onclick='+"'"+'window.open("/policy", "", "width=660,height=480");'+"'"+' style="cursor:pointer;">Our Policies</span>'+
            '</span>' +
        '</div>'+
        '<div id="option_bar" class="deepgray" style="overflow:auto;">'+
            '<span id="option_right">'+
                setting_html + '<span id="faq" class="options"><a href="/faq/restrict">FAQ</a></span>' + premium_html +
            '</span>'+
        '</div>';
    } else {
        html = ''+
        '<div id="title_bar">'+
            /*'<a href="/"><img id="logo" src="../images/logo.png" width="240" height="55" alt="Chample"></a>'+*/
            '<h1>Chample is videochat for Learning and Laughing.</h1>' +
            '<span id="counter" '+nodata+'>You talked <span class="emphasis">'+p_num+'</span> persons from <span class="emphasis">'+c_num+'</span> countries.</span>'+
            '<span id="topright_main">' +
                '<span id="login" style="cursor:pointer;">Logout</span> ・ ' +
                '<span id="features"><a href="/features">Features</a></span> ・ ' +
                '<span onclick="openChatOfficial()" style="cursor:pointer;">Contact Us</span> ・ ' +
                '<span onclick='+"'"+'window.open("/policy", "", "width=660,height=480");'+"'"+' style="cursor:pointer;">Our Policies</span>'+
            '</span>' +
        '</div>'+
        '<div id="option_bar" class="deepgray">'+
            '<span id="joinroom" class="join ultra_lightgray_font" onclick="joinroom();">Join Room<span class="pop" id="joinnow">Join</span></span>'+
            '<span id="automatch" class="join ultra_lightgray_font" onclick="automatch();">Auto Match<span class="pop" id="matching">Matching…</span></span>'+
            '<span id="busynow" class="join ultra_lightgray_font" onclick="busynow();">Busy Now<span class="pop" id="busy">Busy</span></span>'+
            '<span id="option_right">'+
                room_html + chat_html + history_html +
                map_html + setting_html + faq_html + premium_html +
            '</span>'+
        '</div>';
    }
    document.write(html);
}