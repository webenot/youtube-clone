import express from 'express';

import { home, search } from '../controllers/videoController';
import {
  fbAuthenticate,
  fbLogin,
  getJoin,
  getLogin,
  githubAuthenticate,
  githubLogin,
  logout,
  postFbLogin,
  postGithubLogin,
  postJoin,
  postLogin,
} from '../controllers/userController';
import routes from '../routes';
import { onlyPrivate, onlyPublic } from '../middlewares';

const globalRouter = express.Router();

// Home
globalRouter.get(routes.home, home);

// Register
globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

// Login
globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

// Third party auth services callbacks
globalRouter.get(routes.githubAuth, githubLogin);
globalRouter.get(routes.githubCallback, githubAuthenticate, postGithubLogin);
globalRouter.get(routes.fbAuth, fbLogin);
globalRouter.get(routes.fbCallback, fbAuthenticate, postFbLogin);

// Logout
globalRouter.get(routes.logout, onlyPrivate, logout);

// Search video
globalRouter.get(routes.search, search);

export default globalRouter;
