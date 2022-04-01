const fs = require('fs');
const mysql = require('mysql');
// const dbsetting = require('./dbsetting');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session); 
const cookieParser = require('cookie-parser');

// express 설정 1
const app = express();

// db 생성
// dbsetting.dbinit();

// db 연결 2
const client = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '98sy1219pp!',
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



// 메인페이지
app.get('/', (req, res) => {
    console.log('메인페이지 작동');
    console.log(req.session);
    if (req.session.is_logined == true) {
        res.render('index', {
            is_logined: req.session.is_logined,
            name: req.session.name
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
    const serial = body.serial;
    const id = body.id;
    const pw = body.pw;
    const name = body.name;
    const age = body.age;
    const address = body.address;

    const rela1_name = body.rela1_name;
    const rela1 = body.rela1;
    const rela1_num = body.rela1_number;
    const rela2_name = body.rela2_name;
    const rela2 = body.rela2;
    const rela2_num = body.rela2_number;
    const rela3_name = body.rela3_name;
    const rela3 = body.rela3;
    const rela3_num = body.rela3_number;

    client.query('select * from user where USER_ID=?', [id], (err, data) => {
        console.log(data);
        if (data.length == 0) {
            console.log('회원가입 성공');
            client.query('insert into user(Serial_Number, USER_ID, Password, Name, Age, Address, Relationship_1_Name, Relationship_1, Relationship_1_Number, Relationship_2_Name, Relationship_2, Relationship_2_Number, Relationship_3_Name, Relationship_3, Relationship_3_Number) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                serial, id, pw, name, age, address, rela1_name, rela1, rela1_num, rela2_name, rela2, rela2_num, rela3_name, rela3, rela3_num
            ]);
            res.redirect('/');
        } else {
            console.log('회원가입 실패');
            res.send('<script>alert("회원가입 실패\n중복된 ID입니다.");</script>');
            res.redirect('/login');
        }
    });
});


// 로그인
app.get('/login', (req, res) => {
    console.log('로그인 작동');
    res.render('login');
});

app.post('/login', (req, res) => {
    const body = req.body;
    const id = body.id;
    const pw = body.pw;

    client.query('select USER_ID, Password, Name, Age, Address from user where USER_ID=?', [id], (err, data) => {
        // 로그인 확인
        // console.log(data[0]);
        // console.log(id);
        // console.log(data[0].USER_ID);
        // console.log(data[0].Password);
        // console.log(id == data[0].USER_ID);
        // console.log(pw == data[0].Password);
        if (data.length == 0)
        {
            console.log('등록된 정보가 없습니다.');
            res.render('login', {});
        }
        else if (id == data[0].USER_ID && pw == data[0].Password) {
            console.log('로그인 성공');
            // 세션에 추가
            req.session.is_logined = true;
            req.session.name = data[0].Name;
            req.session.user_id = data[0].USER_ID;
            req.session.user_pw = data[0].Password;
            req.session.save(function () { // 세션 스토어에 적용하는 작업
                res.render('index', { // 정보전달
                    id: data[0].USER_ID,
                    name: data[0].Name,
                    age: data[0].Aage,
                    address : data[0].Address,
                    is_logined: true
                });
            });
        } else {
            console.log('로그인 실패\nID 또는 PW를 확인해주세요');
            res.render('login', {});
        }
    });

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
    console.log('통계자료 확인하기');
    console.log(req.session);

    client.query('select * from log where USER_USER_ID=?', [req.session.user_id], (err, data) => {
        let user_data = {"Happiness":0, "Sadness":0, "Anger":0, "Anxiety":0};
        let last_time_stemp;
        let last_sentence;

        for (var i=0; i<data.length; i++)
        {   
            user_data[data[i]['Emotion']] += 1;
        }
        // 로그인된 사람의 최근 2주간 데이터를 추출해서 
        // 각 감정 상태에 대한 통계(일단 2주간 각 감정 횟수 정도?)
        // 를 출력하도록 해야할 듯!

        last_time_stemp = data[i-1]['Time_stemp'];
        last_sentence = data[i-1]['Text_path'];

        console.log(user_data);
        console.log(last_sentence);
        console.log(last_time_stemp);

        res.render('info', {
            name: req.session.name,
            info_data: user_data,
            user_time: last_time_stemp,
            user_sentence: last_sentence
        });
    });
});

app.post('/info', (req, res) => {

});

app.listen(3000, () => {
    console.log('3000 port running...');
});