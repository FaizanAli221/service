// lib/cors.js
// Shared CORS handling for Vercel serverless functions.

const ALLOWED_ORIGIN = "*";

function applyCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true; // caller should stop processing
  }
  return false;
}

module.exports = { applyCors, ALLOWED_ORIGIN };
