import nodemailer from 'nodemailer';
import config from '../../config';

const sendMail = (data) => {
  return new Promise((resolve, reject) => {
    const transport = nodemailer.createTransport(config.nodemailerTransport);

    transport.verify((error) => {
      if (error) {
        console.log(`${'mailer'.cyan}: ${'error while connecting to smtp server'.red}`);
        reject(error);
      } else {
        transport.sendMail(data, (err) => {
          if (err) {
            console.log(`${'mailer'.cyan}: ${`error while sending email to ${data.to} with subject ${data.subject}`.red}`);
            reject(err);
          } else {
            console.log(`${'mailer'.cyan}: ${`email sent to ${data.to} with subject ${data.subject}`.green}`);
            resolve();
          }
        });
      }
    });
  });
};

export default sendMail;
