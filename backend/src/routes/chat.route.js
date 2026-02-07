const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");

// POST /api/chat - Main chat endpoint
router.post("/chat", chatController.handleChat);

module.exports = router;
