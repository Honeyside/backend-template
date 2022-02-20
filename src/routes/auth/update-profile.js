const { findUserById, findUserByEmail, findUserByUsername } = require("../../dao/users");
const isEmpty = require('../../utils/isEmpty');
const regexUsername = require('../../utils/regexUsername');
const validator = require('validator');
const dictionary = require('../../dictionaries/auth');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const secret = config.secret || 'default secret';
const getTranslation = require("../../utils/getTranslation");

module.exports = async (req, res) => {
  let { firstName, lastName, username, email } = req.fields;
  const language = req.query.language;

  if (req.user.roles.includes('root')) {
    return res.status(500).json({ status: 'error', message: 'root user can not be edited via api', generic: true });
  }

  let user, result;
  let errors = {};

  username = username ? username.toLowerCase() : null;
  email = email ? email.toLowerCase() : null;

  try {
    user = await findUserById(req.user.id);
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'database read error', generic: true });
  }

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'user not found', generic: true });
  }

  if (isEmpty(firstName)) {
    errors.firstName = getTranslation({ dictionary, code: 'first-name-required', language });
  } else {
    user.firstName = firstName;
  }

  if (isEmpty(lastName)) {
    errors.lastName = getTranslation({ dictionary, code: 'last-name-required', language });
  } else {
    user.lastName = lastName;
  }

  if (isEmpty(username)) {
    errors.username = getTranslation({ dictionary, code: 'username-required', language });
  } else {
    username = regexUsername(username);

    if (username !== req.user.username) {
      if (await findUserByUsername(username)) {
        errors.username = getTranslation({ dictionary, code: 'username-already-in-use', language });
      } else {
        user.username = username;
      }
    }
  }

  if (isEmpty(email)) {
    errors.email = getTranslation({ dictionary, code: 'email-required', language });
  } else {
    if (!validator.isEmail(email)) {
      errors.email = getTranslation({ dictionary, code: 'invalid-email', language });
    } else {
      if (email !== req.user.email) {
        if (await findUserByEmail(email)) {
          errors.email = getTranslation({ dictionary, code: 'email-already-in-use', language });
        } else {
          user.email = email;
        }
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ status: 'error', ...errors });
  }

  try {
    result = await user.save();
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'database write error', generic: true });
  }

  jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      lastLogin: user.lastLogin
    }, secret,
    { expiresIn: Number.MAX_SAFE_INTEGER },
    (err, token) => {
      if (err) return res.status(500).json({ status: 'error', message: 'error signing token', generic: true });
      res.status(200).json({ status: 'ok', token, result });
    }
  );
};
