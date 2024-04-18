import express, { Request, Response, Router } from 'express';
import { AuthController } from '../controller/authController';
import { processRequest } from '../common/utils';
import { authorizer } from '../middleware/authorizer';

const router: Router = express.Router();
const authController = new AuthController();

// signup a user
router.post('/signup', async (req: Request, res: Response) => {
  await processRequest(authController.signup, req, res);
});

// login a user
router.post('/login', async (req: Request, res: Response) => {
  await processRequest(authController.login, req, res);
});

// get user information by emailId
router.get('/getuser', authorizer, async (req: Request, res: Response) => {
  await processRequest(authController.getuser, req, res);
});

// delete user by emailId
router.delete('/deleteuser/:emailid', authorizer, async (req: Request, res: Response) => {
  await processRequest(authController.deleteuser, req, res);
});

export default router;
