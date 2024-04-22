import express, { Request, Response, Router } from 'express';
import { UserController } from '../controller/userController';
import { processRequest } from '../common/utils';
import { authorizer } from '../middleware/authorizer';

const userRouter: Router = express.Router();
const userController = new UserController();

// create user by Admin
userRouter.post('/createuser', authorizer, async (req: Request, res: Response) => {
  await processRequest(userController.createUserByAdmin, req, res);
});

// get user information
userRouter.get('/getuser', authorizer, async (req: Request, res: Response) => {
  await processRequest(userController.getuser, req, res);
});

// update user details
userRouter.put('/updateuser', authorizer, async (req: Request, res: Response) => {
  await processRequest(userController.updateuser, req, res);
});

// delete user by emailId
userRouter.delete('/deleteuser/:emailid', authorizer, async (req: Request, res: Response) => {
  await processRequest(userController.deleteuser, req, res);
});

export default userRouter;
