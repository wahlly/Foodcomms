const nodemailer = require("nodemailer");
const handlebars = require('handlebars')
const fs = require('fs')

const mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'olaifaolawaleh@gmail.com',
          pass: process.env.GOOGLE_APP_ACCESS
      }
  });

const sendMailNotification = (to_email, subject, substitutional_parameters, Template_Name) => {
  const source = fs.readFileSync(`./modules/templates/${Template_Name}.hbs`, "utf8");

  const compiledTemplate = handlebars.compile(source);
    return new Promise((resolve, reject) => {
        const data = {
          from: process.env.MAILGUN_FROM,
          to: to_email,
          subject: subject,
          html: compiledTemplate(substitutional_parameters)
        };
    
      return mailTransporter.sendMail(data, (error) => {
          if (error) {
            return reject(error);
          }
          return resolve();
        });
    });
};

module.exports = { sendMailNotification };