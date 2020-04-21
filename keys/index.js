if (process.env.NODE_ENV === 'production') {
    module.exports = require('./keys.prod')
} else {
    module.exports = require('./keys.dev')
}
// echo "export SENDGRID_API_KEY='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'" > sendgrid.env
// echo "sendgrid.env" >> .gitignore
// source ./sendgrid.env

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//     to: 'test@example.com',
//     from: 'test@example.com',
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg);