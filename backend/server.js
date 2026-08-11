import dotenv from "dotenv";
import connectdb from "./config/db.js";
import app from "./app.js";

dotenv.config();

async function startServer() {
  try {
    await connectdb();

    console.log("Database connection established");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Database connection failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();