const express = require("express");
const router = express.Router();
const schemeController = require("../controllers/scheme.controller");

// GET /api/health - Health check
router.get("/health", schemeController.healthCheck);

// GET /api/schemes - Get all schemes
router.get("/schemes", schemeController.getAll);

// GET /api/schemes/:id - Get single scheme by ID
router.get("/schemes/:id", schemeController.getById);

module.exports = router;
