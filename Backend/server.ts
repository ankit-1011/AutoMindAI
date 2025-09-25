import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use('/auth',)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

