const crypto = require('crypto')

const password = 'jsy1219jsy'
const password2 = 'jsy1219'

const key = 'gracefulife' // 대칭형 키
// 암호화 메서드
const cipher = (password, key) => {
const encrypt = crypto.createCipher('des', key) // des알고리즘과 키를 설정
const encryptResult = encrypt.update(password, 'utf8', 'base64') // 암호화
+ encrypt.final('base64') // 인코딩
console.log(encryptResult)
return encryptResult
}
// 복호화 메서드
const decipher = (password, key) => {
const decode = crypto.createDecipher('des', key)
const decodeResult = decode.update(password, 'base64', 'utf8') // 암호화된 문자열, 암호화 했던 인코딩 종류, 복호화 할 인코딩 종류 설정
+ decode.final('utf8') // 복호화 결과의 인코딩
console.log(decodeResult)
}
const encrypt = cipher(password, key) // dzzmUb9NevZXKjSIZiZbHQ
decipher(encrypt, key) // qpmz0192
const encrypt2 = cipher(password2, key) // vPwzzznk4gezbixB1Fr9wA
decipher(encrypt2, key) // 2910zmpq

// const crypto = require('crypto');
// const encrypt = require('./hashing.js').encrypt;
// const decrypt = require('./hashing.js').decrypt;

// id = "123A";
// pw = "jsy1219A";

// const id_en = encrypt(id);
// const pw_en = encrypt(pw);

// console.log(id_en);
// console.log(pw_en);

// console.log(decrypt(id_en));
// console.log(decrypt(pw_en));