import User from "../models/user_model.js";
import bcrypt from "bcryptjs";
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
        res.status(200).send("User logged in")
    }
    catch(err){
        res.status(500).send(err)
    }
}

export {RegisterUser,LoginUser}