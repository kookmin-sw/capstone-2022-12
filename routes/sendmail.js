var express = require('express');
const nodemailer = require('nodemailer');
var router = express.Router();
// 메일보내기
router.post("/sendmail", function (req, res, next) {
    let email = req.body.email; // 추후에 이렇게 수신자를 DB에서 가져올것

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'wkdalsgur9812@gmail.com',  // gmail 계정 아이디를 입력
            pass: 'cnj140535!'          // gmail 계정의 비밀번호를 입력
        }
    });

    let mailOptions = {
        from: 'wkdalsgur9812@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
        to: email,                     // 수신 메일 주소
        subject: 'Sending Email using Node.js',   // 제목
        text: 'That was easy!'  // 내용
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.redirect("/");
})

module.exports = router;