import express from 'express';

import {
  postRegisterView,
  postAddComment,
  deleteComment,
} from '../controllers/videoController';
import routes from '../routes';
import { onlyPrivate } from '../middlewares';

const apiRouter = express.Router();

// Register View
apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.delete(routes.deleteComment, onlyPrivate, deleteComment);

export default apiRouter;
