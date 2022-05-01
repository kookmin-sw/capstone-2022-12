const fs = require('fs');
const mysql = require('mysql');
// const dbsetting = require('./dbsetting');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const encrypt = require('./functions/hashing.js').encrypt;
const decrypt = require('./functions/hashing.js').decrypt;
const getYYMMDD = require('./functions/getTime.js').getYYMMDD;
const getHHMMSS = require('./functions/getTime.js').getHHMMSS;
const get2weeks = require('./functions/getTime.js').get2weeks;
const FileStore = require('session-file-store')(session); 
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');
const sendMailRouter = require('./routes/sendmail');
const sendMailRouterManager = require('./routes/sendmail_manager');
const res = require('express/lib/response');
const request = require('request');
const axios = require('axios');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

function getSortedDate(date)
{
    keys = [];
    for(key in date)
    {
        keys.push(key);
    }
    keys.sort().reverse();
    return keys;
}

// express 설정 1
const app = express();


// db 생성
// dbsetting.dbinit();

// db 연결 2
const client = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'cnj140535',
    database: 'aid_db'
});

client.connect((err) => {
    if (err)
    {
        console.log(err)
        con.end();
        throw err;
    }
    else {console.log("DB 연결 성공");}
});

// 정적 파일 설정 (미들웨어) 3
app.use(express.static(path.join(__dirname, '/public')));

// ejs 설정 4
app.set('views', __dirname + '\\views');
app.set('view engine', 'ejs');

// 정제 (미들웨어) 5
app.use(bodyParser.urlencoded({ extended: false }));

// 세션 (미들웨어) 6
app.use(session({
    secret: 'secretstring', // 데이터를 암호화 하기 위해 필요한 옵션
    resave: false, // 요청이 왔을때 세션을 수정하지 않더라도 다시 저장소에 저장되도록
    saveUninitialized: true, // 세션이 필요하면 세션을 실행시칸다(서버에 부담을 줄이기 위해)
    store: new FileStore() // 세션이 데이터를 저장하는 곳
}));

// 메일 보내기 모듈
app.use('/', sendMailRouter);
app.use('/', sendMailRouterManager);


// 메인페이지
app.get('/', (req, res) => {
    console.log('메인페이지 작동');
    console.log(req.session);
    if (req.session.is_logined == true) {
        res.render('index', {
            is_logined: req.session.is_logined,
            name: req.session.name,
            check: req.session.check
        });
    } else {
        res.render('index', {
            is_logined: false
        });
    }
});


// 회원가입
app.get('/register', (req, res) => {
    console.log('회원가입 페이지');
    res.render('register');
});

