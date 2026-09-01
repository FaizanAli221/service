/**
 * lib/utils/booking.js
 * -----------------------------------------------------------------------
 * Helpers used by the booking route.
 * -----------------------------------------------------------------------
 */
const crypto = require("crypto");

const TAX_RATE = 0.08;

/**
 * Normalizes a raw phone string to a consistent display format.
 * - 10 digits            -> (XXX) XXX-XXXX
 * - 11 digits, leads "1" -> +1 (XXX) XXX-XXXX
 * - anything else        -> +digits
 */
function formatPhone(rawPhone) {
  const digits = rawPhone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return `+${digits}`;
}

/**
 * Calculates tax and final total off the package's discounted price.
 */
function calculatePricing(basePrice) {
  const tax = Math.round(basePrice * TAX_RATE * 100) / 100;
  const total = Math.round((basePrice + tax) * 100) / 100;
  return { subtotal: basePrice, taxRate: TAX_RATE, tax, total };
}

/**
 * Generates a tracking reference like PKG-2026-4F9A
 */
function generateTrackingReference(existsFn = () => false) {
  const year = new Date().getFullYear();
  let reference;

  do {
    const suffix = crypto.randomBytes(2).toString("hex").toUpperCase();
    reference = `PKG-${year}-${suffix}`;
  } while (existsFn(reference));

  return reference;
}

module.exports = { TAX_RATE, formatPhone, calculatePricing, generateTrackingReference };
