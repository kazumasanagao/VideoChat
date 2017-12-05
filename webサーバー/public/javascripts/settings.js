var isSettings = true;
function noSettings() {
    isSettings = false;
    $(document.body).append(policyHTML);
    $('#policy_message').html(termsMessage);
    $("#gray_panel").fadeIn("fast");
    $("#gray_panel").removeAttr("onclick");
    window.onbeforeunload = function() {
        disagreepolicy();
    }
} 

function getSettings() {
    $.ajax({
        url: '/settings',
        type: 'POST',
        success: function(data) {
            initsettings(data);
        }
    });
}

var nickname,shortBio,longBio,country,languages,gender,keeplogin,fbphoto,fb_or_mail;
function initsettings(data) {
    nickname = data.nickname ? data.nickname : "";
    shortBio = data.shortBio ? data.shortBio : "";
    longBio = data.longBio ? data.longBio : ""; 
    country = data.country ? data.country : "";
    languages = data.languages ? data.languages : [];
    gender = data.gender ? data.gender : "";
    keeplogin = data.keeplogin ? data.shortBio : false;
    fbphoto = data.fbphoto ? data.fbphoto : "";
    fb_or_mail = data.fb_or_mail ? data.fb_or_mail : "";
    openSettings();
    textCount();
}

function openSettings() {
    var settingsHTML = "" +
        '<div id="settings_container">' +
        '<div id="se_row1" class="se_rows green">' +
            '<div id="photo_flame">' +
            '<canvas id="image_preview" width="80" height="80"></canvas>' +
            '<div class="file">' +
                '<input type="file" id="inputFile" accept=".png,.jpg,.jpeg" onchange="preview(this)" />' +
            '</div>' +
            '</div>' +
            '<div class="se_intro">' +
                '<div class="se_intro_top yellow_font">' +
                    '<input id="nickname_input" name="nickname" class="green" placeholder="Nickname" maxlength="12" value='+ nickname +'>&nbsp;/&nbsp;' +
                    '<select id="country_select" name="country" class="green" required></select>' +
                '</div>' +
                '<div class="se_intro_bottom">' +

                    '<textarea id="textarea0" name="shortBio" class="green" rows="2" cols="40" maxlength="60" placeholder="Short Biography">'+ shortBio +'</textarea>' +
                    '<span id="textcounter0"></span>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="se_white_blank"></div>' +
        
        '<div id="se_row2" class="se_rows blue">' +
            '<textarea id="textarea1" name="longBio" class="blue" rows="4" cols="40" maxlength="160" placeholder="Long Biography">'+ longBio +'</textarea>' +
            '<span id="textcounter1"></span>' +
        '</div>' +
        '<div class="se_white_blank"></div>' +

        '<div id="se_row3" class="se_rows pink">' +
            '<div id="ispeak">I can speak...</div>' +
            '<div id="checkboxes">' +
                '<input type="checkbox" name="languages" id="en" value="en"><label for="en" class="se_labels">English</label>' +
                '<input type="checkbox" name="languages" id="ar" value="ar"><label for="ar" class="se_labels">Arabic</label>' +
                '<input type="checkbox" name="languages" id="zh" value="zh"><label for="zh" class="se_labels">Chinese</label>' +
                '<input type="checkbox" name="languages" id="fr" value="fr"><label for="fr" class="se_labels">French</label><br/>' +
                '<input type="checkbox" name="languages" id="de" value="de"><label for="de" class="se_labels">German</label>' +
                '<input type="checkbox" name="languages" id="hi" value="hi"><label for="hi" class="se_labels">Hindi</label>' +
                '<input type="checkbox" name="languages" id="ja" value="ja"><label for="ja" class="se_labels">Japanese</label>' +
                '<input type="checkbox" name="languages" id="pt" value="pt"><label for="pt" class="se_labels">Portuguese</label><br/>' +
                '<input type="checkbox" name="languages" id="ru" value="ru"><label for="ru" class="se_labels">Russian</label>' +
                '<input type="checkbox" name="languages" id="es" value="es"><label for="es" class="se_labels">Spanish</label>' +
            '</div>' +
        '</div>' +
        '<div class="se_white_blank"></div>' +

        '<div id="se_row4" class="se_rows green">' +
            '<span id="se_gender">Gender</span>' +
            '<input type="radio" name="gender" id="fe" value="fe" checked="checked"><label for="fe" class="genderText">Female</label>' +
            '<input type="radio" name="gender" id="ma" value="ma"><label for="ma" class="genderText">Male</label>' +
            '<br/>' +
            '<span id="se_keeplogin">Keep Login</span>' +
            '<input type="checkbox" name="keeplogin" value="true">' +
        '</div>' +
        '<div class="white_blank"></div>' +

        '<div id="se_row5" class="se_rows blue">' +
            '<span id="connect_email" onclick="changeaddress('+"'"+'true'+"'"+')">Connect with Email</span>' +
            '<span id="connect_email_disc">If you register Email address, you also can login by Email.</span>' +
            '<span id="connect_fb" onclick="connectWithFacebook()">Connect with Facebook</span>' +
            '<span id="connect_fb_disc">If you register Facebook account, you also can login by Facebook.</span>' +
        '</div>' +
        '<div id="se_row5_white_blank" class="white_blank"></div>' +

        '<input type="submit" onclick="return save();" id="save_button" class="yellow deepgray_font" value="Save"/>' +
        '<div id="underbar"><span id="changenumber" onclick="changeaddress()">Change Email Address</span><span id="deleteaccount" onclick="deleteaccount()">Delete Account</span></div>' +

        '<div id="toast"></div>' +

        '<canvas id="fbphoto" style="display:none;" width="80" height="80">' +
        '</div>';
        $(document.body).append(settingsHTML);
        $("#gray_panel").fadeIn("fast");
        if (fbphoto) {
           loadImage(fbphoto); 
        } else {
            loadImage();
        }

        var first = '<option value="">Country</option> +'
        $("#country_select").html(first + countriesHTML);

        if (country.length == 2) {
            $('#country_select option[value='+ country +']').attr("selected","selected");
        }

        if (languages.length == 0) {
            $('#en').attr("checked","checked");
        } else if (languages.length > 0) {
            for (var i = 0; i < languages.length; i++) {
                $('#' + languages[i]).attr("checked","checked");
            }
        }

        $('#' + gender).attr("checked","checked");

        if (keeplogin) {
            $('input[name="keeplogin"]').attr("checked","checked");
        }

        // まだsettingsがない場合の処理
        if (!isSettings) {
            toast("Please input your info.");
            $("#gray_panel").removeAttr("onclick");
            $("#underbar").css({"display":"none"});
        }

        if (fb_or_mail == "fb") {
            $("#se_row5").css({"display":"block"});
            $("#connect_email").css({"display":"inline-block"});
            $("#connect_email_disc").css({"display":"inline-block"});
            $("#se_row5_white_blank").css({"display":"block"});
            $("#changenumber").css({"display":"none"});
        } else if (fb_or_mail == "mail") {
            $("#se_row5").css({"display":"block"});
            $("#connect_fb").css({"display":"inline-block"});
            $("#connect_fb_disc").css({"display":"inline-block"});
            $("#se_row5_white_blank").css({"display":"block"});
        }
        
}

