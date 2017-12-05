function getCookie(name) {
    var result = null;
    var cookieName = name + '=';
    var allcookies = document.cookie;
    var position = allcookies.indexOf( cookieName );
    if(position != -1) {
        var startIndex = position + cookieName.length;
        var endIndex = allcookies.indexOf( ';', startIndex );
        if(endIndex == -1) {
            endIndex = allcookies.length;
        }
        result = decodeURIComponent(
            allcookies.substring(startIndex, endIndex));
    }
    return result;
}
// cookieの期限を更新。
function refreshCookies() {
    isExtendsCookie();
    isCountryCookie();
    isNumCookie();
    if (getCookie('extends') == "yes") {
        extendCookies();
    } else if (getCookie('extends') == "no") {
        shortenCookies();
    }
}
function extendCookies() {
    var id = getCookie('id');
    if (id) {
        document.cookie = "id=" + id + ";max-age=604800;" + cookieSecure;
    }
    var num = getCookie('num');
    if (num) {
        document.cookie = "num="+ num + ";max-age=604800;" + cookieSecure;
    }
    var pref = getCookie('pref');
    if (pref) {
        document.cookie = "pref="+ pref + ";max-age=604800;" + cookieSecure;
    }
    var myco = getCookie('myco');
    if (myco) {
        document.cookie = "myco="+ myco + ";max-age=604800;" + cookieSecure;
    }
    var extend = getCookie('extends');
    if (extend) {
        document.cookie = "extends="+ extend + ";max-age=604800;" + cookieSecure;
    }
}
function shortenCookies() {
    var id = getCookie('id');
    if (id) {
        document.cookie = "id=" + id + ";" + cookieSecure;
    }
    var num = getCookie('num');
    if (num) {
        document.cookie = "num="+ num + ";" + cookieSecure;
    }
    var pref = getCookie('pref');
    if (pref) {
        document.cookie = "pref="+ pref + ";" + cookieSecure;
    }
    var myco = getCookie('myco');
    if (myco) {
        document.cookie = "myco="+ myco + ";" + cookieSecure;
    }
    var extend = getCookie('extends');
    if (extend) {
        document.cookie = "extends="+ extend + ";" + cookieSecure;
    }
}
// extendsのクッキーがあるか確認。なければサーバーから取得する。
function isExtendsCookie() {
    if (!getCookie('extends')) {
        $.ajax({
            url: '/settings/keeplogin',
            type: 'POST',
            success: function(data) {
                if (data.keeplogin) {
                    setExtendsCookie(data.keeplogin);
                }
            }
        });
    } 
}
function setExtendsCookie(keeplogin) {
    if (keeplogin) {
        document.cookie = "extends=yes;max-age=604800;" + cookieSecure;
    } else {
        document.cookie = "extends=no;" + cookieSecure;
    }
}
// mycountryのクッキーがあるか確認。なければサーバーから取得する。
function isCountryCookie() {
    if (!getCookie('myco')) {
        $.ajax({
            url: '/settings/country',
            type: 'POST',
            success: function(data) {
                if (data.country) {
                    setCountryCookie(data.country);
                }
            }
        });
    } 
}
function isNumCookie() {
    if (!getCookie('num')) {
        $.ajax({
            url: '/settings/num',
            type: 'POST',
            success: function(data) {
                if (data.pnum != 0 && data.cnum != 0 && data.err != "err") {
                    if (getCookie('expires') == "yes") {
                        document.cookie = "num=" + data.pnum + ":" + data.cnum + ";max-age=604800;" + cookieSecure;
                    } else {
                        document.cookie = "num=" + data.pnum + ":" + data.cnum + ";" + cookieSecure;
                    }
                }
            }
        });
    } 
}
function setCountryCookie(country) {
    if (countryMap[country]) {
        if (getCookie('expires') == "yes") {
            document.cookie = "myco=" + country + ";max-age=604800;" + cookieSecure;
        } else {
            document.cookie = "myco=" + country + ";" + cookieSecure;
        }
    }
}
