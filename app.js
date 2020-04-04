import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import postcssMiddleware from 'postcss-middleware';
import sassMiddleware from 'node-sass-middleware';

import globalRouter from './routers/globalRouter';
import { localsMiddleware } from './middlewares';
import routes from './routes';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import postcssConfig from './postcss.config';

import './passport';

dotenv.config();

const app = express();

const CookieStore = MongoStore(expressSession);

const staticDir = path.resolve(__dirname, './', 'public');

app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());

app.use(expressSession({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new CookieStore({ mongooseConnection: mongoose.connection }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  sassMiddleware({
    src: path.join(staticDir, 'stylesheets'),
    dest: path.join(staticDir, 'stylesheets'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
    outputStyle: 'extended',
    prefix: '/css',
  }),
);
app.use('/css', postcssMiddleware(postcssConfig));
app.use(express.static(staticDir));
app.use(localsMiddleware);
app.use('/uploads', express.static('uploads'));

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
