/**
 * lib/data/packages.js
 * -----------------------------------------------------------------------
 * In-memory package catalog. This is the single source of truth read by
 * GET /api/packages, GET /api/packages/[id], and POST /api/packages/book
 * (for price/name lookups at booking time).
 * -----------------------------------------------------------------------
 */

const FEATURE_CATALOG = [
  "Full synthetic oil change",
  "Fluid top-up (coolant, brake, washer)",
  "Multi-point inspection",
  "Tire pressure & tread check",
  "Brake pad & rotor inspection",
  "Computerized engine diagnostics",
  "Air & cabin filter replacement",
  "A/C performance check",
  "Deep interior steam clean",
  "Exterior clay bar treatment",
  "2-stage machine paint correction",
  "Ceramic coating application",
];

function buildFeatures(includedList) {
  return FEATURE_CATALOG.map((label) => ({
    label,
    included: includedList.includes(label),
  }));
}

const PACKAGES = [
  {
    id: "basic-care",
    name: "Basic Care",
    tagline: "The essentials, done right.",
    price: 89,
    discountPrice: 79,
    popular: false,
    estimatedHours: 1,
    features: buildFeatures([
      "Full synthetic oil change",
      "Fluid top-up (coolant, brake, washer)",
      "Multi-point inspection",
      "Tire pressure & tread check",
    ]),
  },
  {
    id: "full-tune-up",
    name: "Full Tune-Up",
    tagline: "Our most-booked service, front to back.",
    price: 189,
    discountPrice: 165,
    popular: true,
    estimatedHours: 2.5,
    features: buildFeatures([
      "Full synthetic oil change",
      "Fluid top-up (coolant, brake, washer)",
      "Multi-point inspection",
      "Tire pressure & tread check",
      "Brake pad & rotor inspection",
      "Computerized engine diagnostics",
      "Air & cabin filter replacement",
      "A/C performance check",
    ]),
  },
  {
    id: "showroom-ceramic",
    name: "Showroom Ceramic Detailing",
    tagline: "Paint correction and a coat that lasts years, not weeks.",
    price: 549,
    discountPrice: 479,
    popular: false,
    estimatedHours: 14,
    features: buildFeatures([
      "Deep interior steam clean",
      "Exterior clay bar treatment",
      "2-stage machine paint correction",
      "Ceramic coating application",
    ]),
  },
];

function getAllPackages() {
  return PACKAGES;
}

function getPackageById(id) {
  return PACKAGES.find((pkg) => pkg.id === id) || null;
}

module.exports = { PACKAGES, FEATURE_CATALOG, getAllPackages, getPackageById };
