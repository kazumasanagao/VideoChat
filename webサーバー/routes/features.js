var express = require('express');
var router = express.Router();
var userCheck = require('./userCheck.js');

router.get('/', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(getUser) {
        if (getUser) {
            res.render('first',{islogin:true});
        } else {
            res.render('first',{islogin:false});
        }
    });
});

module.exports = router;
