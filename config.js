import env from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import isEmpty from './src/utils/isEmpty';
import info from './info';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

env.config();

export default {
  env: process.env.ENV || 'local',
  templatesPath: `${__dirname}/src/templates`,
  brand: process.env.BRAND || 'Honeyside',
  appTitle: process.env.APP_TITLE || 'Backend Template',
  appVersion: info.version,
  appBuild: info.build,
  verbose: process.env.VERBOSE === 'true',
  port: process.env.PORT || 80,
  prefix: `v${info.api}`,
  rootUser: {
    username: process.env.ROOT_USER_USERNAME,
    email: process.env.ROOT_USER_EMAIL,
    password: process.env.ROOT_USER_PASSWORD,
    firstName: process.env.ROOT_USER_FIRST_NAME,
    lastName: process.env.ROOT_USER_LAST_NAME,
  },
  mongo: {
    uri: process.env.MONGO_URI,
    srv: (process.env.MONGO_SRV || '').toString() === 'true',
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    authenticationDatabase: process.env.MONGO_AUTHENTICATION_DATABASE,
    hostname: process.env.MONGO_HOSTNAME,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DATABASE_NAME || 'barba',
  },
  secret: process.env.AUTH_SECRET || 'enterprise-messaging-platform',
  baseUrl: process.env.BASE_URL || 'http://localhost:4000',
  thumbnail: [{
    key: 'little',
    size: 128,
    type: 'crop', // types are crop, width, height
  }, {
    key: 'medium',
    size: 256,
    type: 'crop', // types are crop, width, height
  }, {
    key: 'big',
    size: 512,
    type: 'crop', // types are crop, width, height
  }, {
    key: 'width',
    size: 512,
    type: 'width', // types are crop, width, height
  }],
  mailerEnabled: process.env.MAILER_ENABLED === 'true',
  nodemailer: {
    from: process.env.MAILER_FROM,
  },
  nodemailerTransport: {
    service: isEmpty(process.env.MAILER_SERVICE) ? undefined : process.env.MAILER_SERVICE,
    host: isEmpty(process.env.MAILER_HOST) ? undefined : process.env.MAILER_HOST,
    port: isEmpty(process.env.MAILER_PORT) ? undefined : parseInt(process.env.MAILER_HOST, 10),
    secure: isEmpty(process.env.MAILER_SECURE) ? undefined : process.env.MAILER_SECURE === 'true',
    auth: {
      user: process.env.MAILER_USERNAME,
      pass: process.env.MAILER_PASSWORD,
    },
  },
  nodemailerFooter: process.env.MAILER_FOOTER,
  supportEmailAddress: process.env.SUPPORT_EMAIL_ADDRESS || 'support@example.com',
};
