import cors from 'cors';
import express from 'express';
import rootRouter from './routes/index.js';


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'CareSplit API is running' });
});

app.use('/api', rootRouter)

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API endpoint not found'
  })
})



export default app;
