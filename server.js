import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/user_route.js';

const app=express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/newDB')
.then(()=>{console.log("Connected to MongoDB")})

app.use(userRoute)

app.get('/',(req,res)=>{
    res.send("Hello Azzu");
})

app.listen(4400,()=>{
    console.log("Server started at port 4400");
})