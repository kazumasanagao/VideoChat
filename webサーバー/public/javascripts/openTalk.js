// sendSignal.js, call.js より呼出
// candidate_nameとcandidate_contはmakeTwoRows.jsの中から持ってきている
function openTalk(hisid) {
    var talkHTML;
    if (!isMobile) {
        talkHTML = '' +
        '<div id="talk_container" class="lightgray">' +
            '<div id="loading"><img src="../images/loading.gif" class="loading"></div>' +
            '<div id="talk_maincontainer">' +
                '<div id="user_info" class="ultra_deepgray_font"><span id="nickname">'+candidate_name+'</span> / <span id="country">'+candidate_country+'</span></div>' +
                '<div><video id="remote-video" autoplay></video></div>' +
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
                        '<span class="star_talk" onclick="star('+"'"+hisid+"'"+',null)"></span>' +
                        '<span class="reportbutton_talk" onclick="report('+"'"+hisid+"'"+',null)"> ・ Report</span>' +
                        '<span class="blockbutton_talk" onclick="block('+"'"+hisid+"'"+',null)"></span>' +
                    '</div>' +
                    '<div id="toast" style="left:130px;"></div>' +
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
                        '<span class="star_talk" onclick="star('+"'"+hisid+"'"+',null)"></span>' +
                        '<span class="reportbutton_talk" onclick="report('+"'"+hisid+"'"+',null)"> ・ Report</span>' +
                        '<span class="blockbutton_talk" onclick="block('+"'"+hisid+"'"+',null)"></span>' +
                    '</div>' +
                    '<div id="toast" style="left:30px;"></div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    // starかどうかcheck
    $.ajax({
        url: '/history/starcheck',
        type: 'POST',
        success: function(data) {
            if (data.isstar) {
                $(".star_talk").html("<img src='../images/starred.png' width='20' height='20'>");
            } else {
                $(".star_talk").html("<img src='../images/nostar.png' width='20' height='20'>");
            }
        },
        data: {id: hisid},
        dataType: 'json'
    });
    // blockしてるかどうかcheck
    $.ajax({
        url: '/history/blockcheck',
        type: 'POST',
        success: function(data) {
            if (data.isblock) {
                $(".blockbutton_talk").html("Unblock");
            } else {
                $(".blockbutton_talk").html("Block");
            }
        },
        data: {id: hisid},
        dataType: 'json'
    });
    $(document.body).append(talkHTML);
    $("#gray_panel").fadeIn("fast");
    getChats(hisid, true); // chat.js
    currentChatPerson = hisid; // chat.js
}