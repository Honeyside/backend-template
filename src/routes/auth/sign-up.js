const router = require('express').Router();
const config = require('../../../config');
const secret = config.secret || 'default secret';
const jwt = require('jsonwebtoken');
const isEmpty = require('../../utils/isEmpty');
const regexUsername = require('../../utils/regexUsername');
const getTranslation = require('../../utils/getTranslation');
const { Email } = require('../../models');
const { findUserByUsername, findUserByEmail, insertUser} = require('../../dao/users');
const dictionary = require('../../dictionaries/auth');
const validator = require('validator');

router.post('*', async (req, res) => {
  let { firstName, lastName, email, username, password } = req.fields;

  const language = req.query.language;

  let user;

  let errors = {};

  username = username ? username.toLowerCase() : null;
  email = email ? email.toLowerCase() : null;

  if (isEmpty(firstName)) {
    errors.firstName = getTranslation({ dictionary, code: 'first-name-required', language });
  }

  if (isEmpty(lastName)) {
    errors.lastName = getTranslation({ dictionary, code: 'last-name-required', language });
  }

  if (isEmpty(username)) {
    errors.username = getTranslation({ dictionary, code: 'username-required', language });
  } else {
    username = regexUsername(username);

    if (await findUserByUsername(username)) {
      errors.username = getTranslation({ dictionary, code: 'username-already-in-use', language });
    }
  }

  if (isEmpty(email)) {
    errors.email = getTranslation({ dictionary, code: 'email-required', language });
  } else {
    if (!validator.isEmail(email)) {
      errors.email = getTranslation({ dictionary, code: 'invalid-email', language });
    } else {
      if (await findUserByEmail(email)) {
        errors.email = getTranslation({ dictionary, code: 'email-already-in-use', language });
      }
    }
  }

  if (isEmpty(password)) {
    errors.password = getTranslation({ dictionary, code: 'password-required', language });
  } else {
    if (password.length < 6) {
      errors.password = getTranslation({ dictionary, code: 'password-too-short', language });
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ status: "error", ...errors });
  }

  try {
    user = await insertUser({
      firstName,
      lastName,
      username,
      email,
      password,
      roles: ['standard'],
    });
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'database write error', generic: true });
  }

  const replacements = {
    firstName,
    extra: getTranslation({ dictionary, language, code: 'welcome' }),
    supportEmailAddress: config.supportEmailAddress,
  };

  if (config.mailerEnabled) {
    const entry = new Email({
      from: config.nodemailer.from,
      to: email,
      subject: `${config.appTitle} - ${getTranslation({dictionary, language, code: 'welcome'})}`,
      template: 'welcome',
      replacements,
      language,
    });

    await entry.save();
  }

  jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    }, secret,
    { expiresIn: Number.MAX_SAFE_INTEGER },
    async (err, token) => {
      if (err) return res.status(500).json({ status: 'error', message: 'error signing token' });
      user.lastLogin = Date.now();
      await user.save();
      res.status(200).json({ status: 'success', token, user });
    }
  );
});

module.exports = router;
