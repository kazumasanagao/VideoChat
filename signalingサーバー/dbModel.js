var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var conf = require('./conf.js');

var userSchema = new Schema({
    id: String,
    fbid: String,
    fbemail: String,
    fbdata: {
        fbnickname: String,
        fbcountry: String,
        fblanguage: String,
        fbgender: String,
        fbphotourl: String
    },
    email: String,
    key: String,
    nickname: String,
    country: String,
    shortBio: String,
    longBio: String,
    languages: [String],
    gender: String,
    keeplogin: Boolean,
    roomname: Number,
    loginflag: Number,
    joinflag: Boolean,
    joinTime: Date,
    lastlogin: Date,
    historyCo: {af:[String],al:[String],dz:[String],ao:[String],ag:[String],ar:[String],am:[String],au:[String],at:[String],az:[String],bs:[String],bd:[String],bb:[String],by:[String],be:[String],bz:[String],bj:[String],bt:[String],bo:[String],ba:[String],bw:[String],br:[String],bn:[String],bg:[String],bf:[String],bi:[String],kh:[String],cm:[String],ca:[String],cv:[String],cf:[String],td:[String],cl:[String],cn:[String],co:[String],km:[String],cr:[String],ci:[String],hr:[String],cu:[String],cy:[String],cz:[String],cd:[String],dk:[String],dj:[String],dm:[String],do:[String],ec:[String],eg:[String],sv:[String],gq:[String],er:[String],ee:[String],et:[String],fk:[String],fj:[String],fi:[String],fr:[String],gf:[String],pf:[String],ga:[String],gm:[String],ge:[String],de:[String],gh:[String],gr:[String],gl:[String],gd:[String],gt:[String],gn:[String],gw:[String],gy:[String],ht:[String],hn:[String],hu:[String],is:[String],in:[String],id:[String],ir:[String],iq:[String],ie:[String],il:[String],it:[String],jm:[String],jp:[String],jo:[String],kz:[String],ke:[String],kw:[String],kg:[String],la:[String],lv:[String],lb:[String],ls:[String],lr:[String],ly:[String],lt:[String],mk:[String],mg:[String],mw:[String],my:[String],mv:[String],ml:[String],mt:[String],mr:[String],mu:[String],mx:[String],md:[String],mn:[String],ma:[String],mz:[String],mm:[String],na:[String],np:[String],nl:[String],nc:[String],nz:[String],ni:[String],ne:[String],ng:[String],kp:[String],no:[String],om:[String],pk:[String],pa:[String],pg:[String],py:[String],pe:[String],ph:[String],pl:[String],pt:[String],qa:[String],cg:[String],re:[String],ro:[String],ru:[String],rw:[String],kn:[String],lc:[String],st:[String],sa:[String],sn:[String],rs:[String],sc:[String],sl:[String],sk:[String],si:[String],sb:[String],so:[String],za:[String],kr:[String],es:[String],lk:[String],sd:[String],sr:[String],sz:[String],se:[String],ch:[String],sy:[String],tw:[String],tj:[String],tz:[String],th:[String],tl:[String],tg:[String],tt:[String],tn:[String],tr:[String],tm:[String],ug:[String],ua:[String],ae:[String],gb:[String],us:[String],uy:[String],uz:[String],vu:[String],ve:[String],vn:[String],ye:[String],zm:[String],zw:[String]},
    historyTi: {},
    star: [String],
    block: [String],
    reporting: [new Schema({
        id: String,
        content: String
    }, {_id: false})],
    reported: [new Schema({
        id: String,
        content: String,
        point: Number
    }, {_id: false})],
    reportflag: {type: Number, default: 0},
    reportdate: [Date],
    lockuntil: Date,
    validation: {
        issuedate: Date,
        token: Number,
        mistake: Number
    }
});
mongoose.model('users', userSchema);

var chatSchema = new Schema({
    id0: String,
    id1: String,
    read: {
        id0: Boolean,
        id1: Boolean
    },
    chats:[new Schema({
        from: Number,
        text: String,
        time: Date,
    }, {_id: false})],
    last: {
        from: Number,
        text: String,
        time: Date 
    }
});
mongoose.model('chats', chatSchema);

var dbUsers = mongoose.createConnection(conf.mongoUsers);
var Users = dbUsers.model('users');

var dbChats = mongoose.createConnection(conf.mongoChats);
var Chats = dbChats.model('chats');

module.exports = {
    Users: Users,
    Chats: Chats
}