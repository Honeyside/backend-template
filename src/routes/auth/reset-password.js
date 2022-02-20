const router = require('express').Router();
const { AuthCode, Email, User } = require('../../models');
const config = require('../../../config');
const moment = require('moment');
const argon2 = require('argon2');
const dictionary = require('../../dictionaries/auth');
const validator = require('validator');
const isEmpty = require("../../utils/isEmpty");
const getTranslation = require("../../utils/getTranslation");

router.post('*', async (req, res) => {
  let { code, email, password } = req.fields;
  const language = req.query.language;

  let user;
  let authCode;

  if (isEmpty(email)) {
    return res.status(404).json({ status: 'error', email: getTranslation({ dictionary, code: 'email-required', language }) });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ status: 'error', email: getTranslation({ dictionary, code: 'invalid-email', language }) });
  }

  if (!code) {
    return res.status(404).json({ status: 'error', code: getTranslation({ dictionary, code: 'code-required', language }) });
  }

  try {
    user = await User.findOne({ email });
  } catch (e) {
    return res.status(500).json({ status: 'error', code: 'error while reading database' });
  }

  if (!user) {
    return res.status(500).json({ status: 'error', code: getTranslation({ dictionary, code: 'the-associated-user-is-no-longer-valid', language }) });
  }

  try {
    authCode = await AuthCode.findOne({ code, user, valid: true });
  } catch (e) {
    return res.status(500).json({ status: 'error', code: 'error while reading database' });
  }

  if (!authCode) {
    return res.status(404).json({ status: 'error', code: getTranslation({ dictionary, code: 'code-not-found', language }) });
  }

  if (moment(authCode.expires).isBefore(moment())) {
    return res.status(400).json({ status: 'error', code: getTranslation({ dictionary, code: 'code-expired', language }) });
  }

  if (password.length < 6) {
    return res.status(400).json({ status: 'error', password: getTranslation({ dictionary, code: 'password-too-short', language }) });
  }

  user.password = await argon2.hash(password);

  await user.save();

  if (config.mailerEnabled) {
    const entry = new Email({
      from: config.nodemailer.from,
      to: user.email,
      subject: `${config.appTitle || config.appName || 'Barba Studio'} - ${getTranslation({
        dictionary,
        code: 'password-changed',
        language
      })}`,
      template: 'password-changed',
      replacements: {
        supportEmailAddress: config.supportEmailAddress,
      },
    });

    await entry.save();
  }

  res.status(200).json({ status: 'status', message: 'email queued' });
});

module.exports = router;
