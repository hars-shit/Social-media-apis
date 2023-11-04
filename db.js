const mongoose = require("mongoose");

const Connect=async()=>{
    try{
        const URL_Connect=await mongoose.connect(process.env.MONGO_URL)
        console.log("Databse Connected")
        URL_Connect.connection.host,
        URL_Connect.connection.name
        
    }
    catch(error){
        console.log(error)
    }
}
module.exports=Connect