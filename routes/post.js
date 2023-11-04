const Post = require("../models/Post")
const User = require("../models/user")

const router=require("express").Router()


// create a post 

router.post("/",async(req,res)=>{
  const newPost=await Post.create(req.body)
  try{
    const savePost=await newPost.save()
    res.status(200).json(savePost)
  }
  catch(err){
    res.status(500).json(err)
  }
})


//update a post

router.put("/:id",async(req,res)=>{
    try{
    const post=await Post.findById(req.params.id)
    if(post.userId===req.body.userId){
        await post.updateOne({$set :req.body})
        res.status(200).json("Post has been updated")
    }
    else{
        res.status(403).json("you can't update ")
    }
   
    }
    catch(err){
      res.status(500).json(err)
    }
  })

//delete a post

router.delete("/:id",async(req,res)=>{
    try{
    const post=await Post.findById(req.params.id) 
    if(post.userId===req.body.userId){
        await post.deleteOne()
        res.status(200).json("Post has been deleted")
    }
    else{
        res.status(403).json("you can't delete  ")
    }
   
    }
    catch(err){
      res.status(500).json(err)
    }
  })
// like a post 

router.put("/:id/like",async(req,res)=>{
    try{
    const post=await Post.findById(req.params.id) 
    if(!post.likes.includes(req.body.userId)){
        await post.updateOne({$push : {likes:req.body.userId}})
        res.status(200).json("Post has been liked")
    }
    else{
       await post.updateOne({$pull :{likes :req.body.userId}})
        res.status(200).json("The post has been disliked")
    
    }
   
    }
    catch(err){
      res.status(500).json(err)
    }
  })

// get a post 

router.get("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(post){
            res.status(200).json(post)
        }
        else{
            res.status(404).json("post not found")
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})
// get timeline posts 

router.get("/timeline",async(req,res)=>{
    let postArray=[];
    try{

        const currentUser=await User.findById(req.body.userId)
        const userPosts=await Post.find({userId:currentUser._id})

        const friendPosts=await Promise.all(
            currentUser.followings.map((friendPosts)=>{
                Post.find({userId:friendId});
            })
        );
        res.json(userPosts.concat(...friendPosts))
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports=router