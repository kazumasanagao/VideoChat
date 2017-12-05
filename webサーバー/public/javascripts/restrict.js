// グレーアウト用の画面を用意しておく
$(document.body).append('<div id="gray_panel" onclick="callend();"></div>');

function callend() {
    $("#settings_container").remove();
    $("#chat_container").remove();
    $("#gray_panel").fadeOut("fast");
}

var rawrelease = $('#rawrelease').html();
var releasedate = dateFormat(rawrelease);
$('#releasedate').html("It will be released at "+releasedate+".");