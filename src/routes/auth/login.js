import Express from 'express';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import config from '../../../config';
import isEmpty from '../../utils/isEmpty';
import regexUsername from '../../utils/regexUsername';
import DAO from '../../dao';
import dictionary from '../../dictionaries/auth';
import getTranslation from '../../utils/getTranslation';

const router = Express.Router();
const { secret } = config;

router.post('*', async (req, res) => {
  let { username } = req.fields;
  const { password } = req.fields;
  const { language } = req.query;

  if (isEmpty(username)) {
    return res.status(400).json({
      status: 'error',
      message: 'username required',
      username: getTranslation({ dictionary, code: 'username-required', language }),
    });
  }

  if (isEmpty(password)) {
    return res.status(400).json({
      status: 'error',
      message: 'password required',
      username: getTranslation({ dictionary, code: 'password-required', language }),
    });
  }

  const email = username.toLowerCase();
  username = regexUsername(username);

  let user;

  try {
    user = await DAO.Users.findUserByUsername(username);
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'database read error' });
  }

  if (!user) {
    try {
      user = await DAO.Users.findUserByEmail(email);
    } catch (e) {
      return res.status(500).json({ status: 'error', message: 'database read error' });
    }
  }

  if (!user) {
    return res.status(400).json({ status: 'error', message: 'user not found', username: getTranslation({ dictionary, code: 'user-not-found', language }) });
  }

  return argon2.verify(user.password, password).then(async (valid) => {
    if (valid) {
      jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
          preference: user.preference,
        },
        secret,
        { expiresIn: Number.MAX_SAFE_INTEGER },
        async (err, token) => {
          if (err) {
            return res.status(500).json({ status: 'error', message: 'error signing token' });
          }
          user.lastLogin = Date.now();
          await user.save();
          return res.status(200).json({ status: 'success', token });
        }
      );
    } else {
      res.status(400).json({ status: 'error', message: 'wrong password', password: getTranslation({ dictionary, code: 'wrong-password', language }) });
    }
  });
});

export default router;
