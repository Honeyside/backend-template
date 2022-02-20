import fs from 'fs';
import schedule from 'node-schedule';
import handlebars from 'handlebars';
import config from '../../../config';
import DAO from '../../dao';
import readHTMLFile from '../../utils/readHTMLFile';
import sendMail from '../../utils/sendMail';

const { Email } = DAO.Mongo.Models;

const init = async () => {
  let schedulerDone = false;

  schedule.scheduleJob('*/5 * * * * *', async () => {
    if (schedulerDone) {
      return;
    }
    schedulerDone = true;

    const emails = await Email.find({ sent: false, env: config.env });

    for (const email of emails) {
      try {
        if (!email.template) {
          await Email.deleteOne({ _id: email._id });
        } else {
          const { language } = email;

          let path = `${config.templatesPath}/${language}/${email.template}.html`;

          if (!fs.existsSync(path)) {
            path = `${config.templatesPath}/en/${email.template}.html`;
          }

          const file = await readHTMLFile(path);
          const template = handlebars.compile(file);
          const html = template({ ...(email.replacements || {}), appTitle: config.appTitle });

          await sendMail({
            from: email.from,
            to: email.to,
            subject: email.subject,
            html,
          });
          const entry = await Email.findById(email._id);
          entry.sent = true;
          entry.dateSent = Date.now();
          await entry.save();
        }
      } catch (e) {
        console.log(e);
      }
    }

    schedulerDone = false;
  });

  console.log('mail scheduler system online'.green);
};

const MailSchedulerSystem = { init };

export default MailSchedulerSystem;
