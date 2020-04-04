import express from 'express';

import {
  changePassword,
  editProfile,
  profile,
  userDetail,
} from '../controllers/userController';
import routes from '../routes';
import { onlyPrivate } from '../middlewares';

const userRouter = express.Router();

// Edit user data
userRouter.get(routes.editProfile, onlyPrivate, editProfile);
userRouter.get(routes.changePassword, onlyPrivate, changePassword);

// User details
userRouter.get(routes.profile, profile);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
