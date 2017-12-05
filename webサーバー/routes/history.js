var express = require('express');
var router = express.Router();
var userCheck = require('./userCheck.js');
var Users = require('./dbModel.js').Users;
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
            var blocking_row = req.body.blocking;
            var blocking = blocking_row == "true" ? true : false;

            var query = querymaker.makeQuery(language, gender, region, country, freeword, userlangs, loginnow);
            var p = [];
            if (blocking && starred) {
                p = getUser[0].block;
                var star = getUser[0].star;
                for (var i = 0; i < p.length; i++) {
                    if (star.indexOf(p[i]) == -1) {
                        delete p[i];
                    }
                }
            } else if (blocking) {
                p = getUser[0].block;
            } else if (starred) {
                p = getUser[0].star;
            } else {
                var hi = getUser[0].historyTi;
                for (key in hi) { p.push(key); }
            }

            query.id = {$in:p};
            
            var projections = {_id:0,id:1,nickname:1,country:1,shortBio:1,longBio:1,languages:1,gender:1,historyTi:1};
            // 文字列でソートする場合は頭に'-'をつけるか否かで降順か昇順を選択できる。
            // 複数クエリあるときは半角スペースを空ける。
            // 詳しくは以下のファイルで確認
            // node_modules/mongoose/node_modules/mquery/lib/mquery.js
            var sortq = '-historyTi.'+getUser[0].id;

            Users.find(query, projections, {sort: sortq}, function(err, docs) {
                if (!err) {
                    for (var i = 0; i < docs.length; i++) {
                        if (docs[i].historyTi && docs[i].historyTi[getUser[0].id]) {
                            docs[i].historyTi = docs[i].historyTi[getUser[0].id];
                        } else if (blocking) {
                            if (docs[i].historyTi && docs[i].historyTi[getUser[0].id]) {
                                docs[i].historyTi = docs[i].historyTi[getUser[0].id];
                            } else if (docs[i].historyTi) {
                                docs[i].historyTi = "";
                            }
                        } else {
                            docs.splice(i,1);
                            i--;
                        }
                    }
                    res.json({info: docs, stars: getUser[0].star, block: getUser[0].block});
                } else {
                    console.log(err);
                    return res.json({err:"err"});
                }
            });
        } else {
            //console.log("not login");
            return res.json({err:"err"});
        }
    });
});

router.post('/star', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var hisid = req.body.id;
            var star = user[0].star;
            var myhis = user[0].historyTi;
            if (myhis[hisid]) {
                var index = star.indexOf(hisid);
                if (index == -1) {
                    star.push(hisid);
                    user[0].save();
                    res.json({res: "add"});
                } else {
                    star.splice(index, 1);
                    user[0].save();
                    res.json({res: "del"});
                }
            }
        } else {
            //console.log("not login");
        }
    });
});

router.post('/starcheck', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var hisid = req.body.id;
            var star = user[0].star;
            var myhis = user[0].historyTi;
            var isstar = false;
            if (myhis && myhis[hisid]) {
                var index = star.indexOf(hisid);
                if (index != -1) {
                    isstar = true;
                }
            }
            res.json({isstar: isstar});
        } else {
            //console.log("not login");
        }
    });
});

router.post('/block', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var hisid = req.body.id;
            var blocks = user[0].block;
            var index = blocks.indexOf(hisid);
            if (index == -1) {
                blocks.push(hisid);
                user[0].save();
                res.json({res: "blocked"});
            } else {
                blocks.splice(index, 1);
                user[0].save();
                res.json({res: "released"});
            }
        } else {
            //console.log("not login");
        }
    });
});

router.post('/blockcheck', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var hisid = req.body.id;
            var block = user[0].block;
            var isblock = false;
            var index = block.indexOf(hisid);
            if (index != -1) {
                isblock = true;
            }
            res.json({isblock: isblock});
        } else {
            //console.log("not login");
        }
    });
});

