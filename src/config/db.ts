import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoUrl = process.env.MONGO_URL?.trim() || process.env.MONGO_URI?.trim();

  if (!mongoUrl) {
    throw new Error('MONGO_URL or MONGO_URI is not defined in environment variables');
  }

  await mongoose.connect(mongoUrl);
  console.log('MongoDB connected successfully');
};

export const dbConnection = mongoose.connection;
