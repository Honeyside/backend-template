import Models from '../Models';

const { Email } = Models;

const queueMessage = async (data) => {
  return Email({
    from: data.from,
    to: data.to,
    subject: data.subject,
    template: data.template,
    replacements: data.replacements,
    language: data.language,
  }).save();
};

const Mailbox = {
  queueMessage,
};

export default Mailbox;