app.post('/register', (req, res) => {
    console.log('회원가입 하는중')
    const body = req.body;

    if (body.check == "user")
    {
        const serial = body.serial;
        let u_id = body.u_id;
        let u_pw = body.u_pw;
        const u_name = body.u_name;
        const u_age = body.u_age;
        const u_address = body.u_address;
        const u_number = body.u_number

        u_id = encrypt(u_id);
        u_pw = encrypt(u_pw);
        
        client.query('select Serial_Number from user where Serial_Number=?', [serial], (err, data) => {
            if (data.length != 0)
            {
                console.log('중복된 시리얼 번호');
                // res.send('<script>alert("회원가입 실패\n중복된 제품번호입니다.");</script>');
                res.redirect('/login');
            }
            else
            {
                client.query('select * from user where ID=?', [u_id], (err, data) => {
                    if (data.length == 0) {
                        console.log('회원가입 성공');
        
                        // Json파일 생성
                        const file_path = './Log/'+serial+'.json'
                        let user_json = {[getYYMMDD()] : []};
                        user_json = JSON.stringify(user_json);
                        fs.writeFileSync(file_path, user_json)
        
                        // DB 삽입
                        client.query('insert into user(Serial_Number, ID, PW, Name, Age, Address, Number, Log_Path) values(?,?,?,?,?,?,?,?)', [
                            serial, u_id, u_pw, u_name, u_age, u_address, u_number, file_path
                        ]);
        
                        res.redirect('/');
                    } else {
                        console.log('중복된 ID');
                        // res.send('<script>alert("회원가입 실패\n중복된 ID입니다.");</script>');
                        res.redirect('/login');
                    }
                });
            }
        });
    }
    else
    {
        const serial = body.m_u_serial;
        let m_u_id = body.m_u_id;
        let m_u_pw = body.m_u_pw;

        m_u_id = encrypt(m_u_id);
        m_u_pw = encrypt(m_u_pw);

        client.query('select Serial_Number, ID, PW from user where Serial_Number=?', [serial], (err, data) => {
            if (data.length == 0) {
                console.log('등록되지 않은 사용자');
                // res.send('<script>alert("회원가입 실패\n등록되지 않은 사용자 입니다.");</script>');
                res.redirect('/');
            } else {
                if (m_u_id == data[0].ID && m_u_pw == data[0].PW && serial == data[0].Serial_Number)
                {
                    console.log('사용자 정보 확인 완료');
                    let m_id = body.m_id;
                    let m_pw = body.m_pw;
                    const m_name = body.m_name;
                    const m_relation = body.relation;
                    const m_email = body.m_email;
                    const m_number = body.m_number;

                    m_id = encrypt(m_id);
                    m_pw = encrypt(m_pw);
                    client.query('select * from manager where ID=?', [m_id], (err, data) => {
                        if (data.length == 0)
                        {
                            console.log('회원가입 성공');
                            client.query('insert into manager(ID, PW, USER_Serial_Number, Name, Relationship, Email, Number) values(?,?,?,?,?,?,?)', [
                                m_id, m_pw, serial, m_name, m_relation, m_email, m_number
                            ]);
                        }
                        else
                        {
                            console.log('중복된 ID');
                            // res.send('<script>alert("회원가입 실패\n중복된 ID입니다.");</script>');
                            res.redirect('/login');
                        }
                    });
                }
                else
                {
                    console.log('잘못된 사용자 정보');
                    // res.send('<script>alert("회원가입 실패\n잘못된 사용자 정보입니다.");</script>');
                    res.redirect('/');
                }
            }
        });
    }
});


// 로그인
app.get('/login', (req, res) => {
    console.log('로그인 작동');
    res.render('login');
});

app.post('/login', (req, res) => {
    const body = req.body;
    let id = body.id;
    let pw = body.pw;
    const chk = body.check;

    id = encrypt(id);
    pw = encrypt(pw);
    
    if (chk == 'user')
    {
        client.query('select Serial_Number, ID, PW, Name from user where ID=?', [id], (err, data) => {
            if (data.length == 0)
            {
                console.log('등록된 정보가 없습니다.');
                res.render('login', {});
            }
            else if (id == data[0].ID && pw == data[0].PW) {
                console.log('로그인 성공');
                // 세션에 추가
                req.session.is_logined = true;
                req.session.serial_number = data[0].Serial_Number;
                req.session.check = chk;
                req.session.name = data[0].Name;
                req.session.save(function () { // 세션 스토어에 적용하는 작업
                    res.render('index', { // 정보전달
                        name: data[0].Name,
                        is_logined: true,
                        check: req.session.check
                    });
                });
            } else {
                console.log('로그인 실패\nID 또는 PW를 확인해주세요');
                res.render('login', {});
            }
        });
    }
    else 
    {
        client.query('select USER_Serial_Number, ID, PW, Name, Email, Number from manager where ID=?', [id], (err, data) => {
            if (data.length == 0)
            {
                console.log('등록된 정보가 없습니다.');
                res.render('login', {});
            }
            else if (id == data[0].ID && pw == data[0].PW) {
                console.log('로그인 성공');
                // 세션에 추가
                req.session.is_logined = true;
                req.session.serial_number = data[0].USER_Serial_Number;
                req.session.check = 'manager';
                req.session.name = data[0].Name;
                req.session.save(function () { // 세션 스토어에 적용하는 작업
                    res.render('index', { // 정보전달
                        name: data[0].Name,
                        is_logined: true,
                        check: req.session.check
                    });
                });
            } else {
                // console.log('로그인 실패\nID 또는 PW를 확인해주세요');
                // res.render('login', {});
            }
        });
    }
});


// 로그아웃
app.get('/logout', (req, res) => {
    console.log('로그아웃 성공');
    req.session.destroy(function (err) {
        // 세션 파괴후 할 것들
        res.redirect('/');
    });

});

