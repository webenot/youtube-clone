import express from 'express';

import { home, search } from '../controllers/videoController';
import {
  getJoin,
  getLogin,
  logout,
  postJoin,
  postLogin,
} from '../controllers/userController';
import routes from '../routes';

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.join, getJoin);
globalRouter.get(routes.login, getLogin);
globalRouter.get(routes.logout, logout);
globalRouter.get(routes.search, search);

globalRouter.post(routes.join, postJoin);
globalRouter.post(routes.login, postLogin);

export default globalRouter;
