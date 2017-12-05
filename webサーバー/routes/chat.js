var express = require('express');
var router = express.Router();
var userCheck = require('./userCheck.js');
var Users = require('./dbModel.js').Users;
var Chats = require('./dbModel.js').Chats;
var querymaker = require('./queryMaker.js');
var reportcheck = require('./reportcheck.js');

router.get('/', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(getUser) {
        if (getUser && getUser[0].nickname && getUser[0].reportflag == 2) {
            reportcheck.report2to1(getUser);
            res.redirect('restrict');
        } else if (getUser && getUser[0].nickname && getUser[0].reportflag == 1) {
            var now = new Date();
            if (getUser[0].lockuntil < now) {
                getUser[0].reportflag = 0;
                getUser[0].lockuntil = null;
                getUser[0].save();
                res.render('main', {script: ""});
            } else {
                res.redirect('restrict');
            }
        } else if (getUser && getUser[0].nickname) {
            res.render('main', {script: ""});
        } else if (getUser && !getUser[0].nickname) {
            res.render('main',{script: "noSettings()"});
        } else {
            res.render('main',{script: "demo()"});
        }
    });
});

router.post('/', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(getUser) {
        if (getUser && getUser[0].reportflag != 1 && getUser[0].reportflag != 2) {
            var myid = getUser[0].id;

            var language = req.body.language;
            var gender = req.body.gender;
            var region = req.body.region;
            var country = req.body.country;
            var freeword = req.body.freeword;
            var userlangs = getUser[0].languages;
            var loginnow_row = req.body.loginnow;
            var loginnow = loginnow_row == "true" ? true : false;
            var starred_row = req.body.starred;
            var starred = starred_row == "true" ? true : false;

            var query0 = { $or:[{id0: myid}, {id1: myid}] };
            var query1 = querymaker.makeQuery(language, gender, region, country, freeword, userlangs, loginnow);
            
            var projections0 = {_id: 0,id0: 1,id1: 1,read: 1,last: 1}
            var projections1 = {_id: 0,id: 1,nickname: 1,country: 1,shortBio: 1}

            var sortq = '-last.time';

            Chats.find(query0, projections0, {sort: sortq}, function(err, cdocs) {
                if (!err) {
                    // まずチャットしたことがある人を抽出
                    var persons = [];
                    if (starred) {
                        var stars = getUser[0].star;
                        for (var i = 0; i < cdocs.length; i++) {
                            if (cdocs[i].id0 == myid && stars.indexOf(cdocs[i].id1) >= 0) {
                                persons.push(cdocs[i].id1);
                            } else if (cdocs[i].id1 == myid && stars.indexOf(cdocs[i].id0) >= 0) {
                                persons.push(cdocs[i].id0);
                            }
                        }
                    } else {
                        for (var i = 0; i < cdocs.length; i++) {
                            if (cdocs[i].id0 == myid) {
                                persons.push(cdocs[i].id1);
                            } else {
                                persons.push(cdocs[i].id0);
                            }
                        }
                    }
                    // その人のリストの中から、入力された条件で絞り込み ＆ nicknameとcountry,shortBioを拾ってくる
                    var personsinfo = {};
                    query1.id = {$in:persons, $nin: getUser[0].block};
                    Users.find(query1, projections1, null, function(err, udocs) {
                        if (!err) {
                            for (var i = 0; i < udocs.length; i++) {
                                personsinfo[udocs[i].id] = {
                                    nickname: udocs[i].nickname,
                                    country: udocs[i].country,
                                    shortBio: udocs[i].shortBio
                                };
                            }
                            // チャット情報とnickname,country,shortBio情報を結合
                            var result = [];
                            for (var i = 0; i < cdocs.length; i++) {
                                var mixed = {};
                                // 対象のpersonsinfoがないということはクエリではじかれているということなので無視
                                if (personsinfo[persons[i]]) {
                                    mixed.id = persons[i];
                                    mixed.last = cdocs[i].last
                                    mixed.nickname = personsinfo[persons[i]].nickname;
                                    mixed.country = personsinfo[persons[i]].country;
                                    mixed.shortBio = personsinfo[persons[i]].shortBio;
                                    if (cdocs[i].id0 == myid) {
                                        mixed.read = cdocs[i].read.id0;
                                    } else {
                                        mixed.read = cdocs[i].read.id1;
                                    }
                                    result.push(mixed);
                                }
                            }
                            res.json({info: result});
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    console.log(err);
                }
            });

        } else {
            //console.log("not login");
            return res.json({err:"err"});
        }
    });
});

router.post('/past', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(getUser) {
        if (getUser && getUser[0].nickname) {
            var myid = getUser[0].id;
            var hisid = req.body.hisid;

            var val = {};
            var query = {$or:[{id0: myid, id1: hisid},{id0: hisid, id1: myid}]};

            var projections = {
                _id: 0,
                chats: 1,
                id0: 1,
                id1: 1
            };
            Chats.find(query, projections, {limit:1}, function(err, doc) {
                if (!err) {
                    if (doc[0]) {
                        val.chats = doc[0].chats;
                        if (doc[0].id0 == myid) {
                            val.mynum = 0;
                        } else {
                            val.mynum = 1;
                        }
                        
                        res.json({val: val});
                    } else {
                        res.json({val: null});
                    }
                } else {
                    console.log(err);
                }
            });
            
        } else {
            //console.log("not login")
            return res.json({err:"err"});
        }
    });
});

