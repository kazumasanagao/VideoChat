var express = require('express');
var router = express.Router();
var userCheck = require('./userCheck.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    userCheck.getUser(req.cookies.id, function(getUser) {
        if (getUser && (getUser[0].reportflag == 1 || getUser[0].reportflag == 2)) {
            res.render('restrict',{release: getUser[0].lockuntil});
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
