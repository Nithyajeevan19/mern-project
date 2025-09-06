import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cors from 'cors'

import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use("/api", todoRoutes); 

app.use('/api',authRoutes)


app.listen(7000, () => console.log("Server running on port 5000"));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  }); 




