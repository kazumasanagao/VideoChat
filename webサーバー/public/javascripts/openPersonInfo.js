// insertPerson.js, map.js より呼出
var starflag = false;
function openPersonInfo(personI) {
    if (!starflag) {
        makeHTML(personI);
        setPersonInfoHTML(personI);
        $("#gray_panel").fadeIn("fast");
        // 写真が無い or ロードに失敗した時はうさぎの画像を挿入
        $('img').error(function(){
            $(this).attr('src', makeRapidsUrl()); // conf.jsより
        });
    }
}

function setPersonInfoHTML(personI) {
    var id,country,num;
    if (typeof personI == "number") {
        id = info[personI].id;
        country = info[personI].country;
        num = personI;
    } else { // Map画面からchatを開くとき
        id = personI.id;
        country = personI.country;
        info = [];
        info.push(personI);
        num = 0;
    }

    $(document.body).append('' +
    '<div id="call_container" class="lightgray">' + 
        firstRowHTML + whiteBlankHTML +
        secondRowHTML + whiteBlankHTML +
        '<div id="row3" class="pink">' +
            '<span id="callbutton" class="buttons" onclick="call('+"'"+id+"'"+')">Call</span>' +
            '<span id="chatbutton" class="buttons" onclick="chat('+num+')">Chat</span>' +
            '<span id="countdown"></span>' +
            '<div id="lang_frame">' +
                // hislanguageはmakeTwoRows.jsで作成している
                '<div id="lang_container" class="hiddeninfo pink_font">'+ hislanguage +'</div>' +
                '<div class="triangle_top"></div>' +
            '</div>' +
            '<div id="nochat_frame">' +
                '<div id="nochat_container" class="hiddeninfo pink_font"></div>' +
                '<div class="triangle_top" id="tt2"></div>' +
            '</div>' +
        '</div>' +
        '<div id="toast"></div>' + // settings.jsのtoastを再利用。callしたがbusyだったときにお知らせ。
    '</div>');

    $("#callbutton").hover(
        function () {
            $("#lang_frame").css({"display":"block"});
        },
        function () {
            $("#lang_frame").css({"display":"none"});
        }
    );
    $("#callbutton").hover(
        function () { $("#lang_frame").css({"display":"block"}); },
        function () { $("#lang_frame").css({"display":"none"}); }
    );
    

    var myid = "";
    var idcookie = getCookie('id');
    if (idcookie) {myid = idcookie.split(":")[0];} 
    // 自分自身だったら
    if (id == myid) {
        $('#callbutton').css({"background":"white","border":"solid 3px #dc1482","color":"#dc1482","cursor":"default"});
        $('#callbutton').removeAttr("onclick");
        $('#lang_container').html(itsme);
        $('#chatbutton').css({"background":"white","border":"solid 3px #dc1482","color":"#dc1482","cursor":"default"});
        $('#chatbutton').removeAttr("onclick");
        $('#nochat_container').html(itsme);
        $("#chatbutton").hover(
            function () { $("#nochat_frame").css({"display":"block"}); },
            function () { $("#nochat_frame").css({"display":"none"}); }
        );
    // 同じ国の人だったら
    } else if (country == getCookie('myco')) {
        $('#callbutton').css({"background":"white","border":"solid 3px #dc1482","color":"#dc1482","cursor":"default"});
        $('#callbutton').removeAttr("onclick");
        $('#lang_container').html(samecountry);
        $('#chatbutton').css({"background":"white","border":"solid 3px #dc1482","color":"#dc1482","cursor":"default"});
        $('#chatbutton').removeAttr("onclick");
        $('#nochat_container').html(samecountry);
        $("#chatbutton").hover(
            function () { $("#nochat_frame").css({"display":"block"}); },
            function () { $("#nochat_frame").css({"display":"none"}); }
        );
    } else {
        busycheck(id);
        ischat(id); // chat.js
    }
}

// busyだったらcallボタンを非活性に
var busycheckrepeat; // 別の人を開いた時に前の人のコールが効かないよう、callend()時にclearTimeoutするために用意した変数
function busycheck(id) {
    // call_containerがある間は繰り返し
    if ($("#call_container").length) {
        sendBusyCheck(id); // sendSignal.js
        busycheckrepeat =  setTimeout(function() {
            if (!isCallingNow) { // call.js 自分がcallしてるときは問い合わせ不要
                busycheck(id);
            }
        },5000);
    }
}
// sendSignal.jsより。busyか否かの結果をもらう
function setCallButton(isbusy, id) {
    if (isbusy == 2 && !isCallingNow) { // call.js 自分がcallしてるときは更新不要
        $('#callbutton').css({"background":"white","border":"solid 3px #dc1482","color":"#dc1482","cursor":"default"});
        $('#callbutton').removeAttr("onclick");
        $('#lang_container').html(busymessage);
    } else if (isbusy == 1 && !isCallingNow){
        $('#callbutton').css({"background":"white","border":"solid 3px #dc1482","color":"#dc1482","cursor":"default"});
        $('#callbutton').removeAttr("onclick");
        $('#lang_container').html(noroommessage);
    } else if (isbusy == 0 && !isCallingNow) {
        $('#callbutton').css({"background":"white","border":"solid 3px #dc1482","color":"#dc1482","cursor":"default"});
        $('#callbutton').removeAttr("onclick");
        $('#lang_container').html(logoutmessage);
    } else {
        $('#callbutton').css({"background":"","border":"","color":"","cursor":""});
        $('#callbutton').attr("onclick", "call("+"'"+id+"'"+");");
        $('#lang_container').html(hislanguage);
    }
}

function setChatButton(ischat) {
    if (!ischat) {
        $('#chatbutton').css({"background":"white","border":"solid 3px #dc1482","color":"#dc1482","cursor":"default"});
        $('#chatbutton').removeAttr("onclick");
        $('#nochat_container').html(nevertalkedyet);
        $("#chatbutton").hover(
            function () { $("#nochat_frame").css({"display":"block"}); },
            function () { $("#nochat_frame").css({"display":"none"}); }
        );
    }
}