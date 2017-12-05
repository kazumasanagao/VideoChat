var express = require('express');
var router = express.Router();
var userCheck = require('./userCheck.js');
var Users = require('./dbModel.js').Users;
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
            res.render('map', {script: ""});
        } else if (getUser && !getUser[0].nickname) {
            res.render('map',{script: "noSettings()"});
        } else {
            res.render('map',{script: "demo()"});
        }
    });
});

router.post('/', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(getUser) {
        if (getUser && getUser[0].nickname && getUser[0].reportflag != 1 && getUser[0].reportflag != 2) {
            var myid = getUser[0].id;
            var query = {id: myid};
            var projections = {
                _id: 0,
                historyCo: 1
            }
            Users.findOne(query, projections, null, function(err, doc) {
                if (!err) {
                    if (doc) {
                        res.json({info: doc.historyCo});
                    } else {
                        //console.log("no result");
                    }
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

router.post('/pinfo', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(getUser) {
        if (getUser && getUser[0].nickname && getUser[0].reportflag != 1 && getUser[0].reportflag != 2) {
            var plist = [];
            for (var k in getUser[0].historyTi) {
                plist.push(k);
            }
            if (plist.indexOf(req.body.id) != -1) {
                var query = {id: req.body.id, nickname: {$ne: null}};
                var projections = {_id: 0,id: 1,nickname: 1,country: 1,shortBio: 1,longBio: 1,languages: 1,gender: 1};
                Users.find(query, projections, {limit:1}, function(err, he) {
                    if (he[0]) {
                        res.json({info: he[0]});
                    } else {
                        res.json({info: null});
                    }
                });
            } else {
                res.json({info: null});
            }
        } else {
            //console.log("not login");
        }
    });
});

module.exports = router;
