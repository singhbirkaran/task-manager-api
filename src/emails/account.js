const mailgun = require('mailgun-js')
const apiKey = process.env.email_API_key 
const domain = 'sandbox9cd133a55aa349dc8a77837c90c05ebf.mailgun.org'

const mg = mailgun({apiKey, domain})

const sendWelcomeMail = (email, name) => {
const data = {
    from: 'Birkaran Task-app  <birkaransingh7@gmail.com>',
    to: email,
    subject:'Thanks for joining in!',
    text:`Hi ${name},
Welcome to the app. Let me know how you get along with the app.`
}

mg.messages().send(data)}

const sendCancelationEmail = (email, name) => {
    const data = {
    from: 'Birkaran Task-app  <birkaransingh7@gmail.com>',
    to: email,
    subject:'Sorry to see you go!',
    text:`Goodbye ${name},
We hope to see you sometime back soon.`
    }
    mg.messages().send(data)
}

module.exports = {
    sendWelcomeMail,
    sendCancelationEmail
}