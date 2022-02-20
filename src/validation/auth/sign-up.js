import * as Yup from 'yup';
import Dictionary from '../../dictionary';
import Utils from '../../utils';

const signUp = async (req, res, next) => {
  const {
    firstName, lastName, email, username, password,
  } = req.fields;
  const { language } = req.query;

  const schema = Yup.object().shape({

    firstName: Yup
      .string(
        Utils.getTranslation({
          dictionary: Dictionary.Auth, code: 'first-name-required', language,
        })
      )
      .required(
        Utils.getTranslation({
          dictionary: Dictionary.Auth, code: 'password-required', language,
        })
      ),

    lastName: Yup
      .string(
        Utils.getTranslation({
          dictionary: Dictionary.Auth, code: 'last-name-required', language,
        })
      )
      .required(
        Utils.getTranslation({
          dictionary: Dictionary.Auth, code: 'password-required', language,
        })
      ),

    email: Yup
      .string(
        Utils.getTranslation({
          dictionary: Dictionary.Auth, code: 'email-required', language,
        })
      )
      .required(
        Utils.getTranslation({
          dictionary: Dictionary.Auth, code: 'password-required', language,
        })
      )
      .email(
        Utils.getTranslation({
          dictionary: Dictionary.Auth, code: 'invalid-email', language,
        })
      ),

    username: Yup
      .string(
        Utils.getTranslation({
          dictionary: Dictionary.Auth, code: 'password-required', language,
        })
      )
      .required(
        Utils.getTranslation({
          dictionary: Dictionary.Auth, code: 'username-required', language,
        })
      ),

    password: Yup
      .string(
        Utils.getTranslation({
          dictionary: Dictionary.Auth, code: 'password-required', language,
        })
      )
      .required(
        Utils.getTranslation({
          dictionary: Dictionary.Auth, code: 'password-required', language,
        })
      )
      .min(
        6,
        Utils.getTranslation({
          dictionary: Dictionary.Auth, code: 'password-too-short', language,
        })
      ),

  });

  try {
    await schema.validate({
      firstName, lastName, email, username, password,
    }, { abortEarly: false });
    next();
  } catch (e) {
    res.status(400).json(Utils.mapErrors(e));
  }
};

export default signUp;
