const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth.routes");
const protectedRouter = require("./routes/protected.routes");
const authMiddleware = require("./middleware/auth.middleware");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api", authMiddleware ,protectedRouter);

module.exports = app;