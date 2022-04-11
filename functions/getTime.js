// 참고 : https://www.delftstack.com/ko/howto/javascript/javascript-convert-timestamp-to-date/
function getYYMMDD()
{
    const date = new Date()
    var year = date.getFullYear().toString(); //년도 뒤에 두자리
    var month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
    var day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
    return year+"-"+month+"-"+day;
}

function getHHMMSS()
{
    const date = new Date()
    var hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
    var minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
    var second = ("0" + date.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)
    return hour+":"+minute+":"+second;
}

function get2weeks()
{   
    weeks = [];
    let today = getYYMMDD();
    today = new Date(today)
    for(var i = 0; i < 14; i++)
    {
        today.setDate(today.getDate()-1);
        weeks.push(new Date(today).toISOString().slice(0,10));
    }
    return weeks;
}

// weeks = get2weeks();
// console.log(weeks);

// console.log(getYYYYMMDD());
// console.log(getHHMMSS());

module.exports = {
    getYYMMDD : getYYMMDD,
    getHHMMSS : getHHMMSS,
    get2weeks : get2weeks
}