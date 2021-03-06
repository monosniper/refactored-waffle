const nodemailer = require('nodemailer');
require('dotenv').config();

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                ciphers:'SSLv3'
            }
        })
    }

    async sendActivationMail(to, link) {
        return await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Верификация аккаунта на ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                      <h1>Для активации перейдите по ссылке:</h1>
                      <a href="${link}">${link}</a>
                    </div>
                `
        })
    }

    async sendAcceptVerificationMail(to, name) {
        return await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Верификация аккаунта на ' + process.env.CLIENT_URL,
            text: '',
            html:
                `
                    <div>
                      <h1>Уважаемый `+name+`! Ваш аккаунт был полностью верифицирован.</h1>
                    </div>
                `
        })
    }

    async sendRejectVerificationMail(to, name, link) {
        return await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Верификация аккаунта на ' + process.env.CLIENT_URL,
            text: '',
            html:
                `
                    <div>
                      <h1>Уважаемый `+name+`! Ваш аккаунт НЕ был верифицирован. Прочитайте еще раз какими должны быть фотографии, и попробуйте повторно отправить запрос на верификацию.</h1>
                    </div>
                `
        })
    }

    async sendResetPasswordMail(to, name, password) {
        return await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Сброс пароля на ' + process.env.CLIENT_URL,
            text: '',
            html:
                `
                    <div>
                      <h1>Уважаемый `+name+`! Ваш пароль был сброшен.</h1> 
                      Новый пароль: <b>`+password+`</b>
                    </div>
                `
        })
    }
}

module.exports = new MailService();