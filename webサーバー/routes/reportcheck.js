var Users = require('./dbModel.js').Users;

setInterval(reportcheck, 172800000); // 2日おきにチェック

function reportcheck() {
    var query = {};
    query.reportflag = 3;
    var now = new Date();
    Users.find(query, {reportflag:1,reportdate:1}, null, function(err, docs) {
        if (!err) {
            for (var i = 0; i < docs.length; i++) {
                if (now - docs[i].reportdate[0] > 86400000) {// 1日以上経ったもの
                    docs[i].reportflag = 2;
                    docs[i].save();
                }
            }
        } else {
            console.log(err);
        }
    });
}

function report2to1(user) {
    user[0].reportflag = 1;
    var dates = user[0].reportdate;
    var times = 0;
    var duration = 0;
    var now = new Date();
    for (var i = 0; i < dates.length; i++) {
        if (now - dates[i] < 7776000000) { // 90日以内のban回数
            times++;
        } else { break; }
    }
    switch (times) {
        case 0: duration = 0; break;
        case 1: duration = 259200000; break; // 3日間
        case 2: duration = 604800000; break; // 7日間
        default: duration = 1209600000; // 14日間
    }
    user[0].lockuntil = new Date(now.getTime() + duration);
    user[0].save();
}

module.exports = {
    report2to1: report2to1,
}
