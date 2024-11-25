const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config({
    path:"Backend/src/Db/config.env"
  });

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser())

// Import all routes
const userRoutes = require("./routes/User.routes");

app.use("/api/v1/user", userRoutes);

// Error handling middleware


module.exports = app;
