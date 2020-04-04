import dotenv from 'dotenv';
import passport from 'passport';
import passportFacebook from 'passport-facebook';
import passportGithub from 'passport-github2';

import { fbLoginCallback, githubLoginCallback } from './controllers/userController';
import routes from './routes';
import User from './models/User';

dotenv.config();

passport.use(User.createStrategy());

passport.use(new passportGithub.Strategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `http://127.0.0.1:4000${routes.githubCallback}`,
}, githubLoginCallback));

passport.use(new passportFacebook.Strategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: `https://29833e49.ngrok.io${routes.fbCallback}`,
  profileFields: [ 'id', 'displayName', 'photos', 'email' ],
  scope: [ 'public_profile', 'email' ],
}, fbLoginCallback));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
