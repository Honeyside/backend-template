import * as Yup from 'yup';
import Dictionary from '../../dictionary';
import Utils from '../../utils';

const login = async (req, res, next) => {
  const { username, password } = req.fields;
  const { language } = req.query;

  const schema = Yup.object().shape({
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
      ),
  });

  try {
    await schema.validate({ username, password }, { abortEarly: false });
    next();
  } catch (e) {
    res.status(400).json(Utils.mapErrors(e));
  }
};

export default login;
