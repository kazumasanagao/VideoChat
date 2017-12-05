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
        } else if (getUser[0] && !getUser[0].nickname) {
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
            var starred_row = req.body.starred;
            var starred = starred_row == "true" ? true : false;

            var query = querymaker.makeQuery(language, gender, region, country, freeword, userlangs, null);
            query.joinflag = true;
            if (starred) { query.id = {$in: getUser[0].star}; }
            var projections = {_id: 0,id: 1,nickname: 1,country: 1,shortBio: 1,longBio: 1,languages: 1,gender: 1};
            
            Users.find(query, projections, {sort: {joinTime: 1}},function(err, docs) {
                if (!err) {
                    res.json({info: docs, stars: getUser[0].star, userlangs: userlangs});
                } else {
                    res.json({info: ''});
                }
            });
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
