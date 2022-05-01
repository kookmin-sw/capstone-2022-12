const fs = require('fs');
const mysql = require('mysql');

var express = require('express');
const nodemailer = require('nodemailer');
var router = express.Router();

// db 연결
const client = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'cnj140535',
    database: 'aid_db'
});

client.connect((err) => {
    if (err) {
        console.log(err)
        con.end();
        throw err;
    }
    else { console.log("DB 연결 성공"); }
});


// 메일보내기
router.post("/sendmail_manager", function (req, res, next) {
    // let email = req.body.email; // 추후에 이렇게 수신자를 DB에서 가져올것
    let email

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'kookminaid17@gmail.com',  // gmail 계정 아이디를 입력
            pass: 'ekfbrnqmxkhzqjnd'          // gmail 계정의 비밀번호를 입력
        }
    });

    client.query('select Email from manager  where USER_Serial_Number=?', [req.session.serial_number], (err, data) => {
        let email = JSON.parse(JSON.stringify(data[0]))['Email'];

        let mailOptions = {
            from: 'kookminaid17@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
            to: email,                     // 수신 메일 주소
            subject: 'AID 우울증 판단 결과',   // 제목
            // html: html_content,
            text: "2주간의 우울증 판단 결과 우울증 위험도가 높습니다", // 내용
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    });


    res.write("<script>alert('mail send succeed')</script>");
    res.write("<script>window.location=\"..\"</script>");
    // res.redirect("/");
})

module.exports = router;