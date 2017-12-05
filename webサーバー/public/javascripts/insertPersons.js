// 表示元のページ名を取得。Ajaxでgetするデータを場合分けするため。
/*
var dirArray = location.href.split("/"); 
var page_name = dirArray[dirArray.length -1];
if (!page_name) {
    page_name = "history";
}
*/

var info = [];
var stars = [];
var blocks = [];
var totalPage;
var currentPage = 1;
var personInPage,totalPage,startPoint,personInThisPage,colors;
var onclickfn;
function initdata() {
    //各種パラメーターの初期化
    totalPerson = info.length;
    
    if (page_name == "chat") {
        onclickfn = "openChat";
    } else {
        onclickfn = "openPersonInfo";
    }

    personInPage = 15;
    totalPage = Math.ceil(totalPerson / personInPage);

    if (personInPage == 15) {
        colors = ["green","blue","pink","blue","pink","green","pink","green","blue","green","blue","pink","blue","pink","green"];
    }
}

load();
var latestPref = {}; // realtimeでinしてきたときに、この条件と合致しているかチェックする
var userlangs = []; // realtimeでinしてきたときのlatestPrefが""だったときにこれを参照する
function load() {
    var language = $("#language").val();
    var gender = $("#gender").val();
    var region = $("#region").val();
    var country = $("#country").val();
    var freeword = $("#freeword").val();
    var always = $("[name=always]:checked").val();
    var loginnow_raw = $("[name=loginnow]:checked").val();
    var loginnow = loginnow_raw == "true" ? true : false;
    var starred_raw = $("[name=starred]:checked").val();
    var starred = starred_raw == "true" ? true : false;
    var blocking_raw = $("[name=blocking]:checked").val();
    var blocking = blocking_raw == "true" ? true : false;

    if (country) { region = ""; }
    if (always == "true") {
        var star_str = "";
        if (starred) star_str = ",star:true";
        var cookie = 'pref=language:'+ language +",gender:"+ gender + ",region:"+ region +",country:"+ country +",freeword:"+ freeword + star_str + ';max-age=604800;' + cookieSecure;
        document.cookie = cookie;
    } else if (page_name == "room") { //room画面でalwaysがチェックされていないときはcookieを消す
        document.cookie = "pref=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    var data = {language: language, gender: gender, region: region, country: country, freeword: freeword, loginnow: loginnow, starred: starred, blocking: blocking};
    latestPref = data;
    getInfoFromServer(data);
}

function getInfoFromServer(q) {
    $.ajax({
        url: '/' + page_name,
        type: 'POST',
        success: function(data) {
            if (!data.err) {
                info = data.info;
                stars = data.stars;
                blocks = data.block;
                userlangs = data.userlangs;
                initdata();
                setPersons(1);
            }
        },
        data: q,
        dataType: 'json'
    });
}

$("#reload").click(function() {
    load();
});

// sendSignal.jsより呼出
function realtimeLoad(person, isin) {
    // isinがtrueならIn,falseならOut
    if (isin) {
        var qflag = true;
        if (!person.nickname) {
            qflag = false;
        } 
        if (latestPref.language && latestPref.language != "al") {
            var lflag = false;
            for (var i = 0; i < latestPref.language.length; i++) {
                for (var j = 0; j < person.languages.length; j++) {
                    if (latestPref.language[i] == person.languages[j]) {
                        lflag = true;
                        break;
                    }
                }
                if (lflag) { break; }
            }
            if (!lflag) {
                qflag = false;
            }
        } else if (!latestPref.language) {
            var lflag = false;
            for (var i = 0; i < userlangs.length; i++) {
                for (var j = 0; j < person.languages.length; j++) {
                    if (userlangs[i] == person.languages[j]) {
                        lflag = true;
                        break;
                    }
                }
                if (lflag) { break; }
            }
            if (!lflag) {
                qflag = false;
            }
        }
        if (qflag && latestPref.gender) {
            if (latestPref.gender != person.gender) {
                qflag = false;
            }
        }
        if (qflag && latestPref.region) {
            var regions = regionMap[latestPref.region];
            var cflag = false;
            for (var i = 0; i < regions.length; i++) {
                if (regions[i] == person.country) {
                    cflag = true;
                    break;
                }
            }
            if (!cflag) {
                qflag = false;
            }
        }
        if (qflag && latestPref.country) {
            if (latestPref.country != person.country) {
                qflag = false;
            }
        }
        if (qflag && latestPref.freeword) {
            var fflag = false;
            var sbio = person.shortBio;
            var lbio = person.longBio;
            if (sbio.indexOf(latestPref.freeword) != -1) {
                fflag = true;
            } else if (lbio.indexOf(latestPref.freeword) != -1) {
                fflag = true;
            }
            if (!fflag) {
                qflag = false;
            }
        }
        if (qflag && latestPref.starred) {
            if (stars.indexOf(person.id) == -1) {
                qflag = false;
            }
        }
        if (qflag) {
            info.push(person);
        }
    } else {
        for (var i = 0; i < info.length; i++) {
            if(person.id == info[i].id) {
                info.splice(i,1);
                break;
            }
        }
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

function setPersons(page) {
    currentPage = page;
    //前回表示をクリア
    $("#person_list").html("");
    // ループの前に始点と長さを確認
    startPoint = personInPage * (currentPage - 1);
    if (currentPage < totalPage) {
        personInThisPage = personInPage;
    } else {
        personInThisPage = totalPerson - startPoint;
    }
    // ループ！
    for (var i = 0; i < personInThisPage; i++) {
        var iCurrent = startPoint + i
        var image = image_url + info[iCurrent].id + ".jpeg";
        var name = info[iCurrent].nickname;
        var country_row = info[iCurrent].country;
        var country = countryMap[country_row];
        var bio = info[iCurrent].shortBio; 
        var intro = "";
        switch (page_name) {
            case "room":
                intro = bio;
                break;
            case "chat":
                var rawdate = info[iCurrent].last.time;
                var chatdate = dateFormat(rawdate);
                var lastchat = info[iCurrent].last.text;
                var isread = info[iCurrent].read;
                intro = chatdate + "<br/>" + lastchat;
                if (isread) {
                    intro = '<span id="newmes'+iCurrent+'" class="newmes" style="display:none;">new</span> ' + intro;
                } else {
                    intro = '<span id="newmes'+iCurrent+'" class="newmes">new</span> ' + intro; 
                }
                break;
            case "history":
                var rawdate = info[iCurrent].historyTi;
                var videodate = "";
                if (rawdate) {
                    videodate = dateFormat(rawdate);
                }
                if (stars.indexOf(info[iCurrent].id) == -1) {
                    intro = videodate + '<br/><span class="star_history" onclick="star('+"'"+info[iCurrent].id+"'"+','+iCurrent+')"><img src="../images/nostar.png" width="20" height="20"></span>';
                } else {
                    intro = videodate + '<br/><span class="star_history" onclick="star('+"'"+info[iCurrent].id+"'"+','+iCurrent+')"><img src="../images/starred.png" width="20" height="20"></span>';
                }
                intro = intro + '<span class="reportbutton" onclick="report(null,'+iCurrent+')"> ・ Report</span>';
                if (blocks.indexOf(info[iCurrent].id) == -1) {
                    intro = intro + '<span class="blockbutton" onclick="block('+"'"+info[iCurrent].id+"'"+','+iCurrent+')">Block</span>';
                } else {
                    intro = intro + '<span class="blockbutton" onclick="block('+"'"+info[iCurrent].id+"'"+','+iCurrent+')">Unblock</span>';
                }
                break;
            default:
                intro = bio;
        }

        var classes = "persons ";
        classes += colors[i] + " ";
        if (i % 3 == 0) {
            classes += "first_column"
        }
        $("#person_list").append('' +
            '<div class="'+ classes +'" onclick="'+ onclickfn + '(' + iCurrent + ');">' +
                '<img src="'+ image +'" width="80" height="80" alt="'+ name +'">' +
                '<div class="intro">' +
                    '<div class="intro_top yellow_font"><span class="nickname">'+ name +'</span>&nbsp;/&nbsp;<span class="nation">'+ country +'</span></div>' +
                    '<div class="intro_bottom"><span class="short_intro">'+ intro +'</span></div>' +
                '</div>' +
            '</div>');
    }
    // スペース余ったらブランクを挿入
    if ((personInPage - personInThisPage) % 3 == 1) {
        $("#person_list").append('<div id="blank1" class="lightgray"></div>');
    } else if ((personInPage - personInThisPage) % 3 == 2) {
        $("#person_list").append('<div id="blank2" class="lightgray"></div>');
    }
    // ページバーの作成
    makePageBar();

    // 写真が無い or ロードに失敗した時はうさぎの画像を挿入
    $('img').error(function(){
        $(this).attr('src', makeRapidsUrl()); // conf.jsより
    });
}

var starflag = false; // personInfoが開くのを防ぐ
function star(id, iCurrent) {
    starflag = true;
    $.ajax({
        url: '/history/star',
        type: 'POST',
        success: function(data) {
            if (iCurrent != null) { // history画面の中のとき
                if (iCurrent >= 0) {
                    if (data.res == "add") {
                        $(".star_history").eq(iCurrent).html("<img src='../images/starred.png' width='20' height='20'>");
                    } else if (data.res == "del") {
                        $(".star_history").eq(iCurrent).html("<img src='../images/nostar.png' width='20' height='20'>");
                    }
                }
            } else { // talk画面の中のときはiCurrentをnullにする
                if (data.res == "add") {
                    $(".star_talk").html("<img src='../images/starred.png' width='20' height='20'>");
                } else if (data.res == "del") {
                    $(".star_talk").html("<img src='../images/nostar.png' width='20' height='20'>");
                }
            }
        },
        complete: function() {
            starflag = false;
        },
        data: {id: id},
        dataType: 'json'
    });
}

function block(id, iCurrent) {
    starflag = true;
    $.ajax({
        url: '/history/block',
        type: 'POST',
        success: function(data) {
            if (iCurrent != null) { // history画面の中のとき
                if (iCurrent >= 0) {
                    if (data.res == "released") {
                        $(".blockbutton").eq(iCurrent).html("Block");
                    } else if (data.res == "blocked") {
                        $(".blockbutton").eq(iCurrent).html("Unblock");
                    }
                }
            } else { // talk画面の中のときはiCurrentをnullにする
                if (data.res == "released") {
                    $(".blockbutton_talk").html("Block");
                } else if (data.res == "blocked") {
                    $(".blockbutton_talk").html("Unblock");
                }
            }
        },
        complete: function() {
            starflag = false;
        },
        data: {id: id},
        dataType: 'json'
    });
}

function report(id, iCurrent) {
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
function sendReport(id) {
    var val = $("[name=report]:checked").val();
    $.ajax({
        url: '/history/report',
        type: 'POST',
        success: function(data) {
            if (data.stat == "ok") {
                toast("Successfully sent.");
            } else {
                toast("Error. Try again later.");
            }
        },
        data: {id: id, val: val},
        dataType: 'json'
    });
}

function makePageBar() {
    var maxleft,maxright;
    if (currentPage == 1) {maxleft = 0; maxright = 4;}
    else if (currentPage == 2) {maxleft = 1; maxright = 3;}
    else {maxleft = 2; maxright = 2;}
    if (currentPage == totalPage) {maxright = 0; maxleft = 4;}
    else if (currentPage == totalPage -1) {maxright = 1; maxleft = 3;}
    else {maxright: 2; maxleft: 2;}

    var center_html = "";
    var firstpage_html = "";
    var lastpage_html = "";

    var lowest_page = currentPage;
    var lowest_flag = true; // 一回目にパスしたcandidateを拾うために設定
    for (var i = maxleft; i > 0; i--) {
        var candidate = currentPage - i;
        if (candidate > 0) {
            center_html += '<span class="page clickable" onclick="setPersons('+ candidate +');">'+ candidate +'</span>';
            if (lowest_flag) {
                lowest_page = candidate;
                lowest_flag = false; // 二回目以降はスルー
            }
        }
    }
    if (lowest_page >= 3) {
        firstpage_html = '<span class="page clickable" onclick="setPersons(1);">1</span><span class="page unclickable ultra_deepgray_font">...</span>'
    } else if (lowest_page == 2) {
        firstpage_html = '<span class="page clickable" onclick="setPersons(1);">1</span>'
    }

    center_html += '<span class="page unclickable ultra_deepgray_font" onclick="setPersons('+ currentPage +');">'+ currentPage +'</span>';

    var highest_page = currentPage;
    for (var i = 1; i <= maxright; i++) {
        var candidate = currentPage + i;
        if (candidate <= totalPage) {
            center_html += '<span class="page clickable" onclick="setPersons('+ candidate +');">'+ candidate +'</span>';
            highest_page = candidate;
        }
    }
    if (highest_page <= totalPage - 2) {
        lastpage_html = '<span class="page unclickable ultra_deepgray_font">...</span><span class="page clickable" onclick="setPersons('+totalPage.toString()+');">'+totalPage.toString()+'</span>'
    } else if (highest_page == totalPage - 1) {
        lastpage_html = '<span class="page clickable" onclick="setPersons('+totalPage.toString()+');">'+totalPage.toString()+'</span>'
    }

    var prev_html = "";
    if (currentPage == 1) {
        prev_html = '<span id="prev" class="unclickable ultra_deepgray_font">← Prev</span>';
    } else {
        prev_html = '<span id="prev" class="clickable" onclick="setPersons('+ (currentPage-1).toString() +');">← Prev</span>';
    }

    var next_html = "";
    if (currentPage == totalPage || totalPage == 0) {
        next_html = '<span id="next" class="unclickable ultra_deepgray_font">Next →</span>';
    } else {
        next_html = '<span id="next" class="clickable" onclick="setPersons('+ (currentPage+1).toString() +');">Next →</span>';
    }

    $("#pageBar").html(prev_html + firstpage_html + center_html + lastpage_html + next_html);
}