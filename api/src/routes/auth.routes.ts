import express, { Request, Response, Router } from 'express';
import { processRequest } from '../common/utils';
import { AuthController } from '../controller/authController';

const authRouter: Router = express.Router();
const authController = new AuthController();

// signup a user
authRouter.post('/signup', async (req: Request, res: Response) => {
  await processRequest(authController.signup, req, res);
});

// login a user
authRouter.post('/login', async (req: Request, res: Response) => {
  await processRequest(authController.login, req, res);
});

// logout a user
authRouter.delete('/logout', async (req: Request, res: Response) => {
  res.clearCookie('auth-token');
  res.status(200).send({ message: 'Logged out successfully.' });
});

export default authRouter;
