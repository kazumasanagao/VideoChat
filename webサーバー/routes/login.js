var express = require('express');
var router = express.Router();
var url = require('url');
var request = require('request');
var conf = require('./conf.js');
var Users = require('./dbModel.js').Users;
var Chats = require('./dbModel.js').Chats;
var userCheck = require('./userCheck.js');
var countries = require('./conf.js').countries;

var l = 10;
var c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
var cl = c.length;
var nodemailer = require("nodemailer");
var transport = nodemailer.createTransport('SMTP', {
    host: "localhost",
    port: 25
});

var fb_params = {
    host: 'graph.facebook.com',
    pathname: '/oauth/access_token',
    protocol: 'https',
    query: {
        'client_id': conf.fb_client_id,
        'client_secret': conf.fb_client_secret,
        'grant_type': 'client_credentials'
    }
};


router.post('/fblogin', function (req, res) {
    var fbtoken = req.body.fbtoken;
    var q = req.query.q;
    var fbAppAccessToken;

    request(url.format(fb_params), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            response.setEncoding('utf8');
    　      fbAppAccessToken = body.split('=')[1];
            if (q == "connect") {
                fbCheckAccessToken(fbtoken, fbAppAccessToken, fb_connect, res, req);
            } else {
                fbCheckAccessToken(fbtoken, fbAppAccessToken, fb_success, res, req);
            }
            
        } else {
            console.log('error: ' + response.statusCode);
            console.log(body);
            return res.json({stat:"er"});
        }
    });
});

var fbCheckAccessToken = function(inputToken, fbAppAccessToken, callback, res, req){
    var params = {
        host: 'graph.facebook.com',
        pathname: '/debug_token',
        protocol: 'https',
        query: {
            'input_token': inputToken,
            'access_token': fbAppAccessToken
        }
    };
    request(url.format(params), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            response.setEncoding('utf8');
            var resJson = JSON.parse(body);
            if (!resJson.data || !resJson.data.is_valid) {
                console.log('FB Invalid access token');
                return res.json({stat:"er"});
            };
            if (resJson.data.is_valid) {
                callback(resJson.data.user_id, inputToken, fbAppAccessToken, res, req);
            }
        } else {
            console.log('error: ' + response.statusCode);
            console.log(body);
            return res.json({stat:"er"});
        }
    });
}
function fb_success(fbid, inputToken, fbAppAccessToken, res, req) {
    var params = {
        host: 'graph.facebook.com',
        pathname: '/'+fbid,
        protocol: 'https',
        query: {
            'access_token': fbAppAccessToken,
            'fields': "email,first_name,gender,locale,picture.width(80).height(80)",
            'locale': 'en_US'
        }
    };
    request(url.format(params), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            response.setEncoding('utf8');
            var resJson = JSON.parse(body);
            console.log(resJson);
            if (resJson.id) {
                Users.find({fbid:resJson.id},{id:1,keeplogin:1},{limit:1}, function(err, user) {
                    if (!err) {
                        if (user[0]) {
                            var cnum = 0;
                            var pnum = 0;
                            for (var k in countries) {
                                if (user[0].historyCo[k]) {
                                    if (user[0].historyCo[k].length > 0){
                                        cnum++;
                                        pnum += user[0].historyCo[k].length;
                                    }
                                }
                            }
                            var keeplogin = false;
                            if (user[0].keeplogin) {
                                keeplogin = user[0].keeplogin;
                            }
                            var key = userCheck.makeKey();
                            user[0].key = key;
                            user[0].save();
                            var hash = userCheck.makeHash(user[0].id, key);

                            return res.json({
                                stat: "ok",
                                userID: user[0].id,
                                hash: hash,
                                keeplogin: keeplogin,
                                pnum: pnum,
                                cnum: cnum
                            });
                        } else {
                            checkid();
                            function checkid() {
                                var newid = "";
                                for(var i=0; i<l; i++){
                                    newid += c[Math.floor(Math.random()*cl)];
                                }
                                Users.find({id: newid}, {id:1}, {limit:1}, function(err, duplicate) {
                                    if(!err) {
                                        if (duplicate[0]) {
                                            checkid();
                                        } else {
                                            var key = userCheck.makeKey();
                                            var hash = userCheck.makeHash(newid, key);

                                            var nickname = resJson.first_name;
                                            var locale = resJson.locale;
                                            var gender = resJson.gender;
                                            var photo_url = resJson.picture.data.url;
                                            var country = null;
                                            var language = null;

                                            if (nickname) {
                                                if (nickname.match(/^[a-zA-z¥s]+$/)) {
                                                    if (nickname.length > 12) {
                                                        nickname.splice(0,12);
                                                    }
                                                } else {
                                                    nickname = null;
                                                }
                                            } else {
                                                nickname = null;
                                            }

                                            if (locale.length == 5) {
                                                var l = locale.slice(0,2);
                                                l = l.toLowerCase();
                                                var c = locale.slice(-2);
                                                c = c.toLowerCase();
                                                if (l != "en" && conf.languages[l] == 1) {
                                                    language = l;
                                                }
                                                if (conf.countries[c] == 1) {
                                                    country = c;
                                                }
                                            }

                                            if (gender == "female") {
                                                gender = "fe";
                                            } else if (gender == "male") {
                                                gender = "ma";
                                            } else {
                                                gender = null;
                                            }

                                            if (photo_url) {
                                                if (!(photo_url.length < 300 && photo_url.slice(0,8) == "https://")) {
                                                    photo_url = null;
                                                }
                                            }

                                            var newuser = new Users();
                                            newuser.id = newid;
                                            newuser.fbid = resJson.id;
                                            var fbemail_row = resJson.email;
                                            if (fbemail_row && fbemail_row.match(/.+@.+\..+/)) {
                                                var email_encrypt = userCheck.encrypt(resJson.email, conf.phone_key);
                                                newuser.fbemail = email_encrypt;
                                            }
                                            newuser.key = key;
                                            if (nickname || country || language || gender || photo_url) {
                                                newuser.fbdata = {fbnickname: nickname,fbcountry: country,fblanguage: language,fbgender: gender,fbphotourl: photo_url}
                                            }
                                            newuser.save();
                                            return res.json({
                                                stat: "ok",
                                                userID: newid,
                                                hash: hash,
                                                keeplogin: false,
                                                pnum: 0,
                                                cnum: 0
                                            });
                                        }
                                    } else {
                                        return res.json({stat:"er"});
                                    }
                                });
                            }
                        }
                    } else {
                        return res.json({stat:"er"});
                    }
                });
            } else {
                return res.json({stat:"er"});
            }
        } else {
            console.log('error: ' + response.statusCode);
            console.log(body);
            return res.json({stat:"er"});
        }
    });
}

