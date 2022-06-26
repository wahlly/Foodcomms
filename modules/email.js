const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_SECRET_KEY, domain: process.env.MAILGUN_DOMAIN });
const handlebars = require('handlebars')
const fs = require('fs')

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
    
      return mailgun.messages().send(data, (error) => {
          if (error) {
            return reject(error);
          }
          return resolve();
        });
    });
};

module.exports = { sendMailNotification };