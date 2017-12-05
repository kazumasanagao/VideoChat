// 17:09 Aug13, 2015
function dateFormat(rawdate) {
    var parsedDate = Date.parse(rawdate);
    var date = new Date(parsedDate);

    var hour = date.getHours();
    var min = date.getMinutes();
    var datea = date.getDate();
    var year = date.getFullYear();
    if (min < 10) {
        min = "0" + min;
    }
    var month = date.getMonth() + 1;
    var monthStr = "";
    switch (month) {
        case 1:monthStr = "Jan";break;
        case 2:monthStr = "Feb";break;
        case 3:monthStr = "Mar";break;
        case 4:monthStr = "Apr";break;
        case 5:monthStr = "May";break;
        case 6:monthStr = "Jun";break;
        case 7:monthStr = "Jul";break;
        case 8:monthStr = "Aug";break;
        case 9:monthStr = "Sep";break;
        case 10:monthStr = "Oct";break;
        case 11:monthStr = "Nov";break;
        case 12:monthStr = "Dec";break;
        default:monthStr = "Jan";
    }

    var datestring = hour+":"+min+" "+monthStr+datea+", "+year;
    return datestring;
}
// Aug13, 2015
function dateFormat2(rawdate) {
    var parsedDate = Date.parse(rawdate);
    var date = new Date(parsedDate);

    var hour = date.getHours();
    var min = date.getMinutes();
    var datea = date.getDate();
    var year = date.getFullYear();
    if (min < 10) {
        min = "0" + min;
    }
    var month = date.getMonth() + 1;
    var monthStr = "";
    switch (month) {
        case 1:monthStr = "Jan";break;
        case 2:monthStr = "Feb";break;
        case 3:monthStr = "Mar";break;
        case 4:monthStr = "Apr";break;
        case 5:monthStr = "May";break;
        case 6:monthStr = "Jun";break;
        case 7:monthStr = "Jul";break;
        case 8:monthStr = "Aug";break;
        case 9:monthStr = "Sep";break;
        case 10:monthStr = "Oct";break;
        case 11:monthStr = "Nov";break;
        case 12:monthStr = "Dec";break;
        default:monthStr = "Jan";
    }

    var datestring = monthStr+datea+", "+year;
    return datestring;
}