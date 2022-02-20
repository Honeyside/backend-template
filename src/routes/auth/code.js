const router = require('express').Router();
const { AuthCode, Email, User } = require('../../models');
const config = require('../../../config');
const randomstring = require('randomstring');
const moment = require('moment');
const isEmpty = require('../../utils/isEmpty');
const dictionary = require('../../dictionaries/auth');
const validator = require("validator");
const getTranslation = require("../../utils/getTranslation");

router.post('*', async (req, res) => {
  let { email } = req.fields;
  const language = req.query.language;

  if (isEmpty(email)) {
    return res.status(400).json({ status: 'error', email: getTranslation({ dictionary, code: 'email-required', language }) });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ status: 'error', email: getTranslation({ dictionary, code: 'invalid-email', language }) });
  }

  let user;

  try {
    user = await User.findOne({ email });
  } catch (e) {
    return res.status(500).json({ status: 'error', email: 'error while reading database' });
  }

  if (!user) {
    return res.status(500).json({ status: 'error', email: getTranslation({ dictionary, code: 'user-not-found', language }) });
  }

  await AuthCode.updateMany({ user }, { $set: { valid: false } });

  const authCode = new AuthCode({
    code: randomstring.generate({ charset: 'numeric', length: 6 }),
    valid: true,
    user: user._id,
    expires: moment().add(10, 'minutes').toDate(),
  });

  authCode.save();

  if (config.mailerEnabled) {
    const replacements = {
      firstName: user.firstName,
      appName: config.appTitle,
      code: authCode.code,
      supportEmailAddress: config.supportEmailAddress,
    };

    const entry = new Email({
      from: config.nodemailer.from,
      to: user.email,
      subject: `${config.appTitle || 'Barba Studio'} - ${getTranslation({dictionary, code: 'auth-code', language})}`,
      template: 'code',
      replacements,
      language: req.query.language,
    });

    await entry.save();
  }

  res.status(200).json({ status: 'status', message: 'email queued' });
});

module.exports = router;
