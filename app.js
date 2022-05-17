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
const userInfoPost = require('./routes/user_info_post');
const res = require('express/lib/response');
const request = require('request');
const axios = require('axios');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const cors = require('cors');

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
//     database: 'aid_db_2'
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



// 정적 파일 설정 (미들웨어) 3
app.use(express.static(path.join(__dirname, '/public')));

// ejs 설정 4
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// 외부 서버로부터 요청받기위함
app.use(cors());

// 정제 (미들웨어) 5
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
app.use('/', userInfoPost)


// 메인페이지
app.get('/', (req, res) => {
    console.log('메인페이지 작동');
    if (req.session.is_logined == true) {
        if (req.session.check == 'user'){
            res.render('index', {
                is_logined: req.session.is_logined,
                name: req.session.name,
                check: req.session.check
            });
        }
        else {
            res.render('index', {
                is_logined: req.session.is_logined,
                name: req.session.name,
                check: req.session.check,
                user_info: req.session.user_info
            });
        }
    } else {
        res.render('index', {
            is_logined: false
        });
        
    }
});

app.post('/talk', (req, res) => {
    handleDisconnect();

    console.log(req);
    console.log(req.body);
    const body = req.body;
    const serial = body.serial;
    const talk = body.talk;
    const emotion= body.emotion;
    // client.query('select Serial_Number from user ', (err, data) => {
    //     res.write('받았다');
    //     res.end();
    // });

    client.query('select Serial_Number from user where  Serial_Number=?', [serial], (err, data) => {
        if (data.length == 0) {
            res.write('해당 serial을 가진 user는 없습니다');
            res.end();

        }
        else {
            try {
                handleDisconnect();
                client.query('insert into log(date, emotion, talk, user_Serial_Number) values(DATE_ADD(NOW(), INTERVAL 9 HOUR),?,?,?)', [emotion, talk, serial]);
                res.write('성공');
                res.end();
            }
            catch (err) {
                res.write('실패');
                res.end();
            }
        }
    });
    // const path = "./Log/" + serial + ".json";

    // fs.readFile(path, 'utf8', function readFileCallback(err, data) {
    //     if (err) {
    //         console.log(err);
    //     } else {

    //         const today = new Date()
    //         const year = today.toLocaleDateString('ko-KR', {
    //             year: 'numeric',
    //         });
    //         const month = today.toLocaleDateString('ko-KR', {
    //             month: '2-digit',
    //         });
    //         const day = today.toLocaleDateString('ko-KR', {
    //             day: '2-digit',
    //         });
    //         const date = year + month + day;
    //         console.log(date);
    //         const time = today.toLocaleTimeString("ko-KR");

    //         let arr = [time, emotion, talk];
    //         obj = JSON.parse(data); //now it an object
    //         try {
    //             obj.date.push(arr);
    //         }
    //         catch(err) {
    //             obj.push({date: []});
    //             console.log('aaaa');
    //             console.log(err);
    //         }

    //         // obj.2022-04-26.push({ "2022-04-26": [talk, emotion]}); //add some data
    //         json = JSON.stringify(obj); //convert it back to json
    //         fs.writeFile(path, json, 'utf8', callback); // write it back 
    //     }
    // });



    // res.write('받았다');
    // res.end();


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
                        // const file_path = './Log/'+serial+'.json'
                        // let user_json = {[getYYMMDD()] : []};
                        // user_json = JSON.stringify(user_json);
                        // fs.writeFileSync(file_path, user_json)
        
                        // DB 삽입cd ..
                        client.query('insert into user(Serial_Number, ID, PW, Name, Age, Address, Number) values(?,?,?,?,?,?,?)', [
                            serial, u_id, u_pw, u_name, u_age, u_address, u_number
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
                            client.query('insert into manager(ID, PW, Name, Relationship, Email, Number) values(?,?,?,?,?,?)', [
                                m_id, m_pw, m_name, m_relation, m_email, m_number
                            ]);
                            client.query('insert into manager_has_user(manager_ID, user_Serial_Number) values(?,?)', [
                                m_id, serial
                            ]);

                            res.redirect('/');
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
            if(data.length == 0)
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
                        check: req.session.check,
                        serial_number: req.session.serial_number
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
        console.log(id);
        client.query('select ID, PW, Name, Email, Number from manager where ID=?', [id], (err, data) => {
            client.query('select M.user_Serial_Number, U.Name, U.Age, U.Number from manager_has_user M JOIN user U ON  M.user_Serial_Number = U.Serial_Number where M.manager_ID=?', [id], (err, data_user) => {
                // console.log(data);
                if (data.length == 0) {
                    console.log('등록된 정보가 없습니다.');
                    res.render('login', {});
                }
                else if (id == data[0].ID && pw == data[0].PW) {
                    console.log('로그인 성공');
                    // 세션에 추가
                    // let serials = []
                    // for (var i = 0; i < data_user.length; i++) {
                    //     serials.push(data_user[i].user_Serial_Number)
                    // }

                    req.session.is_logined = true;
                    req.session.user_info = data_user;
                    req.session.check = 'manager';
                    req.session.name = data[0].Name;
                    req.session.save(function () { // 세션 스토어에 적용하는 작업
                        res.render('index', { // 정보전달
                            name: data[0].Name,
                            is_logined: true,
                            check: req.session.check,
                            user_info: req.session.user_info
                        });
                    });
                } else {
                    console.log('로그인 실패\nID 또는 PW를 확인해주세요');
                    res.render('login', {});
                }
            });
        });
    }
});

// user 정보 추가 (manager 로그인화면에서)
app.post('/add_user', (req, res) => {
    console.log('사용자 추가 하는중')
    const body = req.body;

    if (body.check == "user") {
        const serial = body.serial;
        let u_id = body.u_id;
        let u_pw = body.u_pw;
        let m_id = body.my_m_id;
        const u_name = body.u_name;

        u_id = encrypt(u_id);
        u_pw = encrypt(u_pw);
        m_id = encrypt(m_id);
        // 1. 해당 serial의 user가 존재해야함
        // 2. id, pw, name이 일치해야함
        // 3. insert into manager_has_user

        client.query('select Serial_Number, ID, PW, Name from user where Serial_Number=?', [serial], (err, data) => {
            try {
                if (data.length == 0) {
                    console.log('잘못된 사용자 정보');
                    res.render('login', {});
                }
                if (u_id == data[0].ID && u_pw == data[0].PW && u_name == data[0].Name) {
                    console.log('user 정보를 추가중입니다');
                    client.query('insert into manager_has_user(manager_ID, user_Serial_Number) values(?,?)', [m_id, serial]);
                    res.render('index', { // 정보전달
                        name: data[0].Name,
                        is_logined: true,
                        check: req.session.check,
                        user_info: req.session.user_info
                    });
                }
            }
            catch(err) {
                console.log('정보가 없어요');
                res.write("<script>alert('there is no data')</script>");
                res.write("<script>window.location=\"/\"</script>");
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

    if (req.session.check == 'user'){
        client.query('select date, emotion, talk from log where date BETWEEN DATE_ADD(DATE_ADD(NOW(), INTERVAL 9 HOUR),INTERVAL -2 WEEK ) AND DATE_ADD(NOW(), INTERVAL 9 HOUR) AND user_Serial_Number=? ORDER BY date', [req.session.serial_number], (err, data) => {
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
                    is_logined: req.session.is_logined,
                    check: req.session.check,
                    name: req.session.name,
                    serial_number: req.session.serial_number,
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
    }
    else {
        client.query('select date, emotion, talk from log where date BETWEEN DATE_ADD(DATE_ADD(NOW(), INTERVAL 9 HOUR),INTERVAL -2 WEEK ) AND DATE_ADD(NOW(), INTERVAL 9 HOUR) AND user_Serial_Number=? ORDER BY date', [req.session.user_info[0]['user_Serial_Number']], (err, data) => {
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

    }
    
});

app.listen(process.env.PORT || 80, function(){
    console.log('port running...');
    // 매주 일요일마다 메일 대상자에게 메일전송
    schedule.scheduleJob('0 1 2 * * 0', function () {
    // schedule.scheduleJob(' * * * * * *', function () {
        console.log('매주 일요일 02시 1분 0초에 실행.. 메일 보내기');
        // Log 폴더 순회하며 각 파일(=user)마다 통계정보 검사해서 depress가 50%이상이면 메일보냄
        // sendmail_auto 파일 새로 만들기

        // let dir = 'Log';
        // let files = fs.readdirSync(dir); // 디렉토리를 읽어온다
        // console.log(files);
        client.query('SELECT DISTINCT user_Serial_Number FROM log', (err, data) => {
            for (var i=0; i<data.length; i++) {
                let serial = data[i]['user_Serial_Number'];
                client.query('select date, emotion, talk from log where date BETWEEN DATE_ADD(DATE_ADD(NOW(), INTERVAL 9 HOUR),INTERVAL -2 WEEK ) AND DATE_ADD(NOW(), INTERVAL 9 HOUR) AND user_Serial_Number=? ORDER BY date', [serial], (err, data) => {
                    let user_emotion = { "depressed": 0, "not_depressed": 0 };
                    let user_text = [];

                    for (var i = 0; i < data.length; i++) {
                        user_emotion[data[i]['emotion']] += 1
                        if (i < 10) {
                            user_text.push(data[i]['talk']);
                        }
                    }
                    if (user_emotion['depressed'] > user_emotion['not_depressed']) { //depressed가 not depressed보다 많을 때
                        // console.log('우울증 위험합니다')
                        let dep = parseInt((user_emotion['depressed'] / (user_emotion['depressed'] + user_emotion['not_depressed'])) * 100) // dep 비율
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
                        client.query('select M.Email, U.Name from manager_has_user MU JOIN manager M ON  MU.manager_ID = M.ID JOIN user u ON MU.user_Serial_Number = U.Serial_Number where MU.user_Serial_Number=?', [serial], (err, log) => {
                            
                            try{
                                let email = log[0]['Email'];
                                let user_name = log[0]['Name'];
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
                            }
                            catch(err) {
                                console.log('the manager of the user may not be exist');
                                console.log(err);
                            }
                        });
                    }
                });
            }
        });

    });
});

// app 어딘가에서 에러났을 때 여기서 처리
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("error occured please go back");
});