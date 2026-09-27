import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

async function connectdb() {
  const mongoUri = process.env.MONGO_URI;

  

  try {
    await mongoose.connect(mongoUri, {
      dbName: "babajiherbals",
      // Time-lag fix: connection pool reuse + fast fail
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    });
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    throw err;
  }
}

export default connectdb;
