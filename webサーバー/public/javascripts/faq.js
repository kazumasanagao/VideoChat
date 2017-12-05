$("#q_table li").click(function(){
　  $(".answers",this).slideToggle(25);
});
// first画面のcontact usから遷移してきたとき
if (window.location.search == "?q=openchat") {
    openChatOfficial();
}