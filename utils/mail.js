const nodemailer = require("nodemailer");
const env = require("../config/env");
const {compilePug, inlineCssStyles} = require("./mailPlugins");
const { htmlToText } = require("nodemailer-html-to-text");


// to send real messages
// const Nodemailer = require("nodemailer");
// const { MailtrapTransport } = require("mailtrap");
// const transporter = Nodemailer.createTransport(
//   MailtrapTransport({
//     token: env.MAILTRAP_TOKEN,
//   })
// );


const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  auth: {
    user: env.MAIL_USERNAME,
    pass: env.MAIL_PASSWORD,
  },
});

transporter.use("compile", compilePug());
transporter.use("compile", inlineCssStyles());
transporter.use("compile", htmlToText());

module.exports = transporter;