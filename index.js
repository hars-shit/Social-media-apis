const express=require('express')
const app=express();
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const helmet=require("helmet")
const morgon=require('morgan');
const Connect = require('./db');
const users=require('./routes/users')
const auth=require('./routes/auth')
const post=require("./routes/post")
dotenv.config();

Connect();

//middleware

app.use(express.json())
app.use(helmet())
app.use(morgon("common"))

// routes 

app.use("/api/users",users)
app.use("/api/auth",auth)
app.use("/api/post",post)


app.listen(8080,()=>{
    console.log("Server is started")
})