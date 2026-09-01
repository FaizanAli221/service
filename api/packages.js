/**
 * GET /api/packages
 * -----------------------------------------------------------------------
 * Returns all available service packages.
 * -----------------------------------------------------------------------
 */
const { applyCors } = require("../lib/utils/cors");
const { getAllPackages } = require("../lib/data/packages");

module.exports = function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");

  return res.status(200).json({
    success: true,
    packages: getAllPackages(),
    count: getAllPackages().length,
    updatedAt: new Date().toISOString(),
  });
};
