import express from 'express';

import {deleteVideo, editVideo, getUpload, postUpload, videoDetail} from '../controllers/videoController';
import routes from '../routes';
import { uploadVideo } from '../middlewares';

const videoRouter = express.Router();

videoRouter.get(routes.upload, getUpload);
videoRouter.get(routes.videoDetail(), videoDetail);
videoRouter.get(routes.editVideo(), editVideo);
videoRouter.get(routes.deleteVideo(), deleteVideo);

videoRouter.post(routes.upload, uploadVideo, postUpload);

export default videoRouter;