// 통계자료 보기
app.get('/info', (req, res) => {
    try{
        console.log('통계자료 확인하기');
        console.log(req.session);
        const path = "./Log/"+req.session.serial_number+".json";

        const HHMMSS = 0;
        const EMOTION = 1;
        const TEXT = 2;
        
        const user_data = JSON.parse(fs.readFileSync(path).toString());
        const weeks = get2weeks();
        let user_emotion = {"depressed":0, "not_depressed":0};

        for(var d=0; d<weeks.length; d++)
        {   
            day = weeks[d];
            if (user_data[day] == undefined) {continue;}
            for (var i=0; i<user_data[day].length; i++)
            {   
                user_emotion[user_data[day][i][EMOTION]] += 1
            }
        }

        keys = getSortedDate(user_data);

        let last = user_data[keys[0]].at(-1);
        const last_time = keys[0]+" "+last[HHMMSS];
        const last_emotion = last[EMOTION];
        const last_text = last[TEXT];

        res.render('info', {
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

app.post('/info', (req, res) => {

});

// app.listen(3000, () => {
//     console.log('3000 port running...');
// });

app.listen(3000, function(){
    console.log('3000 port running...');
    // 매주 일요일마다 메일 대상자에게 메일전송
    schedule.scheduleJob('* * * * * 0', function () {
        console.log('매주 일요일에 실행.. 메일 보내기');
        // Log 폴더 순회하며 각 파일(=user)마다 통계정보 검사해서 depress가 50%이상이면 메일보냄
        // sendmail_auto 파일 새로 만들기

        let dir = 'Log';
        let files = fs.readdirSync(dir); // 디렉토리를 읽어온다
        console.log(files);

        try {
            for (var idx = 0; idx < files.length; idx++) {
                const path = "./Log/" + files[idx];

                const HHMMSS = 0;
                const EMOTION = 1;
                const TEXT = 2;
                const user_data = JSON.parse(fs.readFileSync(path).toString());
                const weeks = get2weeks();
                let user_emotion = { "depressed": 0, "not_depressed": 0 };
                let user_text = [];
                let cnt = 0;
                for (var d = 0; d < weeks.length; d++) {
                    day = weeks[d];
                    if (user_data[day] == undefined) { continue; }
                    for (var i = 0; i < user_data[day].length; i++) {
                        user_emotion[user_data[day][i][EMOTION]] += 1;
                        if (cnt < 10) {
                            user_text.push(user_data[day][i][TEXT]);
                            cnt += 1;
                        }
                    }
                }
                console.log(user_text);
                if (user_emotion['depressed'] > user_emotion['not_depressed']) { //depressed가 not depressed보다 많을 때
                    // console.log('우울증 위험합니다')
                    let dep = parseInt((user_emotion['depressed'] / (user_emotion['depressed'] + user_emotion['not_depressed'])) * 100) // dep 비율
                    let serial = files[idx].split('.')[0]
                    let status;
                    if (dep > 75) {
                        status = "매우 위험";
                    }
                    else {
                        status = "위험";
                    }
                    
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
                    client.query('select Email from manager where USER_Serial_Number=?', [serial], (err, data) => {
                        let email = JSON.parse(JSON.stringify(data[0]))['Email'];

                        client.query('select Name from user where Serial_Number=?', [serial], (err, name) => {
                            let user_name = JSON.parse(JSON.stringify(name[0]))['Name'];
                            // console.log(user_name);
                            let html_content;
                            ejs.renderFile('./views/email.ejs', { user_name: user_name, dep:dep, status:status, user_text:user_text, }, function (err, data) {
                                if (err) { console.log(err) }
                                html_content = data;
                            });

                            let mailOptions = {
                                from: 'kookminaid17@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
                                to: email,                     // 수신 메일 주소
                                subject: 'AID 우울증 판단 결과',   // 제목
                                html: html_content,
                                // text: "2주간의 우울증 판단 결과 우울증 위험도가 높습니다", // 내용
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
                    });
                }

            }
        }
        catch (err) {
            console.log('error occured in auto sending message');
            console.log(err);
        }
    });
});

// app 어딘가에서 에러났을 때 여기서 처리
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("error occured please go back");
});