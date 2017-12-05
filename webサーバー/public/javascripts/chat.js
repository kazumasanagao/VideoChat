var currentChatPerson = ""; // いまチャットしている人のidを記憶しておく
var audio_onchat = document.createElement("audio");
audio_onchat.src = onchat_sound_url; // 再生ファイルの指定
audio_onchat.volume = 0.4; // デフォルトは1.0 min0.0 max1.0
var audio_eachchat = document.createElement("audio");
audio_eachchat.src = eachchat_sound_url; // 再生ファイルの指定

checknewmessages(); // 読み込み時に新規メッセージの有無を確認

function openChat(personI) {
    makeHTML(personI);
    var chatHTML = '' +
        '<div id="chat_container" class="lightgray">' +
            firstRowHTML +
            '<div id="chatbox"></div>' +
            '<form action="/messages" method="POST" id="new_message">' +
            '<textarea id="message_text" class="lightgray" name="message_text" col="40" row="3"></textarea>' +
            '</form>' +
        '</div>';
    $(document.body).append(chatHTML);
    $("#gray_panel").fadeIn("fast");
    currentChatPerson = info[personI].id;
    getChats(currentChatPerson, false, personI);// chat.js
    // 写真が無い or ロードに失敗した時はうさぎの画像を挿入
    $('img').error(function(){
        $(this).attr('src', makeRapidsUrl()); // conf.jsより
    }); 
}

// メッセージの送信
$(document).on("keypress", "#message_text", function(e) {
    if (e.keyCode == 13) { // Enterが押された
        if (e.shiftKey) { // Shiftキーも押されたら通常の動作
        } else {
            e.preventDefault();
            var text = $("[name=message_text]").val();
            var data = {
                text: text,
                person: currentChatPerson
            }
            console.log(text);
            if (text != "") { // 空白だったら何もしない
                s.emit("chat", data);
                $("[name=message_text]").val(""); // id指定ではvalが使えないので、nameで指定。
            }
        }　
    }
});

var last_top = 0;

s.on("mymessage", function(data) {
    appendMyMessage(data);
    last_top = last_top + $(".message_container").last().height();
    $('#chatbox').animate({scrollTop: last_top});
});

s.on("hismessage", function(data) {
    if (data.id == currentChatPerson) {
        appendHisMessage(data);
        last_top = last_top + $(".message_container").last().height();
        $('#chatbox').animate({scrollTop: last_top});
        audio_eachchat.play();
        setTimeout(function() {
            kidoku(kidokudata, null);
        }, 1000);
    } else {
        if (page_name == "chat" && !talkingFlag) {
            isNewMessage(true);
            audio_onchat.play();
            var position = null;
            var hisid = data.id;
            for (var i = 0; i < info.length; i++) {
                if (info[i].id == hisid) {
                    position = i;
                    break;
                }
            }
            if (position >= 0 && position != null) {
                var rem = info.splice(position, 1);
                var last = {text: data.text, time: data.time}
                // remは配列として収まっている。だから、配列のゼロを拾う。
                var insert = {id:rem[0].id,nickname:rem[0].nickname,country:rem[0].country,shortBio:rem[0].shortBio,last:last,read:false};
                info.unshift(insert);
                setPersons(1);
            }
        } else if (!talkingFlag) {
            isNewMessage(true);
            audio_onchat.play();
        } else {
            isNewMessage(true);
        }
    }
});

function getChats(hisid, istalk, personI) {
    $.ajax({
        url: '/chat/past',
        type: 'POST',
        success: function(data) {
            if (data.val) {
                initChat(data.val, istalk, personI);
            } else {
                noChats();
            }
        },
        data: {hisid: hisid},
        dataType: 'json'
    });
}

function noChats() {
    var mynum;
    var idhash = getCookie("id");
    var myid;
    if (idhash) {
        myid = idhash.split(":")[0];
    }
    if (myid) {
        if (String(myid) < String(currentChatPerson)) {
            mynum = 0;
        } else {
            mynum = 1;
        }
    }

    kidokudata = {
        hisid: currentChatPerson,
        mynum: mynum
    }
}

