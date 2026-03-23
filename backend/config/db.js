const mongoose=require('mongoose');

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

const connectDb=async ()=>{
    try{
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    }catch(err){
        console.error("MongoDB connection error:", err.message);
        console.log("MongoDB not connected - please check your connection string");
        process.exit(1); // Exit on connection failure
    }
}

module.exports=connectDb;