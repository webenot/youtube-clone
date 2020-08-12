import express from 'express';

import { postRegisterView } from '../controllers/videoController';
import routes from '../routes';

const apiRouter = express.Router();

// Register View
apiRouter.post(routes.registerView, postRegisterView);

export default apiRouter;
