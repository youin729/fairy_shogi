const nodemailer = require("nodemailer");
const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
        user: 'akasaka16x16@gmail.com',
        pass: 'chushogi12'
    }
};

//SMTPサーバの設定
const smtp = nodemailer.createTransport(smtpConfig);

//メール情報の作成
const test_message = {
    from: 'akasaka16x16@gmail.com',
    to: 'you.in729@gmail.com',
    subject: 'nodemailer test mail',
    text: 'テストメールです。'
};

// メール送信
exports.mailSend = function mailSend(){
    try{
        smtp.sendMail(test_message, function(error, info){
            // エラー発生時
            if(error){
                console.log("send failed");
                console.log(error.message);
                return;
            }
            
            // 送信成功
            console.log("send successful");
            console.log(info.messageId);
        });
    }catch(e) {
        console.log("Error",e);
    }    
}