var kidokudata = null;
function initChat(data, istalk, personI) {
    var mynum = data.mynum;
    var chats = data.chats;
    for (var i = 0; i <= chats.length; i++) {
        if (i != chats.length) {
            if (mynum == chats[i].from) {
                appendMyMessage(chats[i]);
            } else {
                appendHisMessage(chats[i]);
            }
        // 全部appendしたあとで、動作するように。そうしないと、topの値が正しく取れない。
        // kidokuとchecknewmessagesのせいで非同期になってるので、ループの外には書けない。
        } else {
            if (!istalk) { // talkのときはtalk.js内でこれをやる。displayがnoneだと効かないため。
                last_top = $(".message_container").last().offset().top;
                $('#chatbox').animate({scrollTop: last_top},0);
            }
        }
    }

    kidokudata = {
        hisid: currentChatPerson,
        mynum: mynum
    }
    kidoku(kidokudata, personI);
    // 同時にやると、既読にチェックが入る前にnewmessageのチェックが入ってしまうことがあるので、遅らせる必要あり。
    setTimeout(function() {
        checknewmessages();
    },500); 
}

function appendMyMessage(data) {
    var text = data.text;
    var rawdate = data.time;
    var date = dateFormat(rawdate);

    $("#chatbox").append('' + 
        '<div class="message_container">' +
            '<div class="my_messages blue">'+ text +'</div>' +
            '<div class="triangle_right"></div>' +
            '<div class="datetime_right">'+ date +'</div>' +
        '</div>');
}

function appendHisMessage(data) {
    var text = data.text;
    var rawdate = data.time;
    var date = dateFormat(rawdate);

    $("#chatbox").append('' + 
        '<div class="message_container">' +
            '<div class="friend_messages pink">'+ text +'</div>' +
            '<div class="triangle_left"></div>' +
            '<div class="datetime_left">'+ date +'</div>' +
        '</div>');
}

function kidoku(data, personI) {
    $.ajax({
        url: '/chat/read',
        type: 'POST',
        success: function(data) {
            if (data.success) {
                var idstr = "#newmes"+personI;
                $(idstr).css("display","none");
                if (personI) {
                    info[personI].read = true;
                }
            }
        },
        data: data,
        dataType: 'json'
    });
}

function ischat(id) {
    $.ajax({
        url: '/chat/ischat',
        type: 'POST',
        success: function(data) {
            setChatButton(data.chatok); // openPersonInfo.js
        },
        data: {id: id},
        dataType: 'json'
    });
}

function checknewmessages() {
    $.ajax({
        url: '/chat/new',
        type: 'POST',
        success: function(data) {
            if (data.isnew) {
                isNewMessage(true);
            } else {
                isNewMessage(false);
            }
        }
    });
}

function isNewMessage(isnew) {
    if (isnew) {
        $("#newmessage").css("display","block");
    } else {
        $("#newmessage").css("display","none");
    }
}

function openChatOfficial() {
    var chatHTML = '' +
        '<div id="chat_container" class="lightgray">' +
            '<div id="row1" class="green">' +
                '<img src="'+image_url+'yg2ANmM6ok.jpeg" width="80" height="80" alt="face">' +
                '<div class="called_intro">' +
                    '<div class="called_intro_top yellow_font">' +
                        '<span class="called_nickname">Chample</span>' +
                        '&nbsp;/&nbsp;' +
                        '<span class="called_nation">Japan</span>' +
                    '</div>' +
                    '<div class="called_intro_bottom">' +
                        '<span class="called_short_intro">This is a Chample officail account. If you have any questions, feel free to ask me!</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div id="chatbox"></div>' +
            '<form action="/messages" method="POST" id="new_message">' +
            '<textarea id="message_text" class="lightgray" name="message_text" col="40" row="3"></textarea>' +
            '</form>' +
        '</div>';
    $(document.body).append(chatHTML);
    $("#gray_panel").fadeIn("fast");
    currentChatPerson = "yg2ANmM6ok";
    getChats(currentChatPerson, false, '');// chat.js
    // 写真が無い or ロードに失敗した時はうさぎの画像を挿入
    $('img').error(function(){
        $(this).attr('src', makeRapidsUrl()); // conf.jsより
    }); 
}