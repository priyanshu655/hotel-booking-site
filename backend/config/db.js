const mongoose=require('mongoose');

const mongoUri="mongodb://localhost:27017/mydatabase";

const connectDb=async ()=>{
    try{
        await mongoose.connect(mongoUri)
        console.log("mongo connected");
    }catch(err){
        console.log(err);
        console.log("mongo not connected");
    }
}

module.exports=connectDb;