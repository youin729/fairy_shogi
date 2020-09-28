const nodemailer = require("nodemailer");

const DEF_address = 'akasaka16x16@gmail.com';
const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
        user: DEF_address,
        pass: 'chushogi12'
    }
};

//SMTPサーバの設定
const smtp = nodemailer.createTransport(smtpConfig);


// メール送信
/*
message = {
    from: string // from@example.com,
    to: string // to@example.com,
    subject: string,
    text: string
};
*/
exports.send = function mailSend(message){
    if(!message.to || !message.subject || !message.text){
        return false;
    }
    if(!message.from){
        message.from = DEF_address;
    }

    try{
        smtp.sendMail(message, function(error, info){
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