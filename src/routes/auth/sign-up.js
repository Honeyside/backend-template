import Express from 'express';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import Utils from '../../utils';
import DAO from '../../dao';
import Dictionary from '../../dictionary';

const router = Express.Router();
const { secret } = config;

router.post('*', async (req, res) => {
  const {
    firstName, lastName, password,
  } = req.fields;
  let {
    email, username,
  } = req.fields;
  const { language } = req.query;

  let user;

  const errors = {};

  username = username ? username.toLowerCase() : null;
  email = email ? email.toLowerCase() : null;

  username = Utils.regexUsername(username);

  if (await DAO.Users.findUserByUsername(username)) {
    errors.username = Utils.getTranslation({
      dictionary: Dictionary.Auth, code: 'username-already-in-use', language,
    });
  }

  if (await DAO.Users.findUserByEmail(email)) {
    errors.email = Utils.getTranslation({
      dictionary: Dictionary.Auth, code: 'email-already-in-use', language,
    });
  }

  if (password.length < 6) {
    errors.password = Utils.getTranslation({
      dictionary: Dictionary.Auth, code: 'password-too-short', language,
    });
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ...errors });
  }

  try {
    user = await DAO.Users.insertUser({
      firstName,
      lastName,
      username,
      email,
      password,
      roles: ['standard'],
    });
  } catch (e) {
    return res.status(500).json({
      message: Utils.getTranslation({
        dictionary: Dictionary.Auth, code: 'database-read-error', language,
      }),
    });
  }

  const replacements = {
    firstName,
    extra: Utils.getTranslation({
      dictionary: Dictionary.Auth, language, code: 'welcome',
    }),
    supportEmailAddress: config.supportEmailAddress,
  };

  if (config.mailerEnabled) {
    await DAO.Mailbox.queueMessage({
      from: config.nodemailer.from,
      to: email,
      subject: `${config.appTitle} - ${Utils.getTranslation({
        dictionary: Dictionary.Auth, language, code: 'welcome',
      })}`,
      template: 'welcome',
      replacements,
      language,
    });
  }

  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    },
    secret,
    { expiresIn: Number.MAX_SAFE_INTEGER },
    async (err, token) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: 'error signing token' });
      }
      user.lastLogin = Date.now();
      await user.save();
      return res.status(200).json({ status: 'success', token, user });
    },
  );
});

export default router;
