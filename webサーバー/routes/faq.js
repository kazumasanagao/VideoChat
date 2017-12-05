var express = require('express');
var router = express.Router();
var userCheck = require('./userCheck.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(getUser) {
        if (getUser && (getUser[0].reportflag == 1 || getUser[0].reportflag == 2)) {
            res.redirect('/faq/restrict');
        } else if (getUser) {
            res.render('faq', {script: ""});
        } else {
            res.render('faq', {script: "demo()"});
        }
    });
});

router.get('/restrict', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(getUser) {
        if (getUser && (getUser[0].reportflag == 1 || getUser[0].reportflag == 2)) {
            res.render('faq', {script: ""});
        } else if (getUser) {
            res.redirect('/faq');
        } else {
            res.render('faq', {script: "demo()"});
        }
    });
});

module.exports = router;
