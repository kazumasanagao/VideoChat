var firstRowHTML,secondRowHTML,hislanguage,busymessage,logoutmessage,noroommessage,itsme,samecountry,nevertalkedyet,whiteBlankHTML;
var candidate_name, candidate_country; // openTalk画面の上部に表示する用

function makeHTML(personI) {
    if (typeof personI == "number") {
        var image = image_url + info[personI].id + ".jpeg";
        var nickname = info[personI].nickname;
        candidate_name = nickname; // automatchのときはsignalingサーバから受け取っている
        var country_raw = info[personI].country;
        var country = countryMap[country_raw];
        candidate_country = country;
        var shortBio = info[personI].shortBio;
        var longBio = info[personI].longBio;
        var gender = info[personI].gender;
        var languages_raw = info[personI].languages;
        var languages = [];
        if (languages_raw) {
            for (var i = 0; i < languages_raw.length; i++) {
                languages.push(languagesMap[languages_raw[i]]);
            }
        }
    } else {
        var image = image_url + personI.id + ".jpeg";
        var nickname = personI.nickname;
        candidate_name = nickname;
        var country_raw = personI.country;
        var country = countryMap[country_raw];
        candidate_country = country;
        var shortBio = personI.shortBio;
        var longBio = personI.longBio;
        var gender = personI.gender;
        var languages_raw = personI.languages;
        var languages = [];
        if (languages_raw) {
            for (var i = 0; i < languages_raw.length; i++) {
                languages.push(languagesMap[languages_raw[i]]);
            }
        }
    }

    firstRowHTML = '' +
        '<div id="row1" class="green">' +
            '<img src="'+ image +'" width="80" height="80" alt="face">' +
            '<div class="called_intro">' +
                '<div class="called_intro_top yellow_font">' +
                    '<span class="called_nickname">'+ nickname +'</span>' +
                    '&nbsp;/&nbsp;' +
                    '<span class="called_nation">'+ country +'</span>' +
                '</div>' +
                '<div class="called_intro_bottom">' +
                    '<span class="called_short_intro">'+ shortBio +'</span>' +
                '</div>' +
            '</div>' +
        '</div>';

     secondRowHTML = '' +   
        '<div id="row2" class="blue">' +
            '<span id="longbio">'+ longBio +'</span>' +
        '</div>';

    var subject;
    if (gender == "fe") {
        subject = 'She';
    } else {
        subject = 'He';
    }
    var langs = "";
    for (var i = 0; i < languages.length; i++) {
        if (i == languages.length - 2) {
            langs += languages[i] + " and ";
        } else if (i == languages.length - 1) {
            langs += languages[i] + ".";
        } else {
            langs += languages[i] + ", ";
        }
        
    }
    hislanguage = subject + ' speaks ' + langs;
    busymessage = subject + ' is busy now.';
    logoutmessage = subject + ' is logout now.';
    noroommessage = subject + ' is out of room now.';
    itsme = "It's me !";
    samecountry = "Same country";
    nevertalkedyet = "Never talked yet.";
    whiteBlankHTML = '<div class="white_blank"></div>';
}