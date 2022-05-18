const fs = require('fs');
const mysql = require('mysql');

var express = require('express');
const nodemailer = require('nodemailer');
var router = express.Router();

// db 연결
// const client = mysql.createConnection({
//     host: 'us-cdbr-east-05.cleardb.net',
//     user: 'be2446026e1d94',
//     password: 'a7902cb0',
//     database: 'heroku_d4b1a4548f6a83d'
// });

// client.connect((err) => {
//     if (err) {
//         console.log(err)
//         con.end();
//         throw err;
//     }
//     else { console.log("DB 연결 성공"); }
// });


var db_config = {
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'be2446026e1d94',
    password: 'a7902cb0',
    database: 'heroku_d4b1a4548f6a83d'
};
// var db_config = {
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: 'cnj140535',
//     database: 'aid_db'
// };

var client;

function handleDisconnect() {
    client = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.

    client.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    client.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

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