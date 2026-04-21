import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes';
dotenv.config();

const app = express();
const PORT=process.env.PORT||5000;
//to allow cross-origin requests for frontend with backend
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes)
app.use('/api/bookings',bookingRoutes);
app.get('/',(req:Request, res:Response)=>{
    res.status(200).json({
        message:'Welcome to GEZA API',
        status:"server is running"
    });
});

app.listen(PORT,()=>{
    console.log(`Server is working on http://localhost:${PORT}`)
});
