var crypto = require('crypto');
var Users = require('./dbModel.js').Users;

// Userがいれば、そのdocsを返す。いなければfalse。
var getUser = function(cookie, fn) {
    var islogin = false;
    if (!cookie) {
        fn(islogin);
    } else {
        var vals = cookie.split(":");
        if (vals.length != 2) {
            fn(islogin);
        } else {
            var id = vals[0];
            var hash = vals[1];
            Users.find({id:id}, null, {limit:1}, function(err, docs) {
                if(!err) {
                    if (docs[0]) {
                        var key = docs[0].key;
                        var hash_calc = crypto.createHmac('sha256', key).update(id).digest('hex');
                        if (hash == hash_calc) {
                            islogin = docs;
                        }
                    }
                }
                fn(islogin);
            });
        }
    }
}

module.exports = {
    getUser: getUser
}