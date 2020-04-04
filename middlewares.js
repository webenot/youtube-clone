import crypto from 'crypto';
import multer from 'multer';
import path from 'path';

import routes from './routes';

const multerVideo = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
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