function fb_connect(fbid, inputToken, fbAppAccessToken, res, req) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var params = {
                host: 'graph.facebook.com',
                pathname: '/'+fbid,
                protocol: 'https',
                query: {
                    'access_token': fbAppAccessToken,
                }
            };
            request(url.format(params), function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    response.setEncoding('utf8');
                    var resJson = JSON.parse(body);
                    var fbid = resJson.id;
                    if (fbid) {
                        Users.find({fbid: fbid},{id:1},{limit:1}, function(err, duplicate) {
                            if (duplicate[0]) {
                                return res.json({stat:"du"});
                            } else {
                                user[0].fbid = fbid;
                                user[0].save();
                                return res.json({stat:"ok"});
                            }
                        });
                    } else {
                        return res.json({stat:"er"});
                    }
                } else {
                    return res.json({stat:"er"});
                }
            });
        }
    });
}

router.post('/gettoken', function (req, res) {
    var email = req.body['email'];
    if (email.match(/.+@.+\..+/)) {
        var email_encrypt = userCheck.encrypt(email, conf.phone_key);
        var token = Math.floor(Math.random()*10000000);
        while (token < 1000000) {
            token = Math.floor(Math.random()*10000000);
        }

        Users.find({email: email_encrypt},{id:1,validation:1},{limit:1}, function(err, user) {
            if (!err) {
                if (user[0]) {
                    var lastissue = false;
                    if (user[0].validation['issuedate']) {
                        lastissue = new Date() - user[0].validation['issuedate'];
                    }
                    if (lastissue && lastissue < 600000) {
                        var restmin = Math.ceil((600000 - lastissue) / 60000);
                        return res.json({stat:"al", restmin: restmin});
                    } else {
                        // テスト
                        user[0].validation = {
                            issuedate: new Date(),
                            token: token,
                            mistake: 0
                        }
                        user[0].markModified("validation");
                        user[0].save();
                        return res.json({stat:"ok", token: token});
                        //本番
                        /*
                        try{    
                            var message = {
                                from: 'issue_token@chample.in(Chample)',
                                to: email,
                                subject: 'Token',
                                text: 'Token: '+ token + '. Enter this token in Chample App. (Do not reply to this mail.)'
                            };
                            mail = transport.sendMail(message, function(error, success){
                                if (error) {
                                    console.log(error);
                                    res.json({stat:"ng"});
                                    return;
                                }
                                if (success) {
                                    user[0].validation = {
                                        issuedate: new Date(),
                                        token: token,
                                        mistake: 0
                                    }
                                    user[0].markModified("validation");
                                    user[0].save();
                                    return res.json({stat:"ok"});
                                } else {
                                    res.json({stat:"ng"});
                                }
                                message.transport.close();
                                return;
                             });

                        } catch(e) {
                            console.log(e);
                        }
                        */
                    }
                } else {
                    checkid();
                    function checkid() {
                        var newid = "";
                        for(var i=0; i<l; i++){
                            newid += c[Math.floor(Math.random()*cl)];
                        }
                        Users.find({id: newid}, {id:1}, {limit:1}, function(err, duplicate) {
                            if(!err) {
                                if (duplicate[0]) {
                                    checkid();
                                } else {
                                    // テスト
                                    var newuser = new Users();
                                    newuser.id = newid;
                                    newuser.email = email_encrypt;
                                    newuser.validation = {
                                        issuedate: new Date(),
                                        token: token,
                                        mistake: 0
                                    }
                                    newuser.markModified("validation");
                                    newuser.save();
                                    return res.json({stat:"ok", token:token});
                                    // 本番
                                    /*
                                    try {
                                        var message = {
                                            from: 'issue_token@chample.in(Chample)',
                                            to: email,
                                            subject: 'Token',
                                            text: 'Token: '+ token + '. Enter this token in Chample App. (Do not reply to this mail.)'
                                        };
                                        mail = transport.sendMail(message, function(error, success){
                                            if(error){
                                                console.log(error);
                                                res.json({stat:"ng"});
                                                return;
                                            }
                                            if(success){
                                                var newuser = new Users();
                                                newuser.id = newid;
                                                newuser.email = email_encrypt;
                                                newuser.validation = {
                                                    issuedate: new Date(),
                                                    token: token,
                                                    mistake: 0
                                                }
                                                newuser.markModified("validation");
                                                newuser.save();
                                                return res.json({stat:"ok"});
                                            } else {
                                                res.json({stat:"ng"});
                                            }
                                            message.transport.close();
                                            return;
                                        });
                                    }catch(e){
                                        console.log(e);
                                    }
                                    */
                                }
                            }
                        });
                    }
                }
            }
        });
    } else {
        res.json({stat:"ng"});
    }
});
router.post('/sendtoken', function (req, res) {
    var token = req.body['token'];
    var email = req.body['email'];
    var email_encrypt = userCheck.encrypt(email, conf.phone_key);
    Users.find({email: email_encrypt},{id:1,historyCo:1,keeplogin:1,validation:1},{limit:1}, function(err, user) {
        if (!err) {
            if (user[0]) {
                var issuedate = user[0].validation.issuedate;
                var db_token = user[0].validation.token;
                var mistake = user[0].validation.mistake;
                if (mistake < 3) {
                    if (token == db_token) {
                        if (new Date() - issuedate < 600000) {
                            var key = userCheck.makeKey();
                            user[0].key = key;
                            user[0].validation = {issuedate:null, token:null, mistake:null};
                            user[0].markModified("validation");
                            user[0].save();

                            var cnum = 0;
                            var pnum = 0;
                            for (var k in countries) {
                                if (user[0].historyCo[k]) {
                                    if (user[0].historyCo[k].length > 0){
                                        cnum++;
                                        pnum += user[0].historyCo[k].length;
                                    }
                                }
                            }
                            var keeplogin = false;
                            if (user[0].keeplogin) {
                                keeplogin = user[0].keeplogin;
                            }
                            var hash = userCheck.makeHash(user[0].id, key);

                            return res.json({
                                stat: "ok",
                                userID: user[0].id,
                                hash: hash,
                                keeplogin: keeplogin,
                                pnum: pnum,
                                cnum: cnum
                            });
                        } else {
                            user[0].validation = {issuedate:null, token:null, mistake:null};
                            user[0].markModified("validation");
                            user[0].save();
                            return res.json({
                                stat: "ov"
                            });
                        }
                    } else {
                        console.log("misslogin:"+token);
                        user[0].validation['mistake'] = user[0].validation['mistake'] + 1;
                        user[0].markModified("validation");
                        user[0].save();
                        return res.json({
                            stat: "ms"
                        });
                    }
                } else {
                    return res.json({
                        stat: "rs"
                    });
                }
            } else {
                //console.log("no user");
            }
        }
    });
});