function save() {
    var isError = false;
    var errorMes = "\n";

    var nickname = $("#nickname_input").val();
    var country = $("#country_select").val();
    var shortBio = $("#textarea0").val();
    var longBio = $("#textarea1").val();
    var langs = [];
    $("[name=languages]:checked").each(function() {
        langs.push($(this).val());
    });
    var languages = langs.toString();
    var gender = $("[name=gender]:checked").val();
    var keeplogin = $("[name=keeplogin]:checked").val();
    if (keeplogin) {
        keeplogin = true;
    } else {
        keeplogin = false;
    }
    var isPhoto = $('#inputFile')[0].files[0];
    if (isPhoto || fbphoto) {
        isPhoto = true;
    } else {
        isPhoto = false;
    }

    if (!nickname) {
        isError = true;
        errorMes += "Please write your nickname.\n"
    }
    if (!country) {
        isError = true;
        errorMes += "Please select your country.\n"
    }
    if (!shortBio) {
        isError = true;
        errorMes += "Please write your short biograpy.\n"
    }
    if (langs.length == 0) {
        isError = true;
        errorMes += "Please select at least one language.\n"
    }
    if(!nickname.match(/^[a-zA-z¥s]+$/)){
        isError = true;
        errorMes += "Please use only alfabets in your nickname.\n"
    }

    if (isError) {
        alert(errorMes);
    } else {
        var data = {
            nickname: nickname,
            country: country,
            shortBio: shortBio,
            longBio: longBio,
            languages: languages,
            gender: gender,
            keeplogin: keeplogin,
            isPhoto: isPhoto
        };

        if (isPhoto) {
            var canvasData = img.src;
            canvasData = canvasData.replace(/^data:image\/jpeg;base64,/, '');
            data.photo = canvasData;
        }

        $.ajax({
            url: '/settings/save',
            type: 'POST',
            success: function(data) {
                if (data.stat == "ok") {
                    toast("Successfully saved!");
                    if (keeplogin) {
                        extendCookies();
                        document.cookie = "extends=yes;max-age=604800;" + cookieSecure;
                        if (country) { document.cookie = "myco="+country+";max-age=604800;" + cookieSecure; }
                    } else {
                        shortenCookies();
                        document.cookie = "extends=no;";
                        if (country) { document.cookie = "myco="+country+";" + cookieSecure; }
                    }
                    if (!isSettings) {
                        isSettings = true;
                        $("#gray_panel").attr("onclick", "callend();");
                        location.href = "/room";
                    }
                } else {
                    toast("Error. Please try later.");
                }
            },
            error: function() {
                toast("Error. Please try later.");
            },
            data: data,
            dataType: 'json'
        });
    }
    return false;
}

