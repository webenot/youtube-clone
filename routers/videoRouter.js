import express from 'express';

import {
  deleteVideo,
  getEditVideo,
  getUpload,
  postUpload,
  videoDetail,
  postEditVideo
} from '../controllers/videoController';
import routes from '../routes';
import { uploadVideo } from '../middlewares';

const videoRouter = express.Router();

videoRouter.get(routes.upload, getUpload);
videoRouter.get(routes.videoDetail(), videoDetail);
videoRouter.get(routes.editVideo(), getEditVideo);
videoRouter.get(routes.deleteVideo(), deleteVideo);

videoRouter.post(routes.upload, uploadVideo, postUpload);
videoRouter.post(routes.editVideo(), postEditVideo);

export default videoRouter;
