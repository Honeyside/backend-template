const { findUserById, findUserByUsername, findUserByEmail } = require("../../../dao/users");
const argon2 = require('argon2');
const isEmpty = require('../../../utils/isEmpty');
const validator = require('validator');
const dictionary = require('../../../dictionaries/users');
const regexUsername = require('../../../utils/regexUsername');

module.exports = async (req, res) => {
  let { id, firstName, lastName, username, email, password, roles } = req.fields;

  if (!req.user.roles.includes('admin')) {
    return res.status(401).json({ status: "error", message: "must be an admin" })
  }

  let user, result;

  let errors = {};

  try {
    user = await findUserById(id);
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'database read error' });
  }

  if (user.roles.includes('root')) {
    return res.status(500).json({ status: 'error', message: 'root user can not be edited via api', generic: true });
  }

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'user not found' });
  }

  username = username ? username.toLowerCase() : null;
  email = email ? email.toLowerCase() : null;

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'user not found', generic: true });
  }

  if (isEmpty(firstName)) {
    errors.firstName = dictionary['first-name-required'];
  } else {
    user.firstName = firstName;
  }

  if (isEmpty(lastName)) {
    errors.lastName = dictionary['last-name-required'];
  } else {
    user.lastName = lastName;
  }

  if (isEmpty(username)) {
    errors.username = dictionary['username-required'];
  } else {
    username = regexUsername(username);

    if (username !== user.username) {
      if (await findUserByUsername(username)) {
        errors.username = dictionary['username-already-in-use'];
      } else {
        user.username = username;
      }
    }
  }

  if (isEmpty(email)) {
    errors.email = dictionary['email-required'];
  } else {
    if (!validator.isEmail(email)) {
      errors.email = dictionary['invalid-email'];
    } else {
      if (email !== user.email) {
        if (await findUserByEmail(email)) {
          errors.email = dictionary['email-already-in-use'];
        } else {
          user.email = email;
        }
      }
    }
  }

  if (!isEmpty(password)) {
    if (password.length < 6) {
      return res.status(400).json({ status: 'error', message: 'password too short', password: dictionary['password-too-short'] });
    }
    user.password = await argon2.hash(password);
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ status: 'error', ...errors });
  }

  if (roles) {
    user.roles = roles;
  }

  try {
    result = await user.save();
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'database write error' });
  }

  result = result.toObject();
  result.id = result._id;
  result.fullName = `${result.firstName} ${result.lastName}`;

  res.status(200).json({ status: "success", result });
};
