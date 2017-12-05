if (isMobile) {
    $("#hint").html("Hint: Tap country to show people you've talked with.");
}

var change_bar_flag = true;
var mapdict;
$.ajax({
    url: '/map',
    type: 'POST',
    success: function(data) {
        if (!data.err) {
            mapdict = data.info;
            makemap();
        }
    }
});

var my_countries = {};
function makemap() {
    for (key in mapdict) {
        if (mapdict[key].length > 0) {
            my_countries[key] = mapdict[key].length;
        }
    }
    getready();
}

function getready() {
    // ４色に塗り分けする
    var colors = {};
    var counter = 0;
    for (var key in my_countries) { 
        var color_num = counter % 4;
        var color;
        switch (color_num) {
            case 0:
                color = "#f5eb28";
                break;
            case 1:
                color = "#46af4b";
                break;
            case 2:
                color = "#28b9e6";
                break;
            case 3:
                color = "#dc1482";
                break;
        }
        colors[key] = color;
        counter++;
    }

    $(function() {
        $('#world').vectorMap({
            map: 'world_en',
            backgroundColor: null,
            color: '#ffffff', 
            colors: colors,
            hoverOpacity: 0.7,
            selectedColor: '#8c8c8c',
            enableZoom: true,
            showTooltip: true,
            onRegionClick: function(element, code, region) {
                // 話した相手がいる国をクリックすると上部バーを固定でき、どこかの国をクリックすると解除される。
                // mobileのときは常にタップしたら変わるように
                if (change_bar_flag) {
                    if (my_countries[code] > 0) {
                        if (!isMobile) {
                            change_bar_flag = false;
                        } 
                    }  
                } else {
                    change_bar_flag = true;
                }
            }
        });
    });

    $('#world').bind('regionMouseOver.jqvmap', 
        function(event, code, region)
        {
            if (change_bar_flag) { // クリックされたときは動作しないように
                if (my_countries[code] > 0) {
                    var num_persons = my_countries[code]; // 人数の合計
                    var person_str = num_persons == 1 ? "person" : "persons";
                    $('#dialog').html(""); // 前の表示を消す
                    $('#dialog').html('<div id="youtalked" class="green">You talked <span class="emphasis2 yellow_font">' + my_countries[code] + "</span> "+person_str+"<br/>&nbsp;&nbsp;in <span class='emphasis2 yellow_font'>" + region + "</span></div><div id='images'></div>");
                    // 写真を入れる
                    var rest_width = 950 - ($('#youtalked').width() + 20);
                    if (isMobile) {
                        rest_width = window.innerWidth - ($('#youtalked').width() + 20);
                    }
                    var image_max = Math.floor(rest_width / 40); // 表示可能な最大枚数を算出
                    var num_photos = image_max < num_persons ? image_max : num_persons; // どちらか小さい方に合わせる
                    for (var i = 0; i < num_photos; i++) {
                        var image = image_url + mapdict[code][i] + ".jpeg";
                        $('#images').append('<span onclick="clickphoto('+"'"+mapdict[code][i]+"'"+')"><img src='+ image +' width="40" height="40" alt="face0"></span>');
                    }
                    // 写真が無い or ロードに失敗した時はうさぎの画像を挿入
                    $('img').error(function(){
                        $(this).attr('src', makeRapidsUrl()); // conf.jsより
                    });
                }
            }
        }
    );
}

function clickphoto(id) {
    var data = {id: id};
    $.ajax({
        url: '/map/pinfo',
        type: 'POST',
        success: function(data) {
            if (data.info) {
                openPersonInfo(data.info);
            }
        },
        data: data,
        dataType: 'json'
    });
}
