import express from 'express';

import routes from '../routes';
import { changePassword, editProfile, home, userDetail } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get(routes.home, home);
userRouter.get(routes.userDetail, userDetail);
userRouter.get(routes.editProfile, editProfile);
userRouter.get(routes.changePassword, changePassword);

export default userRouter;
