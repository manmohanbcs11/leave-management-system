import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use('/api/auth/', authRouter);

app.listen(port, () => {
  return console.log(`Leave portal backend is listening at http://localhost:${port}`);
});
