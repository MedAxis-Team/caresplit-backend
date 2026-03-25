import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

const envResult = dotenv.config();

if (envResult.error) {
  console.error('Failed to load .env file', envResult.error);
  process.exit(1);
}

const PORT = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database', error);
    process.exit(1);
  }
};

startServer();
