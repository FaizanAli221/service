/**
 * GET /api/packages/[id]
 * -----------------------------------------------------------------------
 * Returns a single package by id, or a 404 JSON error if it doesn't exist.
 * -----------------------------------------------------------------------
 */
const { applyCors } = require("../../lib/utils/cors");
const { getPackageById } = require("../../lib/data/packages");

module.exports = function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  const { id } = req.query || {};
  const pkg = getPackageById(id);

  if (!pkg) {
    return res.status(404).json({
      error: "Not Found",
      message: `No package found for id "${id}".`,
    });
  }

  return res.status(200).json({ success: true, package: pkg });
};
