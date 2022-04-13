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
            user: 'kookminaid17@gmail.com',  // gmail 계정 아이디를 입력
            pass: 'kookminAID17!'          // gmail 계정의 비밀번호를 입력
        }
    });

    let mailOptions = {
        from: 'kookminaid17@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
        to: email,                     // 수신 메일 주소
        subject: 'AID 우울증 판단 결과',   // 제목
        html: `<h1>2주간의 우울증 판단 결과 우울증 위험도가 높습니다</h1>
          <div>
            아래 버튼을 눌러 보호자 인증을 완료해주세요.
          </div>`,
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

    res.redirect("/");
})

module.exports = router;