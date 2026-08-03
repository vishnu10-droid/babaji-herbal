const dotenv = require("dotenv");
dotenv.config();

const connectdb = require("./config/db");
const app = require("./app");

async function startServer() {
  try {
    await connectdb();
    console.log("Database connection established");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }

  app.listen(5000, () => {
    console.log("server running on port 5000");
  });
}

startServer();
