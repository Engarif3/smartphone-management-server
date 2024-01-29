import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

// app.use(cors());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/api', router);

const test = async (req: Request, res: Response) => {
  res.send('<h2>Welcome to Smartphone Management</h2>');
};

app.get('/', test);

app.use(globalErrorHandler);
//Not Found
app.use(notFound);
export default app;
