import {Express} from 'express';
import user_controller from './controllers/user.controller';
import app from './app';
import health from './controllers/health.controller';
import auth_controller from './controllers/auth.controller';

const routes = (app: Express): void => {
  app.use('/v1/health', health);
  app.use('/v1/user', user_controller);
  app.use('/v1/auth', auth_controller);
};

export default routes;