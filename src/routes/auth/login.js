import Express from 'express';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import config from '../../../config';
import Utils from '../../utils';
import DAO from '../../dao';
import Dictionary from '../../dictionary';

const router = Express.Router();
const { secret } = config;

router.post('*', async (req, res) => {
  let { username } = req.fields;
  const { password } = req.fields;
  const { language } = req.query;

  const email = username.toLowerCase();
  username = Utils.regexUsername(username);

  let user;

  try {
    user = await DAO.Users.findUserByUsername(username);
  } catch (e) {
    return res.status(500).json({
      username: Utils.getTranslation({ dictionary: Dictionary.Auth, code: 'database-read-error', language })
    });
  }

  if (!user) {
    try {
      user = await DAO.Users.findUserByEmail(email);
    } catch (e) {
      return res.status(500).json({
        username: Utils.getTranslation({ dictionary: Dictionary.Auth, code: 'database-read-error', language })
      });
    }
  }

  if (!user) {
    return res.status(400).json({
      username: Utils.getTranslation({ dictionary: Dictionary.Auth, code: 'user-not-found', language })
    });
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
            return res.status(500).json({
              username: Utils.getTranslation({ dictionary: Dictionary.Auth, code: 'error-while-signing-token', language })
            });
          }
          user.lastLogin = Date.now();
          await user.save();
          return res.status(200).json({ status: 'success', token });
        }
      );
    } else {
      res.status(400).json({
        password: Utils.getTranslation({ dictionary: Dictionary.Auth, code: 'wrong-password', language }),
      });
    }
  });
});

export default router;
