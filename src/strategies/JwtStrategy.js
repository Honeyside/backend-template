import { Strategy, ExtractJwt } from 'passport-jwt';
import config from '../../config';
import DAO from '../dao';

const { secret } = config;

/**
 *
 * @type {Strategy} JwtStrategy
 */
const JwtStrategy = new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
}, (payload, done) => {
  DAO.Mongo.Models.User.findById(payload.id)
    .then((user) => {
      if (user) {
        return done(null, {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      }
      return done(null, false);
    }).catch((err) => {
      console.error(err);
    });
});

export default JwtStrategy;
