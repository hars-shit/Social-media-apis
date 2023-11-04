const express=require("express")
const bcrypt=require("bcrypt")
const User = require("../models/user")
const router=express.Router()

// update user 
router.put("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10)
                req.body.password=await bcrypt.hash(req.body.password,salt)
            }
            catch(err){
                return res.status(500).json(err)
            }
        }
        try{
            const user=await User.findByIdAndUpdate(req.params.id,
             {
                $set:req.body,
             })
             res.status(200).json("Account has been updated")
        }
        catch(err){
            return res.status(500).json(err)
        }
    }
    else{
        return res.status(403).json("You can update only on your account")
    }
})
// delete user 

router.delete("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        
        try{
            const user=await User.findByIdAndDelete(req.params.id)
             res.status(200).json("Account has been deleted")
        }
        catch(err){
            return res.status(500).json(err)
        }
    }
    else{
        return res.status(403).json("You can delete only on your account")
    }
})
// get a user 

router.get("/:id",async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        const {password,updatedAt,...other}=user._doc
        return res.status(200).json(other)
    }
    catch(err){
        return res.status(500).json(err)
    }
})
// follow a user 

router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId)

            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push :{followers: req.body.userId}})
                await currentUser.updateOne({ $push :{followings: req.params.id}})
                res.status(200).json("User has been followed")
            }
            else{
                res.status(403).json("you already followed this user")
            }
        }
        catch(err){
            res.status(403).json(err)
        }
    }
})

// unfollow a user 


router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId)

            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull :{followers: req.body.userId}})
                await currentUser.updateOne({ $pull :{followings: req.params.id}})
                res.status(200).json("User has been followed")
            }
            else{
                res.status(403).json("you already unfollowed this user")
            }
        }
        catch(err){
            res.status(403).json(err)
        }
    }
})

module.exports=router