const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

async function connectdb() {
  const mongoUri = process.env.MONGO_URI;

  

  try {
    await mongoose.connect(mongoUri, {
      dbName: "babajiherbals",
    });
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    throw err;
  }
}

module.exports = connectdb;