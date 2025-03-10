import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const mongo_url=process.env.DATABASE_URL;

if (!mongo_url) {
  console.error("Errore: La variabile DATABASE_URL non è definita nel file .env");
  process.exit(1);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongo_url);
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error:any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}


export default connectDB;