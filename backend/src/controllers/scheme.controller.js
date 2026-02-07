const { getAllSchemes, getSchemeById } = require("../services/eligibility.service");

/**
 * Health check endpoint
 * GET /api/health
 */
function healthCheck(req, res) {
  res.json({ status: "ok", message: "Saarthi AI Backend is running!" });
}

/**
 * Get all schemes
 * GET /api/schemes
 */
function getAll(req, res) {
  const schemes = getAllSchemes();
  res.json({ schemes });
}

/**
 * Get single scheme by ID
 * GET /api/schemes/:id
 */
function getById(req, res) {
  const scheme = getSchemeById(req.params.id);
  if (!scheme) {
    return res.status(404).json({ error: "Scheme not found" });
  }
  res.json({ scheme });
}

module.exports = {
  healthCheck,
  getAll,
  getById
};
