var isMobile = false;
if (window.parent.screen.width < 450) {
    isMobile = true;
    if (document.getElementById("bodycss")) {
        document.getElementById("bodycss").href = "../stylesheets/body_mob.css";
    }
    if (document.getElementById("policycss2")) {
        document.getElementById("policycss2").href = "../stylesheets/policy_mob2.css";
    }
    if (document.getElementById("settingscss")) {
        document.getElementById("settingscss").href = "../stylesheets/settings_mob.css";
    }
    if (document.getElementById("headercss")) {
        document.getElementById("headercss").href = "../stylesheets/header_mob.css";
    }
    if (document.getElementById("controlBarcss")) {
        document.getElementById("controlBarcss").href = "../stylesheets/controlBar_mob.css";
    }
    if (document.getElementById("controlBarcss")) {
        document.getElementById("controlBarcss").href = "../stylesheets/controlBar_mob.css";
    }
    if (document.getElementById("personListcss")) {
        document.getElementById("personListcss").href = "../stylesheets/personList_mob.css";
    }
    if (document.getElementById("twoRowscss")) {
        document.getElementById("twoRowscss").href = "../stylesheets/twoRows_mob.css";
    }
    if (document.getElementById("thirdRowcss")) {
        document.getElementById("thirdRowcss").href = "../stylesheets/thirdRow_mob.css";
    }
    if (document.getElementById("chatcss")) {
        document.getElementById("chatcss").href = "../stylesheets/chat_mob.css";
    }
    if (document.getElementById("talkcss")) {
        document.getElementById("talkcss").href = "../stylesheets/talk_mob.css";
    }
    if (document.getElementById("reportcss")) {
        document.getElementById("reportcss").href = "../stylesheets/report_mob.css";
    }
    if (document.getElementById("logincss")) {
        document.getElementById("logincss").href = "../stylesheets/login_mob.css";
    }
    if (document.getElementById("faqcss")) {
        document.getElementById("faqcss").href = "../stylesheets/faq_mob.css";
    }
    if (document.getElementById("mapcss")) {
        document.getElementById("mapcss").href = "../stylesheets/map_mob.css";
    }
}