function changeaddress(isConnect) {
    callend();
    var isconnect;
    var logintitle = "Change Email Address";
    var loginemail = '<span id="login_email" style="position:relative;font-size:14px;top:5px;">New<br />&nbsp;Address</span>'
    if (isConnect) {
        isconnect = "'"+'true'+"'";
        logintitle = "Register Email Address";
        loginemail = '<span id="login_email">Email</span>'
    }
    var loginHTML = "" +
        '<div id="login_container">' +
            '<div id="login_title">'+logintitle+'</div>' +
            '<div id="login_first_row">' +
                loginemail +
                '<input id="emailform" placeholder="abc@gmail.com"></input>' +
                '<span onclick="getTokenCh()" class="login_buttons">Get Token</span>' +
            '</div>' +
            '<div id="login_second_row">' +
                '<span id="login_token">Token</span>' +
                '<input id="tokeninput" placeholder="1234567"></input>' +
                '<span onclick="sendTokenCh('+isconnect+')" class="login_buttons">Continue</span>' +
            '</div>' +
            '<div id="login_messages">We\'ll send a token to your Email address.<br /></div>' +
        '</div>';
    $("#gray_panel").fadeIn();
    $(document.body).append(loginHTML);
    getCurrentAddress();
}

function deleteaccount() {
    var mes = "Are you sure to delete this account ?\nAll of the data will be deleted.";
    var mes2 = "We ask you again.\nAre you sure to delete this account?";
    if (confirm(mes)) {
        if (confirm(mes2)) {
            $.ajax({
                url: '/settings/delete',
                type: 'POST',
                success: function(data) {
                    if (data.stat == "ok") {
                        document.cookie = "num=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        document.cookie = "pref=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        document.cookie = "myco=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        document.cookie = "extends=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        location.href = "/";
                    } else {
                        toast("Error. Please try later.");
                    }
                }
            });
        }
    }
}

function toast(mes) {
    var message = mes;
    $("#toast").html(message);
    $("#toast").fadeIn(1000, function() {
        setTimeout(function() {
            $("#toast").fadeOut(1000);
        },2000);
    });
}

function textCount() {
    var textarea0 = document.getElementById('textarea0');
    var textcounter0 = document.getElementById('textcounter0');
    const max_length0 = 60;

    var textarea1 = document.getElementById('textarea1');
    var textcounter1 = document.getElementById('textcounter1');
    const max_length1 = 160;

    textcounter0.innerHTML = max_length0 - calcByte(textarea0.value);

    textarea0.addEventListener('keydown', function (e){
        var bytes = calcByte(textarea0.value);
        var maxlength = max_length0 - (bytes - textarea0.value.length); 
        textcounter0.innerHTML = max_length0 - bytes;
        $("#textarea0").attr("maxlength", maxlength);
    }, false);
    textarea0.addEventListener('keyup', function (e){
        var bytes = calcByte(textarea0.value);
        var maxlength = max_length0 - (bytes - textarea0.value.length);
        textcounter0.innerHTML = max_length0 - bytes;
        $("#textarea0").attr("maxlength", maxlength);
    }, false);


    textcounter1.innerHTML = max_length1 - calcByte(textarea1.value);

    textarea1.addEventListener('keydown', function (e){
        var bytes = calcByte(textarea1.value);
        var maxlength = max_length1 - (bytes - textarea1.value.length);
        textcounter1.innerHTML = max_length1 - bytes;
        $("#textarea1").attr("maxlength", maxlength);
    }, false);
    textarea1.addEventListener('keyup', function (e){
        var bytes = calcByte(textarea1.value);
        var maxlength = max_length1 - (bytes - textarea1.value.length);
        textcounter1.innerHTML = max_length1 - bytes;
        $("#textarea1").attr("maxlength", maxlength);
    }, false);
}

// 文字の画面上での大きさをコントロールしたいためなので、３バイト文字も２バイトとしている。
function calcByte(text) {
    var bytes = 0;
    var len = text.length;
    for(var i = 0;i < len; i++){
        c = text[i].charCodeAt(0)
        if (c <= 127){
            bytes += 1;
        } else {
            bytes += 2;
        }
    }
    return bytes;
};
