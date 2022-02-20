const { insertUser, findUserByUsername, findUserByEmail } = require("../../../dao/users");
const isEmpty = require('../../../utils/isEmpty');
const validator = require('validator');
const dictionary = require('../../../dictionaries/auth');
const regexUsername = require('../../../utils/regexUsername');

module.exports = async (req, res) => {
  let { firstName, lastName, username, email, password, roles } = req.fields;

  if (!req.user.roles.includes('admin')) {
    return res.status(401).json({ status: "error", message: "must be an admin" })
  }

  let user;

  let errors = {};

  username = username ? username.toLowerCase() : null;
  email = email ? email.toLowerCase() : null;

  if (isEmpty(firstName)) {
    errors.firstName = dictionary['first-name-required'];
  }

  if (isEmpty(lastName)) {
    errors.lastName = dictionary['last-name-required'];
  }

  if (isEmpty(username)) {
    errors.username = dictionary['username-required'];
  } else {
    username = regexUsername(username);

    if (username !== req.user.username) {
      if (await findUserByUsername(username)) {
        errors.username = dictionary['username-already-in-use'];
      }
    }
  }

  if (isEmpty(email)) {
    errors.email = dictionary['email-required'];
  } else {
    if (!validator.isEmail(email)) {
      errors.email = dictionary['invalid-email'];
    } else {
      if (email !== req.user.email) {
        if (await findUserByEmail(email)) {
          errors.email = dictionary['email-already-in-use'];
        }
      }
    }
  }

  if (isEmpty(password)) {
    errors.password = dictionary['password-required'];
  } else {
    if (password.length < 6) {
      errors.password = dictionary['password-too-short'];
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
      roles: roles || ['standard'],
    });
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'database write error', generic: true });
  }

  user = user.toObject();
  user.id = user._id;
  user.fullName = `${user.firstName} ${user.lastName}`;

  res.status(200).json({ status: "success", user });
};