router.post('/gettokench', function (req, res) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var email = req.body['email'];
            if (email.match(/.+@.+\..+/)) {
                var email_encrypt = userCheck.encrypt(email, conf.phone_key);
                var token = Math.floor(Math.random()*10000000);
                while (token < 1000000) {
                    token = Math.floor(Math.random()*10000000);
                }

                Users.find({email: email_encrypt},{id:1,validation:1},{limit:1}, function(err, user2) {
                    if (!err) {
                        if (user2[0]) {
                            if (user2[0].id == user[0].id) {
                                return res.json({stat:"cu"});
                            } else {
                                return res.json({stat:"du"});
                            }
                        } else {
                            var lastissue = false;
                            if (user[0].validation['issuedate']) {
                                lastissue = new Date() - user[0].validation['issuedate'];
                            }
                            if (lastissue && lastissue < 600000) {
                                var restmin = Math.ceil((600000 - lastissue) / 60000);
                                return res.json({stat:"al", restmin: restmin});
                            }
                            // テスト
                            user[0].validation = {
                                issuedate: new Date(),
                                token: token,
                                mistake: 0
                            }
                            user[0].markModified("validation");
                            user[0].save();
                            return res.json({stat:"ok", token:token});
                            // 本番
                            /*
                            try{
                                var message = {
                                    from: 'issue_token@chample.in(Chample)',
                                    to: email,
                                    subject: 'Token',
                                    text: 'Token: '+ token + '. Enter this token in Chample App. (Do not reply to this mail.)'
                                };
                                mail = transport.sendMail(message, function(error, success){
                                    if (error) {
                                        console.log(error);
                                        res.json({stat:"ng"});
                                        return;
                                    }
                                    if (success) {
                                        user[0].validation = {
                                            issuedate: new Date(),
                                            token: token,
                                            mistake: 0
                                        }
                                        user[0].markModified("validation");
                                        user[0].save();
                                        return res.json({stat:"ok"});
                                    } else {
                                        res.json({stat:"ng"});
                                    }
                                    message.transport.close();
                                    return;
                                 });
                            } catch(e) {
                                console.log(e);
                            }
                            */    
                        }
                    }
                });
            } else {
                res.json({stat:"ng"});
            }
        }
    });
});
router.post('/sendtokench', function (req, res) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var token = req.body['token'];
            var email = req.body['email'];
            var email_encrypt = userCheck.encrypt(email, conf.phone_key);
            Users.find({email: email_encrypt},{id:1,historyCo:1,keeplogin:1,validation:1},{limit:1}, function(err, duplicate) {
                if (!err) {
                    if (duplicate[0]) {
                        return res.json({stat: "du"});        
                    } else {
                        var issuedate = user[0].validation.issuedate;
                        var db_token = user[0].validation.token;
                        var mistake = user[0].validation.mistake;
                        if (mistake < 3) {
                            if (token == db_token) {
                                if (new Date() - issuedate < 600000) {
                                    user[0].email = email_encrypt;
                                    user[0].validation = {issuedate:null, token:null, mistake:null};
                                    user[0].markModified("validation");
                                    user[0].save();
                                    return res.json({stat: "ok"});
                                } else {
                                    user[0].validation = {issuedate:null, token:null, mistake:null};
                                    user[0].markModified("validation");
                                    user[0].save();
                                    return res.json({stat: "ov"});
                                }
                            } else {
                                user[0].validation['mistake'] = user[0].validation['mistake'] + 1;
                                user[0].markModified("validation");
                                user[0].save();
                                return res.json({stat: "ms"});
                            }
                        } else {
                            return res.json({stat: "rs"});
                        }
                    }
                }
            });
        }
    });
});
router.post('/getcurrent', function (req, res) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user && user[0].email) {
            var email = userCheck.decrypt(user[0].email);
            if (email) {
                var sp = email.split("@");
                if (sp.length == 2) {
                    var first,second;
                    if (sp[0].length > 3) {
                        first = sp[0].substr(0, 3);
                    } else {
                        first = sp[0].substr(0, 1);
                    }
                    if (sp[1].length > 3) {
                        second = sp[1].substr(0, 3);
                    } else {
                        second = sp[1].substr(0, 1);
                    }
                    return res.json({stat:"ok", first:first, second:second});
                } else {
                    return res.json({stat:"err"});
                }
            } else {
                return res.json({stat:"err"});
            }
        }
    });
});

module.exports = router;