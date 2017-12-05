var userCheck = require('./userCheck.js');
var Users = require('./dbModel.js').Users;
var Chats = require('./dbModel.js').Chats;
var countries = require('./conf.js').countries;
var regionMap = require('./conf.js').regionMap;


var port = 8080;
var io = require('socket.io').listen(port);
console.log((new Date()) + " Server is listening on port " + port);

/*
var port = 443;
var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync(__dirname + '/keys/signaling.key_np.pem', 'utf-8').toString(),
    cert: fs.readFileSync(__dirname + '/keys/server2.pem', 'utf-8').toString(),
    ca: fs.readFileSync(__dirname + '/keys/intermediate.crt', 'utf-8').toString()
};
var server = https.createServer(options);
io = require('socket.io').listen(server);
server.listen(443);
console.log((new Date()) + " Server is listening on port " + port);
*/
/* 本番で使用。エラーが起きても、サーバー落ちないように。
var http = require("http");
var fs = require("fs");
process.on('uncaughtException', function(err) {
    console.log(err);
});
*/



var roomCache = {}; // room:1
var busyman = {}; // id:1or2 消極的busyを１、積極的busyを２とする
var autoroom = [];

io.sockets.on('connection', function(socket) {
    socket.on('alive', function (data) {
        userCheck.getUser(data, function(user) {
            if (user) {
                var joinflag = user[0].joinflag;
                if (user[0].loginflag == 1) {
                    // updateメソッドでuser[0]をupdateしようとすると、user[0]内にschema.type.mixedがあるため、検索に失敗し、updateできない。
                    user[0].lastlogin = new Date();
                    user[0].save();
                    // testのときは、signalingサーバーを落とすことで、flagが1のまま残ってるやつが新規でくる可能性があるので、これが必要
                    socket.myid = user[0].id;
                    socket.mycountry = user[0].country;
                    socket.roomname = user[0].roomname;
                    socket.join(user[0].roomname);
                } else if (user[0].loginflag == 2) {
                    user[0].loginflag = 1;
                    user[0].lastlogin = new Date();
                    user[0].save();
                    socket.myid = user[0].id;
                    socket.mycountry = user[0].country;
                    socket.roomname = user[0].roomname;
                    socket.join(user[0].roomname);
                    var autostat = "off";
                    for (var i = 0; i < autoroom.length; i++) {
                        if (autoroom[i].id == socket.myid) {
                            autostat = "on";
                            break;
                        }
                    }
                    emitMessageMeOnly("autostat", autostat);
                    // リロード時にbusymanの1が残ってたら、破棄
                    if (busyman[user[0].id] == 1) {
                        delete busyman[user[0].id];
                    }
                } else {
                    var roomname = makeRoomname(); 

                    socket.myid = user[0].id;
                    socket.mycountry = user[0].country;
                    socket.roomname = roomname;
                    socket.join(roomname);

                    user[0].roomname = roomname;
                    user[0].loginflag = 1;
                    user[0].joinflag = false;
                    user[0].lastlogin = new Date();
                    user[0].save();

                    // もしログインした時点でbusymanが残ってたら、それはゴミなので捨てる
                    if (busyman[user[0].id]) {
                        delete busyman[user[0].id];
                    }
                }
                var isbusynow = busyman[socket.myid] == 2;
                emitMessageMeOnly("busynowstat", isbusynow); 
                emitMessageMeOnly("joinstat", {join: joinflag});
            } else {
                //console.log(no user);
            }
        });
    });

    socket.on('disconnect', function() {
        var myid = socket.myid;
        var roomname = socket.roomname;
        Users.find({id:myid},{loginflag:1}, {limit:1}, function(err, user) {
            if(!err) {
                if (user[0]) {
                    user[0].loginflag = 2;
                    user[0].save();
                    setTimeout(function() {
                        // 10秒経ってもまだ２だったら、画面を閉じたと考える。
                        // 上のuserは10秒前の情報を格納しているため、再度クエリを発行しなければならない。
                        Users.find({id:myid},{id:1,loginflag:1,roomname:1,joinflag:1}, {limit:1}, function(err, user2) {
                            if(!err) {
                                if (user2[0]) {
                                    if (user2[0].loginflag == 2) {
                                        user2[0].roomname = null;
                                        user2[0].loginflag = 0;
                                        user2[0].joinflag = false;
                                        user2[0].save();
                                        if (roomCache[roomname]) {
                                            delete roomCache[roomname];
                                        }
                                        if (busyman[user2[0].id]) {
                                            delete busyman[user2[0].id];
                                        }
                                        for (var i = 0; i < autoroom.length; i++) {
                                            if (socket.myid == autoroom[i].id) {
                                                autoroom.splice(i, 1);
                                                break;
                                            }
                                        }
                                        emitEverybody("roomout", {person: {id: user2[0].id}});
                                    }
                                }
                            } else {
                                console.log(err);
                            }
                        });  
                    }, 10000);
                } else {
                    //console.log("no or several man");
                }
            } else {
                console.log(err);
            }
        });
    });

    socket.on('joinroom', function() {
        var projections = {joinflag:1,joinTime:1,id:1,nickname:1,country:1,gender:1,shortBio:1,longBio:1,languages:1};
        Users.find({id:socket.myid}, projections, {limit:1}, function(err, user) {
            if (user[0]) {
                var joinflag;
                if (user[0].joinflag) {
                    joinflag = false;
                    joinTime = null;
                } else {
                    joinflag = true;
                    joinTime = new Date();
                    // もしbusyの2だったら、busyを解除
                    if (busyman[socket.myid] == 2) {
                        delete busyman[socket.myid];
                        emitMessageMeOnly("busynowstat", false);
                    }
                }
                user[0].joinflag = joinflag;
                user[0].joinTime = joinTime;
                user[0].save();

                emitMessageMeOnly("joinstat", {join: joinflag});
                if (joinflag) {
                    emitEverybody("roomin", {person: {id: user[0].id,
                                                      nickname: user[0].nickname,
                                                      country: user[0].country,
                                                      gender: user[0].gender,
                                                      shortBio: user[0].shortBio,
                                                      longBio: user[0].longBio,
                                                      languages: user[0].languages
                    }});
                } else {
                    emitEverybody("roomout", {person: {id: user[0].id}});
                }
            } else {
                //console.log("not login");
            }
        });
    });

    socket.on('callrequest', function(id) {
        var projections = {id:1,nickname:1,country:1,shortBio:1,longBio:1,gender:1,languages:1,roomname:1,historyTi:1};
        Users.find({id:socket.myid}, projections, {limit:1},function(err, you) {
            if (!err) {
                if (you[0]  && socket.mycountry) {
                    Users.find({id:id}, {id:1,country:1,loginflag:1,joinflag:1,roomname:1,block:1}, {limit:1},function(err, he) {
                        if(!err) {
                            if (he[0]) {
                                var blocks = he[0].block ? he[0].block : [];
                                var isblock = blocks.indexOf(socket.myid) != -1 ? true : false;
                                if (isblock) {
                                    //console.log("I'm blocked.");
                                } else if (busyman[he[0].id]) {
                                    emitMessageMeOnly("callbut", 2);
                                } else if (he[0].loginflag == 0) {
                                    emitMessageMeOnly("callbut", 0);
                                // joinをしていなくて、履歴にない人にはcallできない
                                } else if (!he[0].joinflag && you[0].historyTi && !you[0].historyTi[he[0].id]) {
                                    emitMessageMeOnly("callbut", 1);
                                } else if (id == socket.myid) {
                                    emitMessageMeOnly("callbut", 3);
                                } else if (you[0].country == he[0].country) {
                                    emitMessageMeOnly("callbut", 4);
                                } else {
                                    var hisroom = he[0].roomname;
                                    socket.hisroom = hisroom;
                                    socket.hisid = he[0].id;
                                    var data = {
                                        id: you[0].id,
                                        nickname: you[0].nickname,
                                        country: you[0].country,
                                        shortBio: you[0].shortBio,
                                        longBio: you[0].longBio,
                                        gender: you[0].gender,
                                        languages: you[0].languages,
                                        roomname: you[0].roomname
                                    }
                                    emitMessage("receiveCall", data, hisroom);
                                    if (!busyman[socket.myid]) { busyman[socket.myid] = 1; }
                                    if (!busyman[socket.hisid]) { busyman[socket.hisid] = 1; }
                                }
                            } else {
                                //console.log("no him");
                            }
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    //console.log("not login");
                }
            } else {
                console.log(err);
            }
        });
    });

    socket.on('callanswer', function(data) {
        answer(data);
    });

    socket.on('automatch', function(data) {
        Users.find({id:socket.myid}, {nickname:1,languages:1,gender:1,country:1,block:1}, {limit:1},function(err, you) {
            if (!err) {
                if (you[0]) {
                    var isoff = false;
                    for (var i = 0; i < autoroom.length; i++) {
                        if (socket.myid == autoroom[i].id) {
                            autoroom.splice(i, 1);
                            emitMessageMeOnly("autostat", "off");
                            isoff = true;
                            break;
                        }
                    }
                    if (!isoff) {
                        // もしbusyの2だったら、busyを解除
                        if (busyman[socket.myid] == 2) {
                            delete busyman[socket.myid];
                            emitMessageMeOnly("busynowstat", false);
                        }

                        var ismatch = false;
                        var pref = {};
                        if (data) {
                            var rawpref = data.split(",");
                            for (var i = 0; i < rawpref.length; i++) {
                                var keyvals = rawpref[i].split(":");
                                if (keyvals[0] == "language") {
                                    if (!keyvals[1]) {
                                        pref.languages = you[0].languages;
                                    } else if (keyvals[1] != "al") {
                                        pref.languages = [keyvals[1]];
                                    } else {
                                        pref.languages = null;
                                    }
                                }
                                if (keyvals[0] == "gender") {
                                    if (keyvals[1] == "fe" || keyvals[1] == "ma") {
                                        pref.gender = keyvals[1];
                                    } else {
                                        pref.gender = null;
                                    }
                                }
                                if (keyvals[0] == "region") {
                                    if (keyvals[1]) {
                                        if (regionMap[keyvals[1]]) {
                                            pref.country = regionMap[keyvals[1]];
                                        } else {
                                            pref.country = null;
                                        }
                                    }
                                }
                                if (keyvals[0] == "country") {
                                    if (keyvals[1]) {
                                        pref.country = [keyvals[1]];
                                    }
                                }
                            }
                        } else {
                            pref.languages = null;
                            pref.gender = null;
                            pref.country = null;
                        }

                        for (var i = 0; i < autoroom.length; i++) {
                            var isblock = false;
                            for (var j = 0; j < you[0].block.length; j++) {
                                if (autoroom[i].id == you[0].block[j]) {
                                    isblock = true;
                                    break;
                                }
                            }
                            var issamecountry = you[0].country == autoroom[i].country;
                            if (!isblock && !issamecountry) {
                                if (!pref.gender || autoroom[i].gender == pref.gender) {
                                    var langmatch = false;
                                    if (pref.languages) {
                                        for (var j = 0; j < autoroom[i].languages.length; j++) {
                                            for (var k = 0; k < pref.languages.length; k++) {
                                                if (autoroom[i].languages[j] == pref.languages[k]) {
                                                    langmatch = true;
                                                    break;
                                                }
                                            }
                                            if (langmatch) {break;}
                                        }
                                    }
                                    if (langmatch || !pref.languages) {
                                        var countrymatch = false;
                                        if (pref.country) {
                                            for (var j = 0; j < pref.country.length; j++) {
                                                if (autoroom[i].country == pref.country[j]) {
                                                    countrymatch = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (countrymatch || !pref.country) {
                                            var isblock = false;
                                            for (var j = 0; j < autoroom[i].block.length; j++) {
                                                if (autoroom[i].block[j] == socket.myid) {
                                                    isblock = true;
                                                    break;
                                                }
                                            }
                                            if (!isblock) {
                                                if (!autoroom[i].pref.gender || autoroom[i].pref.gender == you[0].gender) {
                                                    var langmatch = false;
                                                    if (autoroom[0].pref.languages) {
                                                        for (var j = 0; j < you[0].languages.length; j++) {
                                                            for (var k = 0; k < autoroom[i].pref.languages.length; k++) {
                                                                if (you[0].languages[j] == autoroom[0].pref.languages[k]) {
                                                                    langmatch = true;
                                                                    break;
                                                                }
                                                            }
                                                            if (langmatch) {break;}
                                                        }
                                                    }
                                                    if (langmatch || !autoroom[i].pref.languages) {
                                                        var countrymatch = false;
                                                        if (autoroom[i].pref.country) {
                                                            for (var j = 0; j < autoroom[i].pref.country.length; j++) {
                                                                if (you[0].country == autoroom[i].pref.country[j]) {
                                                                    countrymatch = true;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        if (countrymatch || !autoroom[i].pref.country) {
                                                            ismatch = true;
                                                            emitMessageMeOnly('autofound', {id: autoroom[i].id, nickname: autoroom[i].nickname, country: autoroom[i].country});
                                                            emitMessage('foundnow', {id: socket.myid, roomname: socket.roomname, nickname: you[0].nickname, country: you[0].country}, autoroom[i].roomname);
                                                            emitMessageMeToo("autostat", "off", autoroom[i].roomname);
                                                            answer(autoroom[i]);
                                                            busyman[socket.myid] = 1;
                                                            busyman[autoroom[i].id] = 1;
                                                            autoroom.splice(i,1);
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        } 
                                    }
                                }
                            }
                        }
                        if (!ismatch) {
                            var me = {
                                id: socket.myid,
                                nickname: you[0].nickname,
                                roomname: socket.roomname,
                                languages: you[0].languages,
                                gender: you[0].gender,
                                country: you[0].country,
                                block: you[0].block,
                                pref: pref
                            }
                            autoroom.push(me);
                            emitMessageMeOnly("autostat", "on");
                        }
                    }
                }
            } else {
                console.log(err);
            }
        });
    });

    socket.on('sethisdata', function(data) {
        socket.hisid = data.id;
        socket.hisroom = data.roomname;
    });

    function answer(data) {
        Users.find({roomname:data.roomname}, {id:1,country:1,historyCo:1,historyTi:1,joinflag:1,joinTime:1}, {limit:1}, function(err, he) {
            if(!err) {
                if (he[0] && he[0].id == data.id && socket.mycountry) {
                    socket.hisroom = data.roomname;
                    socket.hisid = data.id;
                    var hiscountry = he[0].country;
                    var cudate = new Date();
                    emitMessage('openwindow', socket.myid, socket.hisroom);
                    emitMessageMeToo('ready', null, socket.hisroom);

                    // 相手のhistoryを更新
                    var isMe = he[0].historyCo[socket.mycountry].indexOf(socket.myid);
                    if (isMe != -1) {
                        he[0].historyCo[socket.mycountry].splice(isMe, 1);
                    }
                    he[0].historyCo[socket.mycountry].unshift(socket.myid);
                    if (!he[0].historyTi) {
                        he[0].historyTi = {}
                    }
                    he[0].historyTi[socket.myid] = cudate;
                    // Schema.Types.Mixedの要素を変更する時はmarkModifiedをつけないと変更したことがmongoose側で認知されない！
                    he[0].markModified('historyTi');
                    he[0].joinflag = false;
                    he[0].joinTime = null;
                    he[0].save();

                    // クッキーにセットする用のデータを作成
                    var cnum0 = 0;
                    var pnum0 = 0;
                    for (var key in countries) {
                        if (he[0].historyCo[key]) {
                            if (he[0].historyCo[key].length > 0){
                                cnum0++;
                                pnum0 += he[0].historyCo[key].length;
                            }
                        }
                    }
                    emitMessage('setCookie', {c_num: cnum0, p_num: pnum0}, socket.hisroom);

                    // 自分のhistoryとjoin状態を更新
                    Users.find({id:socket.myid}, {historyCo:1,historyTi:1,joinflag:1,joinTime:1}, {limit:1}, function(err, user) {
                        if (!err) {
                            if (user[0]) {
                                var isHim = user[0].historyCo[hiscountry].indexOf(socket.hisid);
                                if (isHim != -1) {
                                    user[0].historyCo[hiscountry].splice(isHim, 1);
                                }
                                user[0].historyCo[hiscountry].unshift(socket.hisid);
                                if (!user[0].historyTi) {
                                    user[0].historyTi = {}
                                }
                                user[0].historyTi[socket.hisid] = cudate;
                                user[0].markModified('historyTi');
                                user[0].joinflag = false;
                                user[0].joinTime = null;
                                user[0].save();

                                // クッキーにセットする用のデータを作成
                                var cnum1 = 0;
                                var pnum1 = 0;
                                for (var key in countries) {
                                    if (user[0].historyCo[key]) {
                                        if (user[0].historyCo[key].length > 0){
                                            cnum1++;
                                            pnum1 += user[0].historyCo[key].length;
                                        }
                                    }
                                }
                                emitMessageMeOnly('setCookie', {c_num: cnum1, p_num: pnum1});
                            } else {
                                //console.log("no me");
                            }
                        } else {
                            console.log(err);
                        } 
                    });
                    emitEverybody("roomout", {person: {id: socket.myid}});
                    emitEverybody("roomout", {person: {id: socket.hisid}});
                    emitMessageMeOnly("joinstat", {join: false});
                    emitMessage("joinstat", {join: false}, socket.hisroom);
                } else {
                    //console.log("no him");
                }
            } else {
                console.log(err);
            }
        });
    }

    socket.on('message', function(message) {
        emitMessage("message", message, socket.hisroom);
    });

    socket.on('chat', function(data) {
        // chatのときはsocket.hisidは使わないで、送信時データにこめたidを使う
        // 相手のroomもidから検索する。ルームがなければ、相手にsocket送信はせず、保存だけする。
        var hisid = data.person;
        if (hisid && socket.myid) {
            var escaped = escape(data.text);
            var time = new Date();
            var thisdata = {
                id: socket.myid,
                text: escaped,
                time: time
            }
            var query = {};
            var mynum,hisnum;

            Users.find({id: hisid}, {historyTi:1,loginflag:1,roomname:1,block:1}, {limit:1}, function(err, he) {
                if (!err) {
                    if((he[0] && he[0].historyTi && he[0].historyTi[socket.myid]) || hisid == "yg2ANmM6ok" || socket.myid == "yg2ANmM6ok") { // 通話履歴のある人か確認
                        var hisloginstat = he[0].loginflag;
                        var hisroom = he[0].roomname;
                        var blocks = he[0].block ? he[0].block : [];
                        var isblock = blocks.indexOf(socket.myid) != -1 ? true : false;
                        if ((hisloginstat == 1 || hisloginstat == 2) && hisroom && !isblock) {
                            emitMessage("hismessage", thisdata, hisroom);
                        }
                        emitMessageMeOnly("mymessage", thisdata);
                        // データベースに保存
                        var query = {$or:[{id0:socket.myid, id1: hisid},{id0: hisid, id1: socket.myid}]}
                        Chats.find(query, {id0:1,id1:1,read:1,chats:1,last:1}, {limit:1},function(err, chat) {
                            if (!err) {
                                if (chat[0]) {
                                    if (chat[0].id0 == socket.myid) {
                                        mynum = 0;
                                        hisnum = 1;
                                    } else {
                                        mynum = 1;
                                        hisnum = 0;
                                    }
                                    chat[0].read['id'+hisnum] = false;
                                    chat[0].chats.push({
                                        from: mynum,
                                        text: escaped,
                                        time: time
                                    });
                                    chat[0].last = {
                                        from: mynum,
                                        text: escaped,
                                        time: time
                                    }
                                    chat[0].save();
                                // データがまだない時は新規作成 
                                } else {
                                    var newchat = new Chats();
                                    newchat.id0 = socket.myid;
                                    newchat.id1 = hisid;
                                    newchat.read = {};
                                    newchat.read['id0'] = true;
                                    newchat.read['id1'] = false;
                                    newchat.chats = {
                                        from: 0,
                                        text: escaped,
                                        time: time
                                    };
                                    newchat.last = {
                                        from: 0,
                                        text: escaped,
                                        time: time
                                    }
                                    newchat.save();
                                }
                            } else {
                                console.log(err);
                            }
                        });
                    } else {
                        //console.log("no history with him")
                    }
                } else {
                    console.log(err);
                }
            });
        }
    });

    socket.on('closevideo', function() {
        if (socket.hisroom) {
            emitMessage("closevideo", null, socket.hisroom);
            delete socket.hisroom;
            delete socket.hisid;
        }
    });

    socket.on('busycheck', function(id) {
        Users.find({id:id}, {loginflag: 1, joinflag: 1}, {limit:1}, function(err, he) {
            if(!err) {
                if (he[0]) {
                    var res = {id: id};
                    if (he[0].loginflag == 0) {
                        res.stat = 0; // ログインしていない
                        emitMessageMeOnly("getbusystat", res);
                    } else {
                        Users.find({id:socket.myid}, {historyTi: 1}, {limit:1}, function(err2, user) {
                            if (!err2) {
                                if (user[0]) {
                                    if (!he[0].joinflag && user[0].historyTi && !user[0].historyTi[id]) {
                                        res.stat = 1; // joinしてない、かつ履歴にない
                                    } else {
                                        res.stat = busyman[id] ? 2 : 3; // 2:busy, 3:not busy
                                    }
                                    emitMessageMeOnly("getbusystat", res);
                                }
                            } else {
                                console.log(err2);
                            }
                        });
                    }
                }
            } else {
                console.log(err);
            }
        });
    });

    socket.on('removebusy', function(data) {
        var myid = socket.myid;
        if (busyman[myid] == 1) {
            delete busyman[myid];
        }
    });

    socket.on('busynow', function() {
        var myid = socket.myid;
        var busystat;
        if (busyman[myid] == 2) {
            delete busyman[myid];
            busystat = false;
        } else {
            busyman[myid] = 2;
            busystat = true;
            // busyになったときにroomから退出する。
            Users.find({id:myid}, {joinflag:1}, {limit:1}, function(err, user) {
                if (!err) {
                    if (user[0] && user[0].joinflag) {
                        user[0].joinflag = false;
                        user[0].save();
                        emitMessageMeOnly("joinstat", {join: false});
                        emitEverybody("roomout", {person: {id: myid}});
                    }
                } else {
                    console.log(err);
                }
            });
            // busyになったときにautomatchから退出する。
            for (var i = 0; i < autoroom.length; i++) {
                if (autoroom[i].id == socket.myid) {
                    autoroom.splice(i, 1);
                    break;
                }
            }
            emitMessageMeOnly("autostat", "off");
        }
        emitMessageMeOnly("busynowstat", busystat);
    });

    function emitEverybody(type, message) {
        io.sockets.emit(type, message);
    }

    function emitMessage(type, message, roomname) {
        socket.broadcast.to(roomname).emit(type, message);
    }

    function emitMessageMeToo(type, message, roomname) {
        socket.broadcast.to(roomname).emit(type, message);
        socket.emit(type, message);
    }
    function emitMessageMeOnly(type, message) {
        socket.emit(type, message);
    }  
});

function makeRoomname() {
    var roomname = Math.random();
    if (!roomCache[roomname]) {
        roomCache[roomname] = 1;
        return roomname;
    } else {
        makeRoomname();
    }
}

function escape(text) {
    return (text + "").
    replace(/&/g, "&amp;").
    replace(/&amp;amp;/g, "&amp;").
    replace(/</g, "&lt;");
}