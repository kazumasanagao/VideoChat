var isMobile = false;
if ($(window).width() < 450) {
    if (document.getElementById("firstcss")) {
        document.getElementById("firstcss").href = "../stylesheets/first_mob.css";
    }
    if (document.getElementById("logincss")) {
        document.getElementById("logincss").href = "../stylesheets/login_mob.css";
    }
    isMobile = true;
}

if ($("#islogin").html() == "true") {
    $('#login').html("Logout");
    $('#login').click(onLogoutButtonClick);
} else {
    $("#login").hover(
        function () { $("#noneedpass").css({"display":"block"}); },
        function () { $("#noneedpass").css({"display":"none"}); }
    );
    $('#login').click(onLoginButtonClick); 
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

function opencontact() {
    if ($("#islogin").html() == "true") {
        location.href = "/faq?q=openchat";
    } else {
        $("#gray_panel").fadeIn();
        $(document.body).append(contactHTML);
    }
}

function closepanel() {
    $("#gray_panel").fadeOut();
    $("#contact_container").remove();
    $("#login_container").remove();
}

var contactHTML = '' +
'<div id="contact_container">' +
    '<div class="contact_titles">If you have Account</div>' +
    '<div class="contact_contents">Please log in first, and click "Contact Us" again.</div>' +
    '<div class="contact_titles">If you don\'t have Account</div>' +
    '<div class="contact_contents">Please email us. ( <a href="mailto:contact@chample.in" style="color:white;">contact@chample.in</a> )</div>' +
'</div>';

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
                '<input id="emailform" style="width:115px;" placeholder="abc@gmail.com"></input>' +
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

function loginwithemail() {
    $("#login_zero_row").fadeOut(function() {
        $("#login_first_row").fadeIn();
        $("#login_messages").fadeIn();
    });
    
}

var currentscreen = 1;
var stopswitch = false;
function joinchample() {
    if ($("#islogin").html() != "true") {
        closepanel();
        onLoginButtonClick();
    }
}
setTimeout(function() {
    if (!stopswitch) {
        switchScreen();
    }
}, 8000);
function switchScreen() {
    if (currentscreen == 1) {
        $("#screen1").fadeOut("normal", function() {
            $(".large_mes,.firstline,.secondline,.joinchamplebutton,.moredetailsbutton").css({"display":"none"});
            $("#screen2").fadeIn(function(){
                popup();
            });
        });
        currentscreen = 2;
    } else if (currentscreen == 2) {
        $("#screen2").fadeOut(function() {
            $(".large_mes,.firstline,.secondline,.joinchamplebutton,.moredetailsbutton").css({"display":"none"});
            $("#screen3").fadeIn(function(){
                popup();
            });
        });
        currentscreen = 3;
    } else if (currentscreen == 3){
        $("#screen3").fadeOut(function() {
            $(".large_mes,.firstline,.secondline,.joinchamplebutton,.moredetailsbutton").css({"display":"none"});
            $("#screen1").fadeIn(function(){
                popup();
            });
        });
        currentscreen = 1;
    }
    setTimeout(function() {
        if (!stopswitch) {
            switchScreen();
        }
    }, 8000);
}

popup();
function popup() {
    var num = currentscreen - 1;
    setTimeout(function(){
        if (!stopswitch) {
            $(".large_mes:eq("+num+")").fadeIn();
        }
    },200);
    setTimeout(function(){
        if (!stopswitch) {
            $(".firstline:eq("+num+")").fadeIn();
        }
    },1000);
    setTimeout(function(){
        if (currentscreen != 3) {
            if (!stopswitch) {
                $(".secondline:eq("+num+")").fadeIn();
            }
        }
    },2500);
    setTimeout(function(){
        if (!stopswitch) {
            $(".joinchamplebutton:eq("+num+")").fadeIn();
            $(".moredetailsbutton:eq("+num+")").fadeIn();
        }
    },4000);
}
function opendetails() {
    var num = currentscreen - 1;
    stopswitch = true;
    $(".large_mes,.firstline,.secondline,.joinchamplebutton,.moredetailsbutton").fadeOut(function() {
        $(".moredetails:eq("+num+")").fadeIn();
        $(".backbutton:eq("+num+")").fadeIn();
    });
}
function backtofront() {
    var num = currentscreen - 1;
    $(".moredetails:eq("+num+")").fadeOut();
    $(".backbutton:eq("+num+")").fadeOut();
    stopswitch = false;
    switchScreen();
}