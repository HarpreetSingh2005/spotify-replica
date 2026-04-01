const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }), // to allow cross-origin requests from thr url and allow it to send cookies
);
app.use(express.json()); //If request body is JSON → parse it
app.use(express.urlencoded({ extended: true })); //If request body is form-style → parse it
app.use(cookieParser());

app.use("/api/music", musicRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
