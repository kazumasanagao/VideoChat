var express = require('express');
var router = express.Router();
var userCheck = require('./userCheck.js');
var Users = require('./dbModel.js').Users;
var Chats = require('./dbModel.js').Chats;
var conf = require('./conf.js');
var base64 = require('urlsafe-base64');
var countries = require('./conf.js').countries;

router.post('/', function(req, res, next) {
    var cookie = req.cookies.id
    userCheck.getUser(cookie, function(getUser) {
        if (getUser) {
            var data;
            var fb_or_mail = null;
            if (getUser[0].email && getUser[0].fbid) {
                fb_or_mail = "both";
            } else if (getUser[0].email) {
                fb_or_mail = "mail";
            } else if (getUser[0].fbid) {
                fb_or_mail = "fb";
            }

            if (!getUser[0].nickname && getUser[0].fbdata) {
                var languages = null;
                if (getUser[0].fbdata.fblanguage) {
                    languages = ["en", getUser[0].fbdata.fblanguage];
                }
                data = {
                    nickname: getUser[0].fbdata.fbnickname, 
                    country: getUser[0].fbdata.fbcountry,
                    shortBio: null,
                    longBio: null,
                    languages: languages,
                    gender: getUser[0].fbdata.fbgender,
                    keeplogin: false,
                    fbphoto: getUser[0].fbdata.fbphotourl,
                    fb_or_mail: null
                }
            } else {
                data = {
                    nickname: getUser[0].nickname, 
                    country: getUser[0].country,
                    shortBio: getUser[0].shortBio,
                    longBio: getUser[0].longBio,
                    languages: getUser[0].languages,
                    gender: getUser[0].gender,
                    keeplogin: getUser[0].keeplogin,
                    fbphoto: null,
                    fb_or_mail: fb_or_mail
                }
            }
            res.json(data);
        } else {
            //console.log("not login");
        }
    });
});

router.post('/save', function(req, res, next) {
    var cookie = req.cookies.id
    userCheck.getUser(cookie, function(user) {
        if (user) {
            var nickname = req.body.nickname;
            var country = req.body.country;
            var shortBio_row = req.body.shortBio;
            var longBio_row = req.body.longBio;
            var languages_row = req.body.languages;
            var gender = req.body.gender;
            var keeplogin = req.body.keeplogin;
            var shortBio = escape(shortBio_row);
            var longBio = escape(longBio_row);
            function escape(text) {
                return (text + "").
                replace(/\n+/g," ");
            }

            var languages = languages_row.split(",");

            if (keeplogin == "true") {
                keeplogin = true;
            } else {
                keeplogin = false;
            }

            var input_error = false;
            if (!nickname || !country || !shortBio || !languages || !gender) {
                input_error = true;
            } else if (nickname.length > 12) {
                input_error = true;
            } else if (!nickname.match(/^[a-zA-z¥s]+$/)) {
                input_error = true;
            } else if (conf.countries[country] != 1) {
                input_error = true;
            } else if (calcByte(shortBio) > 60) {
                input_error = true;
            } else if (calcByte(longBio) > 160) {
                input_error = true;
            } else if (gender != "fe" && gender != "ma") {
                input_error = true;
            }

            if (input_error) {
                res.json({stat: "error"});
            } else {
                var isPhoto = req.body.isPhoto;
                if (isPhoto == "true") {
                    var b64img = req.body.photo;
                    var img = base64.decode(b64img);
                    if (img.length < 15000) {
                        var params = {Bucket: conf.bucket, Key: user[0].id+".jpeg", Body: img};
                        conf.s3.putObject(params, function(err, data) {
                            if (err) {     
                                console.log(err);
                            } else {
                                //console.log("Successfully uploaded data to myBucket/myKey");
                            }
                        });
                    }
                }
                var isCountryChange = false;
                var prevCountry = "";
                if (user[0].country != country) {
                    isCountryChange = true;
                    prevCountry = user[0].country;
                }
                user[0].nickname = nickname;
                user[0].country = country;
                user[0].shortBio = shortBio;
                user[0].longBio = longBio;
                user[0].languages = languages;
                user[0].gender = gender;
                user[0].keeplogin = keeplogin;
                user[0].save(function (err) {
                    if (!err) {
                        res.json({
                            stat: "ok",
                            keeplogin: keeplogin
                        });
                    }
                });

                if (isCountryChange) {
                    var plist = [];
                    for (var k in user[0].historyTi) {
                        plist.push(k);
                    }
                    var query = {id: {$in: plist}};
                    Users.find(query, {historyCo:1}, null,function(err, users) {
                        if (!err) {
                            for (var i = 0; i < users.length; i++) {
                                var hico = users[i].historyCo[prevCountry];
                                var index_hico = hico.indexOf(user[0].id);
                                if (index_hico != -1) {
                                    hico.splice(index_hico, 1);
                                    users[i].historyCo[country].unshift(user[0].id);                        
                                    users[i].markModified('historyCo');
                                    users[i].save();
                                } 
                            }
                        } else {
                            console.log(err);
                        }
                    });
                }
            }
        } else {
            res.json({stat: "error"});
        }
    });
});

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

