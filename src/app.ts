import cors from 'cors';
import express from 'express';
import healthRouter from './routes/health.routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'CareSplit API is running' });
});

app.use('/api', healthRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
