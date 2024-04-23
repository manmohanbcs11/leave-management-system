import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import leaveRouter from './routes/leave.routes';

dotenv.config();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use('/api/auth/', authRouter);
app.use('/api/user/', userRouter);
app.use('/api/leave/', leaveRouter);

app.listen(port, () => {
  return console.log(`Leave Management backend is listening at http://localhost:${port}`);
});
