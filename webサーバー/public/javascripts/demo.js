$('#login').click(onLogoutButtonClick);

function demo() {
// mobileかどうかの判定
var isMobile = false;
if ($(window).width() < 450) {
    isMobile = true;
}
// image_urlを内部へ
image_url = "../images/faces/";
// toastの挿入
if (isMobile) {
    $('body').append('<div id="toast" style="z-index:3;position:fixed;width:320px;padding:10px 0;left:50%;margin-left:-160px;line-height:130%;"></div>');
} else {
    $('body').append('<div id="toast" style="z-index:3;position:absolute;width:500px;padding:10px 0;left:225px;line-height:130%;"></div>');
}
// demoのときはLogoutボタンをLoginに置き換える
$('#login').html("Login");
$('#login').off();
$('#login').click(onLoginButtonClick); 
// cssの切り替え
var d = document;
var link = d.createElement('link');
if (isMobile) {
    link.href = '../stylesheets/demo_mob.css';
} else {
    link.href = '../stylesheets/demo.css';
}
link.rel = 'stylesheet';
link.type = 'text/css';
var h = d.getElementsByTagName('head')[0];
h.appendChild(link);
// map.jsの変更箇所
if (page_name == "map") {
    mapdict = {jp:['1'],ca:['2'],gb:['3'],au:['4'],ng:['5'],cn:['6'],ru:['7'],de:['8'],in:['9'],se:['10'],ar:['11']};
    makemap();
    window.clickphoto = function(id) {
        var num = Number(id) - 1;
        var info = demoinfo[num];
        openPersonInfo(info);
    }
    $('#dialog').html('<div id="youtalked" class="green">You talked <span class="emphasis2 yellow_font">1</span> person<br/>&nbsp;&nbsp;in <span class="emphasis2 yellow_font">China</span></div><div id="images"></div>');
    $('#images').append('<span onclick="clickphoto('+"'"+1+"'"+')"><img src="../images/faces/1.jpeg" width="40" height="40" alt="face0"></span>');
    if (!isMobile) {
        $('#images').append('<div id="clickphoto_mes_flame"><span id="clickphoto_mes">Click Photo</span><span class="triangle_left_2"></span><div>');
        check_clickphoto_mes();
        $('#option_bar').append('<div id="options_description_flame"><div id="options_description">You can see people you\'ve already talked with.</div><span class="triangle_top2"></span></div>');
    } else {
        $('#dialog').after('<div id="map_description_flame"><span id="map_description">You can see people you\'ve already talked with.</span></div>');
    }
}
// settings.jsの変更箇所
var demoplayer = {
    id: "",
    nickname: "Demo",
    shortBio: "Hi this is Demo. My hobby is traveling and reading.",
    longBio: "I wanna make many friends around the world ! I'm very interested in various cultures.",
    country: "at",
    languages: ["en"],
    gender: "fe",
    keeplogin: true,
    fb_or_mail: "both"
}
window.getSettings = function() {
    initsettings(demoplayer);
}
window.changeaddress = function() {}
window.deleteaccount = function() {}
window.save = function() {
    callend();
}
// insertPersons.jsの変更箇所
if (page_name == "history" || page_name == "chat") {
    info = $.extend(true, [], demoinfo);
    stars = ["1","3","6","11"];
    blocks = [];
    userlangs = ["en"];
    initdata();
    setPersons(1);
} else if (page_name == "room") {
    info = $.extend(true, [], demoinfo_room);
    stars = [];
    blocks = [];
    userlangs = ["en"];
    initdata();
    setPersons(1);
} else {
    info = [];
    stars = [];
    blocks = [];
}
window.getInfoFromServer = function(q) {
    if (page_name == "history" || page_name == "chat") {
        info = $.extend(true, [], demoinfo);
    } else if (page_name == "room") {
        info = $.extend(true, [], demoinfo_room);
    }
    if (q.language) {
        if (q.language != "al") {
            for (var i = 0; i < info.length; i++) {
                if (info[i].languages.indexOf(q.language) == -1) {
                    info.splice(i,1);
                    i--;
                }
            }
        }
    }
    if (q.gender) {
        for (var i = 0; i < info.length; i++) {
            if (info[i].gender != q.gender) {
                info.splice(i,1);
                i--;
            }
        }
    }
    if (q.region) {
        for (var i = 0; i < info.length; i++) {
            if (regionMap[q.region]) {
                if (regionMap[q.region].indexOf(info[i].country) == -1) {
                    info.splice(i,1);
                    i--;
                }
            }
        }
    }
    if (q.country) {
        for (var i = 0; i < info.length; i++) {
            if (q.country != info[i].country) {
                info.splice(i,1);
                i--;
            }
        }
    }
    if (q.freeword) {
        for (var i = 0; i < info.length; i++) {
            if (info[i].nickname.toLowerCase().indexOf(q.freeword.toLowerCase()) == -1 && info[i].shortBio.toLowerCase().indexOf(q.freeword.toLowerCase()) == -1 && info[i].longBio.toLowerCase().indexOf(q.freeword.toLowerCase()) == -1) {
                info.splice(i,1);
                i--;
            }
        }
    }
    if (q.starred) {
        for (var i = 0; i < info.length; i++) {
            if (stars.indexOf(info[i].id) == -1) {
                info.splice(i,1);
                i--;
            }
        }
    }
    if (q.blocking) {
        for (var i = 0; i < info.length; i++) {
            if (blocks.indexOf(info[i].id) == -1) {
                info.splice(i,1);
                i--;
            }
        }
    }
    if (q.loginnow) {
        for (var i = 0; i < info.length; i++) {
            var login_now = ["2","3","8","10"];
            if (login_now.indexOf(info[i].id) == -1) {
                info.splice(i,1);
                i--;
            }
        }
    }
    initdata();
    setPersons(1);
}
window.star = function(id, iCurrent) {
    starflag = true;
    if (iCurrent != null) { // history画面の中のとき
        if (iCurrent >= 0) {
            if ($(".star_history").eq(iCurrent).html() == '<img src="../images/starred.png" width="20" height="20">') {
                $(".star_history").eq(iCurrent).html('<img src="../images/nostar.png" width="20" height="20">');
                if (stars.indexOf(id) != -1) {
                    stars.splice(stars.indexOf(id),1);
                }
            } else {
                $(".star_history").eq(iCurrent).html('<img src="../images/starred.png" width="20" height="20">');
                stars.push(id);
            }
        }
    } else { // talk画面の中のときはiCurrentをnullにする
        if ($(".star_talk").html() == '<img src="../images/starred.png" width="20" height="20">') {
            $(".star_talk").html('<img src="../images/nostar.png" width="20" height="20">');
            if (stars.indexOf(id) != -1) {
                stars.splice(stars.indexOf(id),1);
            }
        } else {
            $(".star_talk").html('<img src="../images/starred.png" width="20" height="20">');
            stars.push(id);
        }
    }
    setTimeout(function() {
        starflag = false;
    }, 1000)
}
window.block = function(id, iCurrent) {
    starflag = true;
    if (iCurrent != null) { // history画面の中のとき
        if (iCurrent >= 0) {
            if ($(".blockbutton").eq(iCurrent).html() == "Block") {
                $(".blockbutton").eq(iCurrent).html("Unblock");
                toast("When you block someone,<br />He/She never call you.");
                blocks.push(id);
            } else {
                $(".blockbutton").eq(iCurrent).html("Block");
                if (blocks.indexOf(id) != -1) {
                    blocks.splice(blocks.indexOf(id),1);
                }
            }
        }
    } else { // talk画面の中のときはiCurrentをnullにする
        if ($(".blockbutton_talk").html() == "Block") {
            $(".blockbutton_talk").html("Unblock");
            toast("When you block someone,<br />He/She never call you.");
            blocks.push(id);
        } else {
            $(".blockbutton_talk").html("Block");
            if (blocks.indexOf(id) != -1) {
                blocks.splice(blocks.indexOf(id),1);
            }
        }
    }
    setTimeout(function() {
        starflag = false;
    }, 1000)
}
window.report = function(id, iCurrent) {
    if (!talkingFlag) {
        starflag = true;
        var nickname;
        var hisid;
        if (id) { // talkから
            hisid = id;
            nickname = $("#nickname").html();
        } else { // historyから
            hisid = info[iCurrent].id;
            nickname = info[iCurrent].nickname;
        }
        var reportHTML = '' +
        '<div id="report_container">' + 
            '<div id="reportTitle">Report</div>' +
            '<div id="personName">'+nickname+'</div>' +
            '<div id="radios">' +
                '<input type="radio" name="report" id="gh" value="gh" checked="checked"><label for="gh" class="reportLabel">Gender Harassment</label><br/>' +
                '<input type="radio" name="report" id="ha" value="ha" checked="checked"><label for="ha" class="reportLabel">Harassment</label><br/>' +
                '<input type="radio" name="report" id="ad" value="ad" checked="checked"><label for="ad" class="reportLabel">Advertising</label><br/>' +
                '<input type="radio" name="report" id="ot" value="ot" checked="checked"><label for="ot" class="reportLabel" checked="checked">Other</label>' +
            '</div>' +
            '<span id="sendReport" onclick="sendReport('+"'"+hisid+"'"+')">Send</span>' +
            '<div id="toast" style="color:black;background:white;left:40px;top:120px;"></div>' +
        '</div>';
        callend();
        $(document.body).append(reportHTML);
        $("#gray_panel").fadeIn("fast");
        setTimeout(function(){
            starflag = false;
        }, 1000);
    } else { // talk中だったら
        toast("It works after hanging up.");
    }
}
window.sendReport = function() {
    callend();
}
window.checknewmessages = function() {
    isNewMessage(false);
}
window.kidoku = function() {}
window.ischat = function(id) {
    setChatButton(true);
}
// chat.jsの変更箇所
window.getChats = function(hisid, istalk, personI) {
    var hiti = info[personI].historyTi;
    if (hiti) {
        chattime0 = new Date(hiti - (-8*60*1000));
        chattime1 = new Date(hiti - (-9*60*1000));
        chattime2 = new Date(hiti - (-10*60*1000));
        chattime3 = new Date(hiti - (-11*60*1000));
        chattime4 = new Date(hiti - (-12*60*1000));
        chattime5 = new Date(hiti - (-13*60*1000));

        var demochat = {
            mynum: 0,
            chats: [
                {from: 0,text: "Hi, Nice to meet you!",time: chattime0},
                {from: 1,text: "Hi, Ms.Demo!",time: chattime1},
                {from: 0,text: "How can I start video chat?",time: chattime2},
                {from: 1,text: "All you need is to login from Orange button.",time: chattime3},
                {from: 0,text: "I found that button on top of the screen. Am I right?",time: chattime4},
                {from: 1,text: "Exactly. Enjoy video chats!",time: chattime5},
            ]};
        initChat(demochat, istalk, personI);
    } 
}
$(document).unbind("keypress");
$(document).on("keypress", "#message_text", function(e) {
    if (e.keyCode == 13) { // Enterが押された
        if (e.shiftKey) { // Shiftキーも押されたら通常の動作
        } else {
            e.preventDefault();
            var text = $("[name=message_text]").val();
            var data = {
                text: text,
                time: new Date()
            }
            if (text != "") { // 空白だったら何もしない
                appendMyMessage(data);
                last_top = last_top + $(".message_container").last().height();
                $('#chatbox').animate({scrollTop: last_top});
                $("[name=message_text]").val(""); // id指定ではvalが使えないので、nameで指定。
            }
        }　
    }
});
window.ischat = function(id) {
    if (page_name == "map" || page_name == "history") {
        setChatButton("ok");
    } else if (page_name == "room") {
        setChatButton();
    }
}
// Headerの変更箇所
$('#counter').before('<span id="demo_top_mes"><div class="joinchamplebutton reflection-img" onclick="onLoginButtonClick()"><span style="display:inline-block;margin-top:12px;">JOIN CHAMPLE FOR FREE</span><div class="reflection"></div></div></span>');
$('#counter').html('You talked <span class="emphasis">11</span> persons from <span class="emphasis">11</span> countries.');
setTimeout(function() {
    $('#counter').css({'visibility':'visible'});
}, 100);
window.openChatOfficial = function() {
    $("#gray_panel").fadeIn();
    $(document.body).append(contactHTML);
}
$("#gray_panel").click(function() {
    $("#contact_container").remove();
});
// sendSignal.jsの変更箇所
window.TimerCount = function(){}
var isjoinroom = false;
window.joinroom = function() {
    if (isbusy) {
        busynow();
    }
    if (isjoinroom) {
        if (page_name == "room") {
            realtimeLoad();
        }
        $("#joinnow").css("display","none");
        isjoinroom = false;
    } else {
        if (page_name == "room") {
            realtimeLoad(true);
        }
        $("#joinnow").css("display","block");
        isjoinroom = true;
    }
}
window.realtimeLoad = function(isin) {
    if (isin) {
        console.log("in");
        info.unshift(demoplayer);
    } else {
        console.log("ont");
        info.splice(0,1);
    }
    totalPerson = info.length;
    totalPage = Math.ceil(totalPerson / personInPage);
    if (totalPage == 0) totalPage = 1;
    // outしたときにページ内に誰もいないということにならないように
    if (totalPage < currentPage) {
        currentPage = totalPage;
    }
    setPersons(currentPage);
}
var isautomatch = false;
window.automatch = function() {
    if (isbusy) {
        busynow();
    }
    if (isautomatch) {
        $("#matching").css("display","none");
        isautomatch = false;
    } else {
        $("#matching").css("display","block");
        toast("Talk with somebody who also click 'automatch'.");
        isautomatch = true;

        setTimeout(function() {
            if (isautomatch) {
                info = [{
                    id: "11",
                    nickname: "Victoria",
                    country: "ar",
                    shortBio: "Hey!",
                    longBio: demolongbio,
                    languages: ["en","es"],
                    gender: "fe",
                    historyTi: time11,
                    last:{
                        time: new Date(time11 - (-13*60*1000)),
                        text: demolastchat
                    }
                }];
                callend(true);
                candidate_name = "Victoria";
                var raw_country = "ar";
                var country = countryMap[raw_country];
                candidate_country = country;
                openTalk("11");
                onReady();
                onCandidate();
                $("#matching").css("display","none");
                isautomatch = false;
            }
        },5000);
    }
}
window.callSignal = function(id){
    toast("If he/she pick up your call, a videochat will start.");
    setTimeout(function() {
        callend();
        openTalk(id);
        onReady();
        onCandidate();
        audio.pause();
        audio.currentTime = 0;
        isCallingNow = false;
        $("#gray_panel").attr("onclick","callend()");
        $("#countdown").html("");
    }, 5000);
}
window.answerSignal = function(){}
window.sendBusyCheck = function(){}
var isbusy = false;
window.busynow = function(){
    if (!isbusy) {
        $("#busy").css("display","block");
        toast("When you are busy, Nobody can call you.");
        if (isjoinroom) {
            joinroom();
        }
        if (isautomatch) {
            automatch();
        }
        isbusy = true;
    } else {
        $("#busy").css("display","none");
        isbusy = false;
    }
}
window.removeBusy = function(){}
window.onCandidate = function() {
    oniceFlag = true;
    isTimer = true;
    setStart();
    disp();
    $("#loading").fadeOut("fast");
    $("#talk_maincontainer").fadeIn("slow");
    window.onbeforeunload = function(){
        return 'If you reload, this call will be ended.';
    };
    // display:none だと効かないので、このタイミングで実行。
    if ($(".message_container").last().offset()) {
        last_top = $(".message_container").last().offset().top;
    }
    $('#chatbox').animate({scrollTop: last_top},0);   
}
// openTalk.jsの変更箇所
window.openTalk = function(hisid) {
    var talkHTML;
    if (!isMobile) {
        talkHTML = '' +
        '<div id="talk_container" class="lightgray">' +
            '<div id="loading"><img src="../images/loading.gif" class="loading"></div>' +
            '<div id="talk_maincontainer">' +
                '<div id="user_info" class="ultra_deepgray_font"><span id="nickname">'+candidate_name+'</span> / <span id="country">'+candidate_country+'</span></div>' +
                '<div><video id="remote-video" autoplay></video></div>' +
                '<div id="demo_talk_mes">This is a Demo page.</br>You need login to enjoy videochat.</div>' +
                '<div id="demo_talk_photo"><img src="../images/faces/'+hisid+'.jpeg" width="80" height="80"></div>' +
                '<div id="left_part">' +
                    // chat.htmlと共通の部品を使う chat.cssとの差異は直接記述する
                    '<div id="chat_container" class="lightgray" style="position:relative;top:0;left:0;width:270px;height:200px;">' +
                        '<div id="chatbox"  style="width:270px;height:200px;"></div>' +
                        '<form action="/messages" method="POST" id="new_message">' +
                        '<textarea id="message_text" class="lightgray" name="message_text" col="40" row="3"  style="width:250px;height:40px;"></textarea>' +
                        '</form>' +
                    '</div>' +
                    // ここまでchat.htmlと共通
                '</div>' +
                '<div id="right_part">' +
                    '<video id="local-video" autoplay></video></br>' +
                    '<div id="hangupbutton" onclick="hangUp();">&#9742;</div>' +
                    '<div id="timer"></div>' +
                    '<div id="buttons_talk">' +
                        '<span class="star_talk" onclick="star('+"'"+hisid+"'"+')"></span>' +
                        '<span class="reportbutton_talk" onclick="report('+"'"+hisid+"'"+',null)"> ・ Report</span>' +
                        '<span class="blockbutton_talk" onclick="block('+"'"+hisid+"'"+')"></span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    } else {
        talkHTML = '' +
        '<div id="talk_container" class="lightgray">' +
            '<div id="loading"><img src="../images/loading.gif" class="loading"></div>' +
            '<div id="talk_maincontainer">' +
                '<div id="user_info" class="ultra_deepgray_font"><span id="nickname">'+candidate_name+'</span> / <span id="country">'+candidate_country+'</span></div>' +
                '<div><video id="remote-video" autoplay></video></div>' +
                '<div id="demo_talk_mes">This is a Demo page.</br>You need login to enjoy videochat.</div>' +
                '<div id="demo_talk_photo"><img src="../images/faces/'+hisid+'.jpeg" width="80" height="80"></div>' +
                '<div id="left_part">' +
                    // chat.htmlと共通の部品を使う chat.cssとの差異は直接記述する
                    '<div id="chat_container" class="lightgray" style="position:relative;top:0;left:0;width:95%;height:160px;margin-left:5%;">' +
                        '<div id="chatbox"  style="width:100%;height:120px;"></div>' +
                        '<form action="/messages" method="POST" id="new_message">' +
                        '<textarea id="message_text" class="lightgray" name="message_text" col="40" row="3"  style="width:90%;height:40px;margin-left:5%;"></textarea>' +
                        '</form>' +
                    '</div>' +
                    // ここまでchat.htmlと共通
                '</div>' +
                '<div id="right_part">' +
                    '<video id="local-video" autoplay></video></br>' +
                    '<div id="hangupbutton" onclick="hangUp();">&#9742;</div>' +
                    '<div id="timer"></div>' +
                    '<div id="buttons_talk">' +
                        '<span class="star_talk" onclick="star('+"'"+hisid+"'"+')"></span>' +
                        '<span class="reportbutton_talk" onclick="report('+"'"+hisid+"'"+',null)"> ・ Report</span>' +
                        '<span class="blockbutton_talk" onclick="block('+"'"+hisid+"'"+')"></span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }
    $(document.body).append(talkHTML);
    if (stars.indexOf(hisid) != -1) {
        $(".star_talk").html("<img src='../images/starred.png' width='20' height='20'>");
    } else {
        $(".star_talk").html("<img src='../images/nostar.png' width='20' height='20'>");
    }
    if (blocks.indexOf(hisid) != -1) {
        $(".blockbutton_talk").html("Unblock");
    } else {
        $(".blockbutton_talk").html("Block");
    }
    $("#gray_panel").fadeIn("fast");
    getChats(hisid, true, 0); // chat.js
    currentChatPerson = hisid; // chat.js
}
// talk.jsの変更箇所
window.hangUp = function() {
    if (talkingFlag) {
        peerConnection.close();
        peerConnection = null;
        localVideo.src = "";
        remoteVideo.src = "";
        for (var i = 0; i < track.length; i++) {
            track[i].stop();
        }
        window.onbeforeunload = null;
        localVideo = null;
        remoteVideo = null;
        localStream = null;
        socketReady = false;
        peerStarted = false; 
        talkingFlag = false;
        oniceFlag = false;
        isTimer = false;
    }
}

} // ここまでがDemoだったときにのみ動作する部分

// ここからはDemoのときだけ使うfunctionを定義する

// デスクトップのMap画面で、写真をクリックするよう促すメッセージを表示
function check_clickphoto_mes() {
    setTimeout(function() {
        if ($("#images").html() && $("#clickphoto_mes_flame").html() == null) {
            $('#images').append('<div id="clickphoto_mes_flame"><span id="clickphoto_mes">Click Photo</span><span class="triangle_left_2"></span><div>');
        }
        check_clickphoto_mes();
    }, 2000); 
}
function onLogoutButtonClick() {
    // クッキーを全部消去
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "num=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "pref=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "myco=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "extends=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    location.href = "/";
}

var ua = window.navigator.userAgent.toLowerCase();
function onLoginButtonClick(event) {
    if (ua.indexOf('iphone') != -1) {
        alert("iOS is not available in this app.\nPlease use PC or Android.");
    } else if (ua.indexOf('chrome') == -1 && ua.indexOf('opera') == -1 && ua.indexOf('firefox') == -1) {
        alert("Chrome, Firefox and Opere are available.\nPlease use these browser.");
    } else {
        openLoginScreen();
    }
}

function onLoginSuccess(response) {
    var idcookie = 'id=' + response.userID + ':' + response.hash;
    if (response.keeplogin) {idcookie += '; max-age=604800;';}
    document.cookie = idcookie + cookieSecure;
    if (response.pnum != 0 && response.cnum != 0) {
        var numcookie = 'num=' + response.pnum + ":" + response.cnum;
        if (response.keeplogin) {numcookie += '; max-age=604800;';}
        document.cookie = numcookie + cookieSecure;
    }
    location.href = "/room";
}

function loginwithemail() {
    $("#login_zero_row").fadeOut(function() {
        $("#login_first_row").fadeIn();
        $("#login_messages").fadeIn();
    });
    
}

function openLoginScreen() {
    var loginHTML;
    if (!isMobile) {
        loginHTML = "" +
        //'<div id="login_container" style="left:202px;">' +
        '<div id="login_container">' +
            '<div id="login_title">Login & Signup</div>' +
            '<div id="login_zero_row" >' +
                '<div id="FbBtn" onclick="myFacebookLogin()"><span id="FbBtnLabel">Login with Facebook</span></div>' +
                '<div id="EmBtn" onclick="loginwithemail()"><span id="EmBtnLabel">Login with Email</span></div>' +
            '</div>' +
            '<div style="display:none;" id="login_first_row">' +
                '<span id="login_email">Email</span>' +
                '<input id="emailform" placeholder="abc@gmail.com"></input>' +
                '<span onclick="getToken()" class="login_buttons">Get Token</span>' +
            '</div>' +
            '<div id="login_second_row">' +
                '<span id="login_token">Token</span>' +
                '<input id="tokeninput" placeholder="1234567"></input>' +
                '<span onclick="sendToken()" class="login_buttons">Continue</span>' +
            '</div>' +
            '<div style="display:none;" id="login_messages">We\'ll send a token to your Email address.</div>' +
        '</div>';
    } else {
        loginHTML = "" +
        //'<div id="login_container" style="left:0px;width:320px;">' +
        '<div id="login_container">' +
            '<div id="login_title">Login & Signup</div>' +
            '<div id="login_zero_row" >' +
                '<div id="FbBtn" onclick="myFacebookLogin()"><span id="FbBtnLabel">Login with Facebook</span></div>' +
                '<div id="EmBtn" onclick="loginwithemail()"><span id="EmBtnLabel">Login with Email</span></div>' +
            '</div>' +
            '<div style="display:none;" id="login_first_row" style="margin: 10px 10px 15px 20px;">' +
                '<span id="login_email" style="width:60px;">Email</span>' +
                '<input id="emailform" placeholder="abc@gmail.com" style="width:115px;"></input>' +
                '<span onclick="getToken()" class="login_buttons">Get Token</span>' +
            '</div>' +
            '<div id="login_second_row" style="margin: 10px 10px 15px 20px;">' +
                '<span id="login_token" style="width:60px;">Token</span>' +
                '<input id="tokeninput" placeholder="1234567"></input>' +
                '<span onclick="sendToken()" class="login_buttons">Continue</span>' +
            '</div>' +
            '<div style="display:none;" id="login_messages" style="margin: 0 20px;">We\'ll send a token to your Email address.</div>' +
        '</div>';
    }
    $("#gray_panel").fadeIn();
    $(document.body).append(loginHTML);
}

// ここからはDemoのときだけ使う変数(定数)を定義する

var contactHTML = '' +
'<div id="contact_container">' +
    '<div class="contact_titles">If you have Account</div>' +
    '<div class="contact_contents">Please log in first, and click "Contact Us" again.</div>' +
    '<div class="contact_titles">If you don\'t have Account</div>' +
    '<div class="contact_contents">Please email us. ( <a href="mailto:contact@chample.in" style="color:white;">contact@chample.in</a> )</div>' +
'</div>';

var ctime= (new Date()).getTime();  
var time1 = new Date( ctime - 1*60*60*1000 - 11*60*1000);
var time2 = new Date( ctime - 1*60*60*1000 - 50*60*1000);
var time3 = new Date( ctime - 1*24*60*60*1000 - 0*60*60*1000 - 34*60*1000);
var time4 = new Date( ctime - 1*24*60*60*1000 - 1*60*60*1000 - 59*60*1000);
var time5 = new Date( ctime - 1*24*60*60*1000 - 2*60*60*1000 - 40*60*1000);
var time6 = new Date( ctime - 2*24*60*60*1000 - 2*60*60*1000 - 10*60*1000);
var time7 = new Date( ctime - 2*24*60*60*1000 - 2*60*60*1000 - 51*60*1000);
var time8 = new Date( ctime - 2*24*60*60*1000 - 3*60*60*1000 - 30*60*1000);
var time9 = new Date( ctime - 3*24*60*60*1000 - 0*60*60*1000 - 12*60*1000);
var time10 = new Date( ctime - 4*24*60*60*1000 - 1*60*60*1000 - 38*60*1000);
var time11 = new Date( ctime - 4*24*60*60*1000 - 2*60*60*1000 - 02*60*1000);

var demolongbio = "This is a Demo page. <br/>You can test call and chat.<br/>If you want to join us,<br />please login from the Orange button.";
var demolongbio2 = "This is a Demo page. <br/>You can test call.<br/>If you want to join us,<br />please login from the Orange button.";
var demolastchat = "Exactly. Enjoy video chats!";
var demoinfo = [{
    id: "1",
    nickname: "Aya",
    country: "jp",
    shortBio: "Hi, I'm from Tokyo. I wanna make friends all over the world!",
    longBio: demolongbio,
    languages: ["en","ja"],
    gender: "fe",
    historyTi: time1,
    last:{
        time: new Date(time1 - (-13*60*1000)),
        text: demolastchat
    }
},{
    id: "2",
    nickname: "Kate",
    country: "ca",
    shortBio: "I love reading novels. Let's talk about books.",
    longBio: demolongbio,
    languages: ["en"],
    gender: "fe",
    historyTi: time2,
    last:{
        time: new Date(time2 - (-13*60*1000)),
        text: demolastchat
    }
},{
    id: "3",
    nickname: "John",
    country: "gb",
    shortBio: "I like traveling. Someday I wanna travel around the world.",
    longBio: demolongbio,
    languages: ["en"],
    gender: "ma",
    historyTi: time3,
    last:{
        time: new Date(time3 - (-13*60*1000)),
        text: demolastchat
    }
},{
    id: "4",
    nickname: "David",
    country: "au",
    shortBio: "I love eating. I wanna know various foods around the world.",
    longBio: demolongbio,
    languages: ["en"],
    gender: "ma",
    historyTi: time4,
    last:{
        time: new Date(time4 - (-13*60*1000)),
        text: demolastchat
    }
},{
    id: "5",
    nickname: "Ammie",
    country: "ng",
    shortBio: "My hobby is dancing. I wanna know various dance cultures.",
    longBio: demolongbio,
    languages: ["en"],
    gender: "fe",
    historyTi: time5,
    last:{
        time: new Date(time5 - (-13*60*1000)),
        text: demolastchat
    }
},{
    id: "6",
    nickname: "Shaoyu",
    country: "cn",
    shortBio: "Hi. I'm learning English. I wanna improve my speaking skill.",
    longBio: demolongbio,
    languages: ["en","zh"],
    gender: "fe",
    historyTi: time6,
    last:{
        time: new Date(time6 - (-13*60*1000)),
        text: demolastchat
    }
},{
    id: "7",
    nickname: "Nina",
    country: "ru",
    shortBio: "I'm fun of latin music. It's very suitable for dancing.",
    longBio: demolongbio,
    languages: ["en","ru"],
    gender: "fe",
    historyTi: time7,
    last:{
        time: new Date(time7 - (-13*60*1000)),
        text: demolastchat
    }
},{
    id: "8",
    nickname: "Sandra",
    country: "de",
    shortBio: "I'm learning Spanish. Let's talk in Spanish.",
    longBio: demolongbio,
    languages: ["en","de"],
    gender: "fe",
    historyTi: time8,
    last:{
        time: new Date(time8 - (-13*60*1000)),
        text: demolastchat
    }
},{
    id: "9",
    nickname: "Amit",
    country: "in",
    shortBio: "I love watching European soccer. Let's talk about soccer.",
    longBio: demolongbio,
    languages: ["en","hi"],
    gender: "ma",
    historyTi: time9,
    last:{
        time: new Date(time9 - (-13*60*1000)),
        text: demolastchat
    }
},{
    id: "10",
    nickname: "Lucas",
    country: "se",
    shortBio: "Hi, I'm from Stockholm. I wanna make friends all over the world!",
    longBio: demolongbio,
    languages: ["en"],
    gender: "ma",
    historyTi: time10,
    last:{
        time: new Date(time10 - (-13*60*1000)),
        text: demolastchat
    }
},{
    id: "11",
    nickname: "Victoria",
    country: "ar",
    shortBio: "My hobby is going to cafe. Every weekend I stay in cafe.",
    longBio: demolongbio,
    languages: ["en","es"],
    gender: "fe",
    historyTi: time11,
    last:{
        time: new Date(time11 - (-13*60*1000)),
        text: demolastchat
    }
}];

var demoinfo_room = [{
    id: "21",
    nickname: "Julia",
    country: "br",
    shortBio: "Hi. I'm learning English. I wanna improve my speaking skill.",
    languages: ["en","pt"],
    gender: "fe",
    longBio: demolongbio2
},{
    id: "22",
    nickname: "Marko",
    country: "rs",
    shortBio: "I love watching tennis games. Let's talk about tennis.",
    languages: ["en","ru"],
    gender: "ma",
    longBio: demolongbio2
},{
    id: "23",
    nickname: "Marie",
    country: "fr",
    shortBio: "I'm fun of latin music. It's very suitable for dancing.",
    languages: ["en","fr"],
    gender: "fe",
    longBio: demolongbio2
},{
    id: "24",
    nickname: "Cindy",
    country: "id",
    shortBio: "I like traveling. Someday I wanna travel around the world.",
    languages: ["en"],
    gender: "fe",
    longBio: demolongbio2
},{
    id: "25",
    nickname: "Nadia",
    country: "sa",
    shortBio: "Hi, I'm from Riyadh. I wanna make friends all over the world!",
    languages: ["en","ar"],
    gender: "fe",
    longBio: demolongbio2
},{
    id: "26",
    nickname: "Selena",
    country: "jm",
    shortBio: "I love eating. I wanna know various foods around the world.",
    languages: ["en","es"],
    gender: "fe",
    longBio: demolongbio2
},{
    id: "27",
    nickname: "Alex",
    country: "gb",
    shortBio: "I love reading novels. Let's talk about books.",
    languages: ["en"],
    gender: "ma",
    longBio: demolongbio2
},{
    id: "28",
    nickname: "Paula",
    country: "es",
    shortBio: "My hobby is going to cafe. Every weekend I stay in cafe.",
    languages: ["en","es"],
    gender: "fe",
    longBio: demolongbio2
}];