const keys = require('../keys')
const sgMail = require('@sendgrid/mail')

module.exports = function (email, token) {
    return{
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Reset password ',
        text: 'and easy to do anywhere, even with Node.js',
        html: `
        <h1> Yuo forget password</h1>
        <p>If no, ignore this mail </p>
        <p>Else push on link:</p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
        
        <hr />
        <a href="${keys.BASE_URL}">Shop</a>
        `
    }

}