router.post('/keeplogin', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var keeplogin = false;
            if (user[0].keeplogin) {keeplogin = user[0].keeplogin}
            res.json({keeplogin: keeplogin}); 
        } else {
            //console.log('not login');
            return res.json({err: "err"});
        }
    });
});

router.post('/country', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var country = null;
            if (user[0].country) {country = user[0].country}
            res.json({country: country}); 
        } else {
            //console.log('not login');
            return res.json({err: "err"});
        }
    });
});

router.post('/num', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var cnum = 0;
            var pnum = 0;
            for (var key in countries) {
                if (user[0].historyCo[key]) {
                    if (user[0].historyCo[key].length > 0){
                        cnum++;
                        pnum += user[0].historyCo[key].length;
                    }
                }
            }
            res.json({pnum: pnum, cnum:cnum});
        } else {
            //console.log('not login');
            return res.json({err: "err"});
        }
    });
});

router.post('/delete', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            if (user[0]) {
                if (req.body.from == "policy") {
                    if (!user[0].nickname) {
                        user[0].remove();
                        res.json({stat:"ok"});
                    }
                } else {
                    var query = {};
                    query.$or = [{id0: user[0].id}, {id1: user[0].id}];
                    Chats.find(query, {id0:1}, null, function(err, docs) {
                        if (!err) {
                            for (var i = 0; i < docs.length; i++) {
                                docs[i].remove();
                            }
                        }
                    });

                    var params = {Bucket: conf.bucket, Key: user[0].id+".jpeg"};
                    conf.s3.deleteObject(params, function(err, data) {
                        if (err) {     
                            console.log(err);
                        } else {
                            //console.log("Successfully deleted data from myBucket/myKey");
                        }
                    });

                    var plist = [];
                    for (var k in user[0].historyTi) {
                        plist.push(k);
                    }
                    var query2 = {id: {$in: plist}};
                    Users.find(query2, {historyTi:1}, null, function(err, users) {
                        if (!err) {
                            for (var i = 0; i < users.length; i++) {
                                var hiti = users[i].historyTi;
                                var hitidata = null;
                                if (hiti) {
                                    hitidata = hiti[user[0].id];
                                }
                                if (hitidata) {
                                    delete hiti[user[0].id];
                                    users[i].markModified('historyTi');
                                    users[i].save();
                                }
                            }
                            user[0].remove();
                            res.json({stat:"ok"});
                        } else {
                            console.log(err);
                            res.json({stat:"ng"});
                        }
                    });
                }
            } else {
                res.json({stat:"ng"});
            }
        } else {
            //console.log("not login");
            return res.json({err: "err"});
        }
    });
});

module.exports = router;