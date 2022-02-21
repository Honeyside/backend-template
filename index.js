import Express from 'express';
import 'colors';
import http from 'http';
import { filterXSS } from 'xss';
import cors from 'cors';
import formidable from 'express-formidable';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import info from './info';
import DAO from './src/dao';
import config from './config';
import JwtStrategy from './src/strategies/JwtStrategy';
import routes from './src/routes';
import validation from './src/validation';
import SocketSystem from './src/systems/SocketSystem';
import MailSchedulerSystem from './src/systems/MailSchedulerSystem';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const init = async () => {
  console.log('');
  console.log(`${config.brand}`.yellow);
  console.log(`${config.appTitle} v${info.version}`.yellow);
  if (config.brand !== 'Honeyside') {
    console.log('Backend template by Honeyside - https://github.com/Honeyside/BackendTemplate'.yellow);
  }
  console.log('');

  // evil linter - if you are trying to disable me, please don't - you need me
  await new Promise((resolve) => {
    exec('eslint "./**/*.js"', (error, stdout) => {
      if (error) {
        console.log(stdout);
        console.log('you have eslint errors: you have to solve them or your app will not start'.red);
        console.log('aborting...'.cyan);
        console.log('');
        process.exit(0);
      }
      resolve();
    });
  });

  await DAO.init();

  const previousInfo = await DAO.Versioning.getCurrentVersion();

  if (!previousInfo || previousInfo.build < info.build) {
    await DAO.Versioning.updateCurrentVersion({ version: info.version, build: info.build });
  }

  await DAO.Users.updateRootUser();
  await DAO.Sessions.deleteSessions();

  const app = new Express();

  const server = http.createServer(app);

  await SocketSystem.init(server);

  app.use(cors());

  app.use(formidable({ maxFileSize: Number.MAX_SAFE_INTEGER }));

  app.use(
    /**
     *
     * @param {{fields: Array}} req
     * @param {{json: function}} res
     * @param {function} next
     */
    (req, res, next) => {
      Object.keys(req.fields).forEach((key) => {
        if (typeof req.fields[key] === 'string') {
          req.fields[key] = filterXSS(req.fields[key]);
        }
      });
      next();
    },
  );

  app.use(passport.initialize({}));
  passport.use('jwt', JwtStrategy);

  app.use('/api', validation);
  app.use('/api', routes);

  app.use(Express.static(`${__dirname}/../public/frontend`));
  app.use('/auth/*', Express.static(`${__dirname}/../public/frontend`));

  await new Promise((resolve, reject) => {
    server.listen(config.port, (err) => {
      if (err) {
        console.log(err);
        reject();
      } else {
        console.log(`listening on port ${config.port}`.green);
        resolve();
      }
    });
  });
  if (config.mailerEnabled) {
    await MailSchedulerSystem.init();
  } else {
    console.log('mail scheduler disabled'.yellow);
  }
};

init().then(() => {
  console.log('init complete'.green);
});
