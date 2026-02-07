const express = require("express");
const cors = require("cors");

// Import routes
const chatRoutes = require("./routes/chat.route");
const schemeRoutes = require("./routes/scheme.route");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api", chatRoutes);
app.use("/api", schemeRoutes);

module.exports = app;
