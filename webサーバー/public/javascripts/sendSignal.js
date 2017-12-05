var idAndHash = getCookie('id');
/*
var dirArray = location.href.split("/"); 
var page_name = dirArray[dirArray.length -1];
if (!page_name) {
    page_name = "history";
}
*/
s.on("joinstat", function(data) {
    if (data.join) {
        $("#joinnow").css("display","block");
    } else {
        $("#joinnow").css("display","none");
    }
});
s.on("roomin", function(data) {
    if (page_name == "room") {
        if (data.person) {
            realtimeLoad(data.person, true); // insertPersons.js
        }
    }
});
s.on("roomout", function(data) {
    if (page_name == "room") {
        if (data.person) {
            realtimeLoad(data.person, false); // insertPersons.js
        }
    }
});
s.on("receiveCall", function(data) {
    openCalled(data);
});
s.on("openwindow", function(id) {
    callend(true); // trueをいれるとbusy状態を継続できる
    openTalk(id); // openTalk.js
});
s.on("setCookie", function(data) {
    var cookie = 'num=' + data.p_num + ":" + data.c_num + '; max-age=604800;' + cookieSecure;
    document.cookie = cookie;
});
s.on("getbusystat", function(data) {
    setCallButton(data.stat, data.id);
});
s.on("callbut", function(data) {
    callbut(data);
});
s.on("busynowstat", function(isbusynow) {
    if (isbusynow) {
        $("#busy").css("display","block");
    } else {
        $("#busy").css("display","none");
    }
});
s.on("autofound", function(data) {
    callend(true);
    candidate_name = data.nickname;
    var raw_country = data.country;
    var country = countryMap[raw_country];
    candidate_country = country;
    openTalk(data.id);
});
s.on("foundnow", function(data) {
    var senddata = {id: data.id, roomname: data.roomname}
    s.emit("sethisdata", senddata);
    candidate_name = data.nickname;
    var raw_country = data.country;
    var country = countryMap[raw_country];
    candidate_country = country;
});
s.on("autostat", function(data) {
    if (data == "on") {
        $("#matching").css("display","block");
    } else {
        $("#matching").css("display","none");
    }
})

TimerCount();
function TimerCount() {
    s.emit("alive", idAndHash);
    window.setTimeout("TimerCount()",60000);
}
function joinroom() {
    s.emit("joinroom");
}
function automatch() {
    var prefcookie = getCookie('pref');
    s.emit("automatch", prefcookie);
}
function callSignal(id) {
    s.emit("callrequest", id);
}
function answerSignal(data) {
    s.emit("callanswer", data);
}
function sendBusyCheck(id) {
    s.emit("busycheck", id); // getbusystatで結果を受け取る
}
function busynow() {
    s.emit("busynow");
}
function removeBusy() {
    s.emit("removebusy");
}
