/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

/**
 * Connect to MongoDB depending on environment
 */
connectDB();

/**
 * Express configuration.
 */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

/**
 * set the view engine to ejs
 */
app.set("view engine", "ejs");

/**
 * Bootstrap routes
 */
require("./config/routes")(app);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));