router.post('/report', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(user) {
        if (user) {
            var hisid = req.body.id;
            var val = req.body.val;
            if (val == "gh" || val == "ha" || val == "ad" || val == "ot") {
                if (user[0].historyTi[hisid]) {
                    var reporting = user[0].reporting;
                    var query = {};
                    var hi = user[0].historyTi;
                    var p = [];
                    for (key in hi) { p.push(key); }
                    query.id = {$in:p};
                    var projections = {_id:0,id:1};
                    var sortq = '-historyTi.'+user[0].id;

                    Users.find(query, projections, {sort: sortq, limit: 10}, function(err, docs) {
                        if (!err) {
                            // latestでないものを消去
                            var k = 0;
                            for (var i = 0; i < reporting.length; i++) {
                                var islatest = false;
                                for (var j = 0; j < docs.length; j++) {
                                    if (reporting[i-k].id == docs[j].id) {
                                        islatest = true;
                                        break;
                                    }
                                }
                                if (!islatest) {
                                    reporting.splice(i, 1);
                                    k++;
                                }
                            }
                            // reportingの件数を確認
                            var num_my_report = reporting.length;
                            // 新しいreportがlatestに入っていて、かつすでにreportされてなければ保存。
                            for (var i = 0; i < docs.length; i++) {
                                if (hisid == docs[i].id) {
                                    var ishim = false;
                                    for (var j = 0; j < reporting.length; j++) {
                                        if (hisid == reporting[j].id) {
                                            ishim = true;
                                            break;
                                        }
                                    }
                                    if (!ishim) {
                                        reporting.unshift({id: hisid, content: val});
                                        user[0].save();
                                    }
                                    break;
                                }
                            }
                            // ここからは相手のreportedを更新
                            Users.find({id:hisid}, {historyTi:1,reported:1,reportflag:1,reportdate:1}, {limit: 1}, function(err, he) {
                                if (!err) {
                                    if (he[0]) {
                                        var reported = he[0].reported;
                                        var query2 = {};
                                        var hi2 = he[0].historyTi;
                                        var p2 = [];
                                        for (key in hi2) { p2.push(key); }
                                        query2.id = {$in:p2};
                                        var projections2 = {_id:0,id:1};
                                        var sortq2 = '-historyTi.'+he[0].id;

                                        Users.find(query2, projections2, {sort: sortq2, limit: 10}, function(err, docs2) {
                                            if (!err) {
                                                // reportedの古いデータを削除
                                                var k = 0;
                                                for (var i = 0; i < reported.length; i++) {
                                                    var islatest = false;
                                                    for (var j = 0; j < docs2.length; j++) {
                                                        if (reported[i-k].id == docs2[j].id) {
                                                            islatest = true;
                                                            break;
                                                        }
                                                    }
                                                    if (!islatest) {
                                                        reported.splice(i, 1);
                                                        k++;
                                                    }
                                                }
                                                // 新しいreportがlatestに入っていて、かつすでにreportされてなければ保存。
                                                for (var i = 0; i < docs2.length; i++) {
                                                    if (user[0].id == docs2[i].id) {
                                                        var isme = false;
                                                        for (var j = 0; j < reported.length; j++) {
                                                            if (user[0].id == reported[j].id) {
                                                                isme = true;
                                                                break;
                                                            }
                                                        }
                                                        if (!isme) {
                                                            var point = calcPoint(val, num_my_report);
                                                            reported.unshift({id: user[0].id, content: val, point: point});
                                                            he[0].save();
                                                        }
                                                        break;
                                                    }
                                                }
                                                // 彼の得点を算出し、60以上だったらフラグを立てる
                                                var totalpoint = 0;
                                                for (var i = 0; i < reported.length; i++) {
                                                    totalpoint = totalpoint + reported[i].point;
                                                }
                                                if (totalpoint >= 60) {
                                                    if (he[0].reportflag == 0) {
                                                        he[0].reportflag = 3;
                                                        he[0].reportdate.unshift(new Date());
                                                        he[0].save();
                                                    }  
                                                }
                                            } else {
                                                console.log(err);
                                            }
                                        });
                                    }
                                } else {
                                    console.log(err);
                                }
                            });
                        } else {
                            console.log(err);
                        }
                    }); 
                    res.json({stat: "ok"});
                } else {
                    res.json({stat: "ng"});
                }
            } else {
                res.json({stat: "ng"});
            }
        } else {
            //console.log("not login");
        }
    });
});

function calcPoint(val, num) {
    var point = 0;
    switch (val) {
        case "gh": point = 30; break;
        case "ha": point = 20; break;
        case "ad": point = 20; break;
        case "ot": point = 15; break; 
        default: point = 0;
    }
    var minus = num * 5;
    point = point - minus;
    if (point < 0) {
        point = 0;
    }
    return point;
}

module.exports = router;
