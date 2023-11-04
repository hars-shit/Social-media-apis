const express=require("express")
const User = require("../models/user")
const bcrypt=require('bcrypt')
const router=express.Router()


//Register

router.post("/register",async(req,res)=>{
    try{

        // genreate new password 
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt)

        // create new user 
        const newUser=await User.create({
         username:req.body.username,
         email:req.body.email,
         password:hashedPassword,
        })

        // save user and return res 
    const user=await newUser.save();
    res.status(200).json(user)
   }
   catch(err){
    res.status(500).json(err)
   }
})

// login 

router.post("/login",async(req,res)=>{
    try{

        const user=await User.findOne({email:req.body.email})
        
        if(!user){
            res.status(404).send("User not find")
        }
        const validPassword=await bcrypt.compare(req.body.password,user.password);
        if(!validPassword){
            res.status(400).json("Wrong Password")
        }

        res.status(200).json(user)
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports=router