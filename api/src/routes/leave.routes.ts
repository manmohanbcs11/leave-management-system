import express, { Request, Response, Router } from 'express';
import { processRequest } from '../common/utils';
import { LeaveController } from '../controller/leaveController';
import { authorizer } from '../middleware/authorizer';

const leaveRouter: Router = express.Router();
const leaveController = new LeaveController();

// get all leaves for a user
leaveRouter.get('/fetchleaves', authorizer, async (req: Request, res: Response) => {
  await processRequest(leaveController.getAllLeaves, req, res);
});

// get leave by id
leaveRouter.get('/getleave/:id', authorizer, async (req: Request, res: Response) => {
  await processRequest(leaveController.getLeaveById, req, res);
});

// create leave request
leaveRouter.post('/createleave', authorizer, async (req: Request, res: Response) => {
  await processRequest(leaveController.createLeave, req, res);
});

// update leave request & status
leaveRouter.put('/updateleave', authorizer, async (req: Request, res: Response) => {
  await processRequest(leaveController.updateLeave, req, res);
});

// delete leave by id
leaveRouter.delete('/deleteleave/:id', authorizer, async (req: Request, res: Response) => {
  await processRequest(leaveController.deleteLeaveById, req, res);
});

export default leaveRouter;
