function getToken() {
    $.ajax({
        type: 'POST',
        url: '/login/gettoken',
        data: {email: $("#emailform").val()},
        success: function(data) {
            console.log(data); // テスト
            if (data.stat == "ok") {
                $("#login_first_row").fadeOut(function() {
                    $("#login_second_row").fadeIn();
                    $("#login_title").html("<span style='color:#f5eb28;'>We sent you an Email.</span><br />Check token code in that mail.");
                    $("#login_title").css({"line-height":"140%"});
                    $("#login_messages").html("It's a 7 digit number like '1234567'.");
                    $("#login_messages").css({"color":"white"});
                    $("#gray_panel").removeAttr("onclick");
                    window.onbeforeunload = function() {
                        return 'If you leave this page, the token we sent will be invalid.';
                    };
                });
            } else if (data.stat == "al") {
                $("#login_messages").html("We've sent you a token just now.<br />you'll be able to resend this request "+data.restmin+" minutes later." );
                $("#login_messages").css({"color":"#f5eb28"});
            } else if (data.stat == "ng") {
                $("#login_messages").html("Invalid Email Address.");
                $("#login_messages").css({"color":"#f5eb28"});
            }
        }
    });
}
function sendToken() {
    if ($("#tokeninput").val() && $("#emailform").val()) {
        $.ajax({
            type: 'POST',
            url: '/login/sendtoken',
            data: {token: $("#tokeninput").val(), email: $("#emailform").val()},
            success: function(data) {
                if (data.stat == "ok") {
                    window.onbeforeunload = null;
                    onLoginSuccess(data);
                } else if (data.stat == "ov") {
                    $("#login_messages").html("Over 10 minutes. You need to get new token.");
                    $("#login_messages").css({"color":"#f5eb28"});
                    $("#gray_panel").attr("onclick","closepanel()");
                    window.onbeforeunload = null;
                } else if (data.stat == "ms") {
                    $("#login_messages").css({"display":"none"});
                    $("#login_messages").html("Incorrect Token.");
                    $("#login_messages").fadeIn("fast");
                    $("#login_messages").css({"color":"#f5eb28"});
                } else if (data.stat == "rs") {
                    $("#login_messages").html("Failed 3 times in 10 minutes. Current token is invalid now.<br />Try again several minutes later.");
                    $("#login_messages").css({"color":"#f5eb28"});
                    $("#gray_panel").attr("onclick","closepanel()");
                    window.onbeforeunload = null;
                }
            }
        });
    }
}

function getTokenCh() {
    $.ajax({
        type: 'POST',
        url: '/login/gettokench',
        data: {email: $("#emailform").val()},
        success: function(data) {
            console.log(data); // テスト
            if (data.stat == "ok") {
                $("#login_first_row").fadeOut(function() {
                    $("#login_second_row").fadeIn();
                    $("#login_title").html("<span style='color:#f5eb28;'>We sent you an Email.</span><br />Check token code in that mail.");
                    $("#login_title").css({"line-height":"140%"});
                    $("#login_messages").html("It's a 7 digit number like '1234567'.");
                    $("#login_messages").css({"color":"white"});
                    $("#gray_panel").removeAttr("onclick");
                    window.onbeforeunload = function() {
                        return 'If you leave this page, the token we sent will be invalid.';
                    };
                });
            } else if (data.stat == "al") {
                $("#login_messages").html("We've sent you a token just now.<br />you'll be able to resend this request "+data.restmin+" minutes later." );
                $("#login_messages").css({"color":"#f5eb28"});
            } else if (data.stat == "cu") {
                $("#login_messages").html("This is your current Email address.");
            } else if (data.stat == "du") {
                $("#login_messages").html("This Address has been already used.");
            } else if (data.stat == "ng") {
                $("#login_messages").html("Invalid Email Address.");
                $("#login_messages").css({"color":"#f5eb28"});
            }
        }
    });
}

function sendTokenCh(isConnect) {
    if ($("#tokeninput").val() && $("#emailform").val()) {
        $.ajax({
            type: 'POST',
            url: '/login/sendtokench',
            data: {token: $("#tokeninput").val(), email: $("#emailform").val()},
            success: function(data) {
                if (data.stat == "ok") {
                    callend();
                    if (isConnect) {
                        alert("Successfully registered");
                    } else {
                        alert("Successfully changed");
                    }
                } else if (data.stat == "ov") {
                    $("#login_messages").html("Over 10 minutes. You need to get new token.");
                    $("#login_messages").css({"color":"#f5eb28"});
                    $("#gray_panel").attr("onclick","callend()");
                    window.onbeforeunload = null;
                } else if (data.stat == "ms") {
                    $("#login_messages").css({"display":"none"});
                    $("#login_messages").html("Incorrect Token.");
                    $("#login_messages").fadeIn("fast");
                    $("#login_messages").css({"color":"#f5eb28"});
                } else if (data.stat == "rs") {
                    $("#login_messages").html("Failed 3 times in 10 minutes. Current token is invalid now.<br />Try again several minutes later.");
                    $("#login_messages").css({"color":"#f5eb28"});
                    $("#gray_panel").attr("onclick","callend()");
                    window.onbeforeunload = null;
                } else if (data.stat == "du") {
                    $("#login_messages").html("This address has been already used. Try another one.");
                    $("#login_messages").css({"color":"#f5eb28"});
                    $("#gray_panel").attr("onclick","callend()");
                    window.onbeforeunload = null;
                }
            }
        });
    }
}

function getCurrentAddress() {
    $.ajax({
        type: 'POST',
        url: '/login/getcurrent',
        success: function(data) {
            if (data.stat != "err") { 
                var mes = $("#login_messages").html();
                $("#login_messages").html(mes + "Current address : " + data.first + "…@" + data.second + "…" );
            }
        }
    });
}