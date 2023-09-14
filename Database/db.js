const mongoose = require('mongoose');

MONGO_URI = "mongodb+srv://User:masterchef@cluster0.zywcanw.mongodb.net/DormChat?retryWrites=true&w=majority";

const connectDB = async()=>{
  try{
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`)
  }catch(error){
    console.log(error);
    process.exit(1);
  }
}

module.exports = connectDB;