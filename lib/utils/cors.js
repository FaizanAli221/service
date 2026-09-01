/**
 * lib/utils/cors.js
 * -----------------------------------------------------------------------
 * Re-exports applyCors from ../cors.js for backward compatibility.
 * -----------------------------------------------------------------------
 */
const { applyCors, ALLOWED_ORIGIN } = require("../cors");

module.exports = { applyCors, ALLOWED_ORIGIN };
