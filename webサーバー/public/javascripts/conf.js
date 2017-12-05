// テスト
var image_url = "https://s3-ap-northeast-1.amazonaws.com/test.kaz.ryukyu/";
const cookieSecure = "";
const stun_url = "";
const signaling_url = "localhost:8080";
var s;
if ("io" in this) {
    s = io.connect('http://localhost:8080');
}
const fb_appId = "561681177322998";

// 本番
/*
var image_url = "https://s3-ap-northeast-1.amazonaws.com/images.chample.in/";
const cookieSecure = ";secure";
const stun_url = "stun:stun.l.google.com:19302"; // stun:stun.chample.in:80
const signaling_url = "https://signaling.chample.in:443";
var s;
if ("io" in this) {
    s = io.connect('https://signaling.chample.in:443/');
}
const fb_appId = "1104701229596731";
*/

const digitsConsumerKey = 'eJWVrJfUDtv7KONchFg2EamWe';
const countryMap = {ae:"United Arab Emirates",af:"Afghanistan",ag:"Antigua and Barbuda",al:"Albania",am:"Armenia",ao:"Angola",ar:"Argentina",at:"Austria",au:"Australia",az:"Azerbaijan",ba:"Bosnia and Herzegovina",bb:"Barbados",bd:"Bangladesh",be:"Belgium",bf:"Burkina Faso",bg:"Bulgaria",bi:"Burundi",bj:"Benin",bn:"Brunei Darussalam",bo:"Bolivia",br:"Brazil",bs:"Bahamas",bt:"Bhutan",bw:"Botswana",by:"Belarus",bz:"Belize",ca:"Canada",cd:"Democratic Republic of the Congo",cf:"Central African Republic",cg:"Republic of the Congo",ch:"Switzerland",ci:"Cote d$prime;Ivoire",cl:"Chile",cm:"Cameroon",cn:"China",co:"Colombia",cr:"Costa Rica",cu:"Cuba",cv:"Cape Verde",cy:"Cyprus",cz:"Czech Republic",de:"Germany",dj:"Djibouti",dk:"Denmark",dm:"Dominica",do:"Dominican Republic",dz:"Algeria",ec:"Ecuador",ee:"Estonia",eg:"Egypt",er:"Eritrea",es:"Spain",et:"Ethiopia",fi:"Finland",fj:"Fiji",fk:"Falkland Islands",fr:"France",ga:"Gabon",gb:"United Kingdom",gd:"Grenada",ge:"Georgia",gf:"French Guiana",gh:"Ghana",gl:"Greenland",gm:"Gambia",gn:"Guinea",gq:"Equatorial Guinea",gr:"Greece",gt:"Guatemala",gw:"Guinea-Bissau",gy:"Guyana",hn:"Honduras",hr:"Croatia",ht:"Haiti",hu:"Hungary",id:"Indonesia",ie:"Ireland",il:"Israel",in:"India",iq:"Iraq",ir:"Iran",is:"Iceland",it:"Italy",jm:"Jamaica",jo:"Jordan",jp:"Japan",ke:"Kenya",kg:"Kyrgyz Republic",kh:"Cambodia",km:"Comoros",kn:"Saint Kitts and Nevis",kp:"North Korea",kr:"South Korea",kw:"Kuwait",kz:"Kazakhstan",la:"Lao People&prime;s Democratic Republic",lb:"Lebanon",lc:"Saint Lucia",lk:"Sri Lanka",lr:"Liberia",ls:"Lesotho",lt:"Lithuania",lv:"Latvia",ly:"Libya",ma:"Morocco",md:"Moldova",mg:"Madagascar",mk:"Macedonia",ml:"Mali",mm:"Myanmar",mn:"Mongolia",mr:"Mauritania",mt:"Malta",mu:"Mauritius",mv:"Maldives",mw:"Malawi",mx:"Mexico",my:"Malaysia",mz:"Mozambique",na:"Namibia",nc:"New Caledonia",ne:"Niger",ng:"Nigeria",ni:"Nicaragua",nl:"Netherlands",no:"Norway",np:"Nepal",nz:"New Zealand",om:"Oman",pa:"Panama",pe:"Peru",pf:"French Polynesia",pg:"Papua New Guinea",ph:"Philippines",pk:"Pakistan",pl:"Poland",pt:"Portugal",py:"Paraguay",qa:"Qatar",re:"Reunion",ro:"Romania",rs:"Serbia",ru:"Russian Federation",rw:"Rwanda",sa:"Saudi Arabia",sb:"Solomon Islands",sc:"Seychelles",sd:"Sudan",se:"Sweden",si:"Slovenia",sk:"Slovakia",sl:"Sierra Leone",sn:"Senegal",so:"Somalia",sr:"Suriname",st:"Sao Tome and Principe",sv:"El Salvador",sy:"Syrian Arab Republic",sz:"Swaziland",td:"Chad",tg:"Togo",th:"Thailand",tj:"Tajikistan",tl:"Timor-Leste",tm:"Turkmenistan",tn:"Tunisia",tr:"Turkey",tt:"Trinidad and Tobago",tw:"Taiwan",tz:"Tanzania",ua:"Ukraine",ug:"Uganda",us:"United States of America",uy:"Uruguay",uz:"Uzbekistan",ve:"Venezuela",vn:"Vietnam",vu:"Vanuatu",ye:"Yemen",za:"South Africa",zm:"Zambia",zw:"Zimbabwe"}
const languagesMap = {en:"English",ar:"Arabic",zh:"Chinese",fr:"French",de:"German",hi:"Hindi",ja:"Japanese",pt:"Portuguese",ru:"Russian",es:"Spanish"};
const rapids_url = "../images/rapids/";
const ring_sound_url = "../sounds/ring.mp3";
const onchat_sound_url = "../sounds/onchat.mp3";
const eachchat_sound_url = "../sounds/eachchat.mp3";