router.post('/new', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var myid = user[0].id;
            var query = {'id0': myid, 'read.id0': false, 'id1': {$nin: user[0].block}};
            Chats.find(query, {id1:1}, {limit:1}, function(err, chat) {
                if (!err) {
                    if (chat.length > 0) {
                        res.json({isnew: true});
                    } else {
                        var query2 = {'id1': myid, 'read.id1': false, 'id0': {$nin: user[0].block}};
                        Chats.find(query2, {id0:1}, {limit:1}, function(err, chat2) {
                            if (!err) {
                                if (chat2.length > 0) {
                                    res.json({isnew: true});
                                } else {
                                    res.json({isnew: false});
                                }
                            } else {
                                console.log(err);
                                res.json({isnew: false});
                            }
                        });
                    }
                } else {
                    console.log(err);
                    res.json({isnew: false}); 
                }
            });
        } else {
            //console.log("not login");
            return res.json({err:"err"});
        }
    });
});

router.post('/ischat', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            Users.find({id: req.body.id}, {historyTi: 1, loginflag: 1,roomname: 1}, {limit:1}, function(err, he) {
                if (!err) { 
                    if(he[0] && he[0].historyTi && he[0].historyTi[user[0].id]) { // 通話履歴のある人か確認
                        res.json({chatok: true});
                    } else {
                        res.json({chatok: false});
                    }
                } else {
                    console.log(err);
                    res.json({chatok: false});
                }
            });
        } else {
            //console.log("not login");
            res.json({chatok: false});
        }
    });
});

router.post('/read', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var myid = user[0].id;
            var hisid = req.body.hisid;
            var mynum = req.body.mynum;
            var query = {};
            var id0 = mynum == 0 ? myid : hisid;
            var id1 = mynum == 1 ? myid : hisid;
            query.id0 = id0;
            query.id1 = id1;

            Chats.find(query, {read:1}, {limit:1},function(err, chat) {
                if (!err) {
                    if (chat[0]) {
                        if (!chat[0].read['id'+mynum]) {
                            chat[0].read['id'+mynum] = true;
                            chat[0].save();
                            res.json({success:true});
                        } else {
                            res.json({success:true});
                        }
                    } else {
                        //console.log("no chat");
                        res.json({success:false});
                    }
                } else {
                    console.log(err);
                    res.json({success:false});
                }
            });
        } else {
            //console.log("not login");
            res.json({success:false});
        }
    });
});

module.exports = router;
