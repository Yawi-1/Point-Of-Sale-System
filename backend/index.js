import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './src/config/db.js';
import productRouter from './src/routes/productRoutes.js'
import userRouter from './src/routes/userRoutes.js'
import saleRouter from './src/routes/saleRoutes.js'
const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080 ;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use('/api/product',productRouter)
app.use('/api/auth',userRouter)
app.use('/api/sale',saleRouter)




app.get('/',(req,res)=>{
    res.send('Hello!')
})
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
    connectDB();
})