function makeRapidsUrl() {
    var random = Math.floor(Math.random() * 10) % 5;
    return rapids_url + "rapid" + random + ".png";
}

var regionMap = {
    as:['bd', 'bt', 'bn', 'kh', 'cn', 'in', 'id', 'jp', 'la', 'my', 'mv', 'mn', 'mm', 'np', 'kp', 'pk', 'pg', 'ph', 'kr', 'lk', 'tw', 'th', 'tl', 'vn', 'ye'],
    af:['dz', 'ao', 'bj', 'bw', 'bf', 'bi', 'cm', 'cv', 'cf', 'td', 'km', 'ci', 'cd', 'dj', 'eg', 'gq', 'er', 'et', 'ga', 'gm', 'gh', 'gn', 'gw', 'ke', 'ls', 'lr', 'ly', 'mg', 'mw', 'ml', 'mr', 'mu', 'ma', 'mz', 'na', 'ne', 'ng', 'cg', 're', 'rw', 'st', 'sn', 'sc', 'sl', 'so', 'za', 'sd', 'sr', 'tz', 'tg', 'tn', 'ug', 'zm', 'zw'],
    eu:['al', 'am', 'at', 'az', 'by', 'be', 'ba', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'ge', 'de', 'gr', 'gl', 'hu', 'is', 'ie', 'it', 'kz', 'kg', 'lv', 'lt', 'mk', 'mt', 'md', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'rs', 'sk', 'si', 'es', 'sz', 'se', 'ch', 'tj', 'tm', 'ua', 'gb', 'uz'],
    lc:['ag', 'ar', 'bs', 'bb', 'bz', 'bo', 'br', 'cl', 'co', 'cr', 'cu', 'dm', 'do', 'ec', 'sv', 'fk', 'gf', 'gd', 'gt', 'gy', 'ht', 'hn', 'jm', 'mx', 'ni', 'pa', 'py', 'pe', 'kn', 'lc', 'tt', 'uy', 've'],
    na:['ca', 'us'],
    oc:['au', 'fj', 'pf', 'nc', 'nz', 'sb', 'vu'],
    me:['af', 'ir', 'iq', 'il', 'jo', 'kw', 'lb', 'om', 'qa', 'sa', 'sy', 'tr', 'ae']
};