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
      let customFileName = crypto.randomBytes(18).toString('hex'),
        fileExtension = path.parse(file.originalname).ext; // get file extension from original file name
      cb(null, customFileName + fileExtension);
    }
  })
});

export const localsMiddleware = (req, res, next) => {
  res.locals.routes = routes;
  res.locals.siteName = 'WeTube';
  res.locals.user = {
    isAuthenticated: true,
    id: 1
  };
  next();
};

export const uploadVideo = multerVideo.single('video');
