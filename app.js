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
// const userInfoPost = require('./routes/user_info_post');
const res = require('express/lib/response');
const request = require('request');
const axios = require('axios');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const cors = require('cors');

function getSortedDate(date) {
    keys = [];
    for (key in date) {
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
app.use(express.static(path.join(__dirname, './client/build')));

// // ejs 설정 4
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

// 외부 서버로부터 요청받기위함
app.use(cors());

// 정제 (미들웨어) 5
app.use(bodyParser.urlencoded({extended: true}));
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
// app.use('/', userInfoPost)

app.get("/", function (res, req) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.post('/talk', (req, res) => {
    handleDisconnect();

    console.log(req);
    console.log(req.body);
    const body = req.body;
    const serial = body.serial;
    const talk = body.talk;
    const emotion = body.emotion;
    // client.query('select Serial_Number from user ', (err, data) => {
    //     res.write('받았다');
    //     res.end();
    // });

    client.query('select Serial_Number from user where  Serial_Number=?', [serial], (err, data) => {
        if (data.length == 0) {
            res.write('해당 serial을 가진 user는 없습니다');
            res.end();

        } else {
            try {
                handleDisconnect();
                client.query('insert into log(date, emotion, talk, user_Serial_Number) values(DATE_ADD(NOW(), INTERVAL 9 HOUR),?,?,?)', [emotion, talk, serial]);
                res.write('성공');
                res.end();
            } catch (err) {
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

app.post('/register', (req, res) => {
    const body = req.body;
    if (body.userType === "user") {
        const serial = body.serial;
        let u_id = body.userId;
        let u_pw = body.userPw;
        const u_name = body.userName;
        const u_age = body.userAge;
        const u_address = body.userAddress;
        const u_number = body.userTel
        console.log(`user ${u_id} tries to register service`);

        u_id = encrypt(u_id);
        u_pw = encrypt(u_pw);

        client.query('select Serial_Number from user where Serial_Number=?', [serial], (err, data) => {
            if (data.length !== 0) {
                console.log(`duplicated serial ${serial}`);
                res.send({registerSuccess: false})
            } else {
                client.query('select * from user where ID=?', [u_id], (err, data) => {
                    if (data.length === 0) {
                        console.log(`user ${u_id} registered`);
                        client.query('insert into user(Serial_Number, ID, PW, Name, Age, Address, Number) values(?,?,?,?,?,?,?)', [
                            serial, u_id, u_pw, u_name, u_age, u_address, u_number
                        ]);
                        res.send({registerSuccess: true})
                    } else {
                        console.log(`duplicated user id ${u_id}`);
                        res.send({registerSuccess: false})
                    }
                });
            }
        });
    } else {
        const serial = body.serial;
        let m_u_id = body.m_u_id;
        let m_u_pw = body.m_u_pw;
        m_u_id = encrypt(m_u_id);
        m_u_pw = encrypt(m_u_pw);
        client.query('select Serial_Number, ID, PW from user where Serial_Number=?', [serial], (err, data) => {
            if (data.length === 0) {
                console.log(`serial ${serial} is not exist`);
                res.send({registerSuccess: false})
            } else {
                if (m_u_id === data[0].ID && m_u_pw === data[0].PW && serial === data[0].Serial_Number) {
                    console.log(`user ${m_u_id} is approved`);
                    let m_id = body.m_id;
                    let m_pw = body.m_pw;
                    const m_name = body.m_name;
                    const m_relation = body.relation;
                    const m_email = body.m_email;
                    const m_number = body.m_number;
                    m_id = encrypt(m_id);
                    m_pw = encrypt(m_pw);
                    client.query('select * from manager where ID=?', [m_id], (err, data) => {
                        if (data.length === 0) {
                            console.log(`manager ${m_id} registered with`);
                            console.log(`m_id ${m_id} u_id ${m_u_id} relation ${m_relation}`)
                            client.query('insert into manager(ID, PW, Name, Relationship, Email, Number) values(?,?,?,?,?,?)', [
                                m_id, m_pw, m_name, m_relation, m_email, m_number
                            ]);
                            client.query('insert into manager_has_user(manager_ID, user_Serial_Number) values(?,?)', [
                                m_id, serial
                            ]);
                            res.send({registerSuccess: true})
                        } else {
                            console.log('중복된 ID');
                            res.send({registerSuccess: false})
                        }
                    });
                } else {
                    console.log('잘못된 사용자 정보');
                    res.send({registerSuccess: false})
                }
            }
        });
    }
});

app.post('/login', async (req, res) => {
    const body = req.body;
    const id = body.id;
    const pw = body.pw;
    const userType = body.userType;
    const encryptedId = encrypt(id);
    const encryptedPw = encrypt(pw);

    if (userType === 'user') {
        await client.query('select Serial_Number, ID, PW, Name, Number from user where ID=?', [encryptedId], (err, data) => {
            if (data.length === 0) {
                console.log(`userID ${id} is not registered.`);
                res.send({loginSuccess: false});
            } else if (encryptedId === data[0].ID && encryptedPw === data[0].PW) {
                console.log(`userID ${id} login correctly.`)
                // 세션에 추가
                req.session.is_logined = true;
                req.session.serial_number = data[0].Serial_Number;
                req.session.check = userType;
                req.session.name = data[0].Name;
                req.session.save();

                res.send({
                    loginSuccess: true,
                    id: id,
                    userSerials: [data[0].Serial_Number],
                    userNames: [data[0].Name],
                    userTels: [data[0].Number]
                });
                
            } else {
                console.log(`userID ${id}: not correct id or password.`);
                res.send({loginSuccess: false});
            }
        });
    } else {
        await client.query('select ID, PW, Name, Email, Number from manager where ID=?', [encryptedId], async (err1, data) => {
            await client.query('select M.user_Serial_Number, U.Name, U.Age, U.Number from manager_has_user M JOIN user U ON M.user_Serial_Number = U.Serial_Number where M.manager_ID=?', [encryptedId], (err2, userData) => {
                if (data.length === 0) {
                    console.log(`managerID ${id} is not registered.`);
                    res.send({loginSuccess: false});
                } else if (encryptedId === data[0].ID && encryptedPw === data[0].PW) {
                    console.log(`managerID ${encryptedId} login correctly.`)
                    const userSerials = [];
                    const userNames = [];
                    const userTels = [];
                    for (const userDatum of userData) {
                        userSerials.push(userDatum.user_Serial_Number);
                        userNames.push(userDatum.Name);
                        userTels.push(userDatum.Number);
                    }
                    req.session.is_logined = true;
                    req.session.user_info = userData;
                    req.session.check = 'manager';
                    req.session.name = data[0].Name;
                    req.session.save();

                    res.send({
                        loginSuccess: true,
                        id: id,
                        userSerials: userSerials,
                        userNames: userNames,
                        userTels: userTels,
                    })
                } else {
                    console.log(`managerID ${id}: not correct id or password.`);
                    res.send({loginSuccess: false});
                }
            });
        });
    } // end chk manager
}); // end app post login

// user 정보 추가 (manager 로그인화면에서)
app.post('/add_user', (req, res) => {
    console.log(`trying to add user with`);
    const body = req.body;
    console.log(body);
    const serial = body.serial;
    let u_id = body.u_id;
    let u_pw = body.u_pw;
    let m_id = body.currentId;
    u_id = encrypt(u_id);
    u_pw = encrypt(u_pw);
    m_id = encrypt(m_id);
    console.log('add user to DB start');
    client.query('select Serial_Number, ID, PW, Name from user where Serial_Number=?', [serial], (err, data) => {
        try {
            if (err) throw err;
            if (data.length === 0) {
                console.log(`Invalid user information`);
                res.send({ registerSuccess: false })
            }
            if (u_id === data[0].ID && u_pw === data[0].PW) {
                console.log(`appending user to manager ${m_id}`);
                client.query('insert into manager_has_user(manager_ID, user_Serial_Number) values(?,?)', [m_id, serial]);
                res.send({ registerSuccess: true })
            }
        } catch (err) {
            console.log('no information or duplicate user');
            // res.send({ registerSuccess: false })
        }
    });
    console.log('add user end');
    // if (body.check === "user") {
        
    // }
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
app.post('/info', (req, res) => {
    const body = req.body;
    client.query('select date, emotion, talk from log where date BETWEEN DATE_ADD(DATE_ADD(NOW(), INTERVAL 9 HOUR),INTERVAL -2 WEEK ) AND DATE_ADD(NOW(), INTERVAL 9 HOUR) AND user_Serial_Number=? ORDER BY date', [body.serial], (err, data) => {
        if (err) {
            throw err;
        }
        try {
            if (data.length != 0) {
                console.log(`check statistics of ${body.serial}! there is no data`);
                const userStatus = { "depressed": 0, "not_depressed": 0 };

                const lastTime = [];
                const lastEmotion = [];
                const lastText = [];
                for (let i = 0; i < data.length; i++) {
                    userStatus[data[i]['emotion']] += 1
                    if (data.length - i < 8){
                        lastTime.push(data[i]['date']);
                        lastEmotion.push(data[i]['emotion']);
                        lastText.push(data[i]['talk']);
                    }
                }
                res.send(
                    {
                        lastTime,
                        lastEmotion,
                        lastText,
                        userStatus,
                    }
                )
            }
            else {
                res.send(
                    {
                        lastTime: ["1900-01-01"],
                        lastEmotion: ["undefined"],
                        lastText : ["사용자 정보가 없습니다."],
                        userStatus : {
                            'depressed' : 0,
                            'not_depressed' : 0
                        },
                    }
                )
            }
            
        } catch (err1) {
            console.log(`error occurred in data statistics of ${body.serial}`);
            console.log(err1)
        }
    });
});

app.listen(process.env.PORT || 80, function () {
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
            for (var i = 0; i < data.length; i++) {
                let serial = data[i]['user_Serial_Number'];
                client.query('select date, emotion, talk from log where date BETWEEN DATE_ADD(DATE_ADD(NOW(), INTERVAL 9 HOUR),INTERVAL -2 WEEK ) AND DATE_ADD(NOW(), INTERVAL 9 HOUR) AND user_Serial_Number=? ORDER BY date', [serial], (err, data) => {
                    let user_emotion = {"depressed": 0, "not_depressed": 0};
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
                        } else {
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
                            for (var i=0; i < log.length; i++) {
                                try {
                                    let email = log[i]['Email'];
                                    let user_name = log[i]['Name'];
                                    let html_content;
                                    ejs.renderFile('./views/email.ejs', {
                                        user_name: user_name,
                                        dep: dep,
                                        status: status,
                                        user_text: user_text,
                                    }, function (err, data) {
                                        if (err) {
                                            console.log(err)
                                        }
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
                                        } else {
                                            console.log('Email sent: ' + info.response);
                                        }
                                    });
                                } catch (err) {
                                    console.log('the manager of the user may not be exist');
                                    console.log(err);
                                }
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
