require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Saarthi AI Backend running on http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   GET  /api/health       - Health check`);
  console.log(`   GET  /api/schemes      - List all schemes`);
  console.log(`   GET  /api/schemes/:id  - Get scheme by ID`);
  console.log(`   POST /api/chat         - Main chat endpoint`);
});
