import {Express} from 'express';

import app from './app';
import health from './controllers/health.controller'

const routes = (app: Express): void => {
  app.use('/v1/health', health)
};

export default routes;