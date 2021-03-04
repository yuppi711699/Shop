const keys = require('../keys')
// const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
module.exports = function (email) {
    return{
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'registration is succses ',
        text: 'and easy to do anywhere, even with Node.js',
        html: `
        <h1> Welcome to Ug Autotrans</h1>
        <p>Account created on ${email} </p>
        <hr />
        <a href="${keys.BASE_URL}">Shop</a>
        `
    }

}
