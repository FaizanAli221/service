/**
 * GET /api/packages/health
 * -----------------------------------------------------------------------
 * Lightweight status probe for packages API.
 * -----------------------------------------------------------------------
 */
const { applyCors } = require("../../lib/utils/cors");

module.exports = function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  return res.status(200).json({
    status: "active",
    service: "packages-api",
    timestamp: new Date().toISOString(),
  });
};
