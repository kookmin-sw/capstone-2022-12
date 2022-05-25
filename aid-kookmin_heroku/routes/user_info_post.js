var express = require('express');
var router = express.Router();


router.post("/info", function (req, res, next) {
    console.log('ffffffffff');
    console.log(req);
});

// 통계자료 보기
router.post('/info', (req, res) => {
    console.log(req);

    client.query('select date, emotion, talk from log where date BETWEEN DATE_ADD(NOW(),INTERVAL -2 WEEK ) AND NOW() AND user_Serial_Number=? ORDER BY date', [req.user_info.user_serial_Number], (err, data) => {
        try {
            console.log('통계자료 확인하기');
            let user_emotion = { "depressed": 0, "not_depressed": 0 };

            for (var i = 0; i < data.length; i++) {
                user_emotion[data[i]['emotion']] += 1
            }

            let last = data[data.length - 1];
            const last_time = last['date'];
            const last_emotion = last['emotion'];
            const last_text = last['talk'];

            res.render('info', {
                user_info: req.session.user_info,
                is_logined: req.session.is_logined,
                check: req.session.check,
                name: req.session.name,
                info_data: user_emotion,
                user_time: last_time,
                user_emotion: last_emotion,
                user_text: last_text
            });
        }

        catch (err) {
            console.log('error occured in data statistics page');
            res.write("<script>alert('there is no data')</script>");
            res.write("<script>window.location=\"/\"</script>");
            // res.redirect('/');

        }
    });
});

module.exports = router;