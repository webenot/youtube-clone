import dotenv from 'dotenv';
import passport from 'passport';
import passportGithub from 'passport-github2';

import { githubLoginCallback } from './controllers/userController';
import routes from './routes';
import User from './models/User';

dotenv.config();

passport.use(User.createStrategy());

passport.use(new passportGithub.Strategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `http://127.0.0.1:4000${routes.githubCallback}`,
}, githubLoginCallback));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
