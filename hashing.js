// 참고 : https://yceffort.kr/2020/06/encryption-decryption-nodejs
// 참고 : https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-crypto-%EB%AA%A8%EB%93%88-%EC%95%94%ED%98%B8%ED%99%94

const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = 'abcdefghijklmnopqrstuvwxyz123456';
const iv = '1234567890123456';

function encrypt(text)
{
    const chiper = crypto.createCipheriv(algorithm, key, iv);
    let result = chiper.update(text, 'utf8', 'base64');
    result += chiper.final('base64');

    return result;
}

function decrypt(text)
{
    const chiper = crypto.createDecipheriv(algorithm, key, iv);
    let result = chiper.update(text, 'base64', 'utf8');
    result += chiper.final('utf8');

    return result;
}

module.exports = {
    encrypt : encrypt,
    decrypt : decrypt
}

id = ["user1_id", "manager1_id", "manager2_id"];
pw = ["user1_pw", "manager1_pw", "manager2_pw"];


for (var i=0; i<3; i++)
{
    const id_en = encrypt(id[i]);
    const pw_de = encrypt(pw[i]);
    
    console.log(id_en);
    console.log(pw_de);
    
    console.log(decrypt(id_en));
    console.log(decrypt(pw_de));
    console.log("=====================")
}