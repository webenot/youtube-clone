import express from 'express';

import {
  getChangePassword,
  getEditProfile,
  postChangePassword,
  postEditProfile,
  profile,
  userDetail,
} from '../controllers/userController';
import routes from '../routes';
import { onlyPrivate, uploadAvatar } from '../middlewares';

const userRouter = express.Router();

// Edit user data
userRouter.get(routes.editProfile, onlyPrivate, getEditProfile);
userRouter.post(routes.editProfile, onlyPrivate, uploadAvatar, postEditProfile);
userRouter.get(routes.changePassword, onlyPrivate, getChangePassword);
userRouter.post(routes.changePassword, onlyPrivate, postChangePassword);

// User details
userRouter.get(routes.profile, profile);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
