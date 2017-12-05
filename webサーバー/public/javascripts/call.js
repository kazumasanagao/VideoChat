// Call中かどうか コール音の再生とカウントダウンの制御
var isCallingNow = false;

// 呼び出し音関係の変数の初期化
var audio = document.createElement("audio");
audio.src = ring_sound_url; // 再生ファイルの指定
audio.addEventListener('ended', function() {
    setTimeout(function() { 
        if (isCallingNow) { // Call画面が開いている間は繰り返し鳴らす
            audio.play();
        }
    }, 1200);
}, false);

// グレーアウト用の画面を用意しておく
$(document.body).append('<div id="gray_panel" onclick="callend();"></div>');

// ボタン押下時の挙動
function pickup(data) {
    callend(true);
    openTalk(data.id); // openTalk.js
    answerSignal(data); // sendSignal.js
}
function hangup() {
    callend();
}
function call(id) {
    isCallingNow = true;
    $("#gray_panel").removeAttr("onclick"); // 自分からcallしているときは切れないように。
    $("#chatbutton").removeAttr("onclick");
    $('#chatbutton').css({"background":"white","border":"solid 3px #dc1482","color":"#dc1482","cursor":"default"});
    $("#callbutton").removeAttr("onclick");
    $('#callbutton').css({"background":"white","border":"solid 3px #dc1482","color":"#dc1482","cursor":"default"});
    window.onbeforeunload = function(){
        return 'You are calling now.';
    };
    setTimer();
    startTimer();
    audio.play();
    callSignal(id); // sendSignal.js
}
function chat(personI) {
    callend();
    openChat(personI); // chat.js
}

// Call終了時の挙動
function callend(isBusy) {
    if (!talkingFlag) { // talk.jsより。会話中は消えないように。
        isCallingNow = false;
        audio.pause();
        audio.currentTime = 0; // 次回再生のときに始めから流れるように。
        $("#call_container").remove();
        $("#chat_container").remove();
        $("#talk_container").remove();
        $("#settings_container").remove();
        $("#report_container").remove();
        $("#login_container").remove();
        $("#gray_panel").attr("onclick","callend()"); // 自分からcallしたときは削除されてるので、復活させる
        $("#gray_panel").fadeOut("fast");
        clearTimeout(busycheckrepeat); // openPersonInfo.js
        // busy状態を継続したいときはcallendにtrueが入っている
        if (!isBusy) { removeBusy(); }
        // chat.jsより いまチャットしている人のidをリセット
        currentChatPerson = "";
        window.onbeforeunload = null;
        kidokudata = null;
    } 
}

// Callしたが、かからなかった時の処理
function callbut(data) {
    var mes = "";
    switch (data) {
        case 0:
            mes = logoutmessage;
            break;
        case 1:
            mes = noroommessage;
            break;
        case 2:
            mes = busymessage;
            break;
        case 3:
            mes = itsme;
            break;
        case 4:
            mes = samecountry;
            break;
    }
    toast(mes); // setting.jsのtoastを再利用
    isCallingNow = false;
    $("#gray_panel").attr("onclick","callend()");
    audio.pause();
    audio.currentTime = 0;
    $("#countdown").html("");
}

// callrequestを受けた時の処理
function openCalled(data) {
    if (!talkingFlag) {
        var idAndRoom = "{id: '"+data.id+"', roomname: "+data.roomname+"}";
        callend(true);
        makeHTML(data);
        setCalledHTML(idAndRoom, data.id);
        isCallingNow = true;
        setTimer();
        startTimer();
        audio.play();
        $("#gray_panel").fadeIn("fast");
        // 写真が無い or ロードに失敗した時はうさぎの画像を挿入
        $('img').error(function(){
            $(this).attr('src', makeRapidsUrl()); // conf.jsより
        });
    }
}

function setCalledHTML(idAndRoom, id) {
    $(document.body).append('' +
    '<div id="call_container" class="lightgray">' + 
        firstRowHTML + whiteBlankHTML +
        secondRowHTML + whiteBlankHTML +
        '<div id="row3" class="pink">' +
            '<span id="pickup" class="buttons" onclick="pickup('+ idAndRoom +');">Pick up</span>' +
            '<span id="hangup" class="buttons" onclick="hangup();">Hang up</span>' +
            '<span id="countdown"></span>' +
            '<span class="blockbutton_talk" onclick="block('+"'"+id+"'"+', null)" style="color:white;margin-top:25px;">Block</span>' +
            '<div id="lang_frame">' +
                '<div id="lang_container" class="hiddeninfo pink_font">'+ hislanguage +'</div>' +
                '<div class="triangle_top"></div>' +
            '</div>' +
            '<div id="hangup_description">* Don&prime;t worry. When you hang up, he/she will not notice it.</div>' +
        '</div>' +
    '</div>');

    $("#pickup").hover(
        function () {
            $("#lang_container").css({"left":"30px"});
            $(".triangle_top").css({"left":"40px"});
            $("#lang_frame").css({"display":"block"});
        },
        function () {
            $("#lang_frame").css({"display":"none"});
            $("#lang_container").css({"left":"80px"});
            $(".triangle_top").css({"left":"90px"});
        }
    );
}

// タイマー関係の変数の初期化
var start;
var sec = 0, now = 0, datet = 0;
const timeout = 20;
// タイマー関係の関数
function setTimer() {
    start = new Date();
}
function startTimer() {
    now = new Date();
    datet = parseInt((now.getTime() - start.getTime()) / 1000);
    sec = datet % 60;
    restOfTime = timeout - sec;
    if (restOfTime < 1) { // 残り時間がゼロになったとき
        callend();
    } else {
        if (isCallingNow) { // call画面がまだあれば画面を更新して、くり返す。
            $("#countdown").html(restOfTime);
            setTimeout("startTimer()", 1000);
        }
    }
}