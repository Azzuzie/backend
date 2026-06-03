import User from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const secretKey="mysecretkey"

async function RegisterUser(req,res){
    try{
        const {name,email,password}=req.body;
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword=await bcrypt.hash(password,salt)
        const user=new User({name,email,password:encryptedPassword})
        user.save()
            .then(()=>{res.status(200).send("User Registered")})
            .catch((err)=>{res.status(400).send(err)})
    }
    catch(err){
        res.status(500).send(err)
    }
}

async function LoginUser(req,res){
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email})   
        if(!user){
            return res.status(400).send("User not found")
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).send("Invalid credentials")
        }
        const token=jwt.sign({email},secretKey,{expiresIn:'1h'})
        res.status(200).json({message:"Login successful",token})
    }
    catch(err){
        res.status(500).send(err)
    }
}

function validateToken(req,res){
    const token=req.body.token
    if(!token){
        return res.status(401).send("Access denied. No token provided.")
    }
    try{
        const decoded=jwt.verify(token,secretKey)
        req.user=decoded
        res.status(200).json({message:"Token is valid",user:req.user})
    }
    catch(err){
        res.status(400).send("Invalid token")
    }
}
export {RegisterUser,LoginUser,validateToken}

