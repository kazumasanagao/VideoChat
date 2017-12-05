var crypto = require('crypto');
var Users = require('./dbModel.js').Users;

var makeKey = function() {
    return crypto.randomBytes(32).toString('hex');
}
var makeHash = function(id, key) {
    return crypto.createHmac('sha256', key).update(id).digest('hex');  
}
var encrypt = function(id, key) {
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var crypted = cipher.update(id, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
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
            Users.find({id:id}, null, {limit:1},function(err, docs) {
                if(!err) {
                    if (docs[0]) {
                        var key = docs[0].key;
                        if (!key) {key = "";}
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

var decrypt = function(email_encry) {
    phone_key = 'IOUJfann095qa3t8paf32lPH8';
    decipher = crypto.createDecipher('aes-256-cbc', phone_key);
    dec = decipher.update(email_encry, 'hex', 'utf-8');
    dec += decipher.final('utf-8');
    return dec;
}

module.exports = {
    makeKey: makeKey,
    makeHash: makeHash,
    encrypt: encrypt,
    decrypt: decrypt,
    getUser: getUser
}