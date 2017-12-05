var conf = require('./conf.js');

function makeQuery(language, gender, region, country, freeword, userlangs, loginnow) {
    if (language == "") {
        language = userlangs;
    } else if (language == "al") { // 全言語の時はクエリ必要なし
        language = "";
    } else if (conf.languages[language] != 1) {
        language = "";
    } else {
        langs = [];
        langs.push(language);
        language = langs;
    }
    if (gender != "fe" && gender != "ma") {
        gender = "";
    }
    if (country) {
        region = "";
        if (conf.countries[country] != 1) {
            country = "";
        } else {
            country = [country];
        }
    }
    if (conf.regions[region] != 1) {
        region = "";
    } else {
        country = conf.regionMap[region];
    }
    var regexps = []; 
    if (typeof freeword !== 'string') {
        freeword = "";
    } else {
        freeword = freeword.replace(/[^a-zA-Z0-9\s]/g,"");
        var freewords = freeword.split(" ");
        if (freewords.length > 0) {
            for (i = 0; i < freewords.length; i++) {
                if (freewords[i]) {
                    regexps.push({nickname: new RegExp(freewords[i], 'i')});
                    regexps.push({shortBio: new RegExp(freewords[i], 'i')});
                    regexps.push({longBio: new RegExp(freewords[i], 'i')});
                }
            }
        }
    }

    var query = {};

    if (language) {
        query.languages = {$in:language};
    }
    if (gender) {
        query.gender = gender;
    }
    if (country) {
        query.country = {$in:country};
    }
    if (regexps.length > 0) {
        query.$or = regexps;
    }
    if (loginnow) {
        query.loginflag = {$in:[1,2]};
    }

    query.nickname = {$ne:null}; // 名前がないユーザーは表示しない

    return query;
}

module.exports = {
    makeQuery: makeQuery
}