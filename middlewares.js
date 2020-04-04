import crypto from 'crypto';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

import routes from './routes';

const multerVideo = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads');
      }
      if (!fs.existsSync('uploads/videos')) {
        fs.mkdirSync('uploads/videos');
      }
      cb(null, 'uploads/videos');
    },
    filename: (req, file, cb) => {
      const customFileName = crypto.randomBytes(18).toString('hex');
      // get file extension from original file name
      const fileExtension = path.parse(file.originalname).ext;
      cb(null, customFileName + fileExtension);
    },
  }),
});

const multerAvatar = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads');
      }
      if (!fs.existsSync('uploads/avatars')) {
        fs.mkdirSync('uploads/avatars');
      }
      cb(null, 'uploads/avatars');
    },
    filename: (req, file, cb) => {
      const customFileName = crypto.randomBytes(18).toString('hex');
      // get file extension from original file name
      const fileExtension = path.parse(file.originalname).ext;
      cb(null, customFileName + fileExtension);
    },
  }),
});

export const localsMiddleware = (req, res, next) => {
  res.locals.routes = routes;
  res.locals.siteName = 'WeTube';
  res.locals.loggedUser = req.user || null;
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};
export const onlyPrivate = (req, res, next) => {
  if (!req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const uploadVideo = multerVideo.single('video');
export const uploadAvatar = multerAvatar.single('avatar');
