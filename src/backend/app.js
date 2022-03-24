const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get('/index', (req, res) => {
    res.send('<h1>Index Page 입니다.</h1>');
});

app.post('/login', (req, res, next) => {
    console.log(req.body);
    res.end();
});

app.get('/register', (req, res) => {
    res.send("<h1>회원가입 페이지 입니다.</h1>");
});



app.listen(3000);