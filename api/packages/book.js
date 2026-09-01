/**
 * POST /api/packages/book
 * -----------------------------------------------------------------------
 * Validates a booking payload, formats the phone number, calculates tax
 * and total off the package's discounted price, generates a tracking
 * reference, stores the booking, and returns a 201 with full booking summary.
 * -----------------------------------------------------------------------
 */
const { applyCors } = require("../../lib/utils/cors");
const { getPackageById } = require("../../lib/data/packages");
const { createBooking, getBookingByReference } = require("../../lib/data/bookingsStore");
const { bookingSchema } = require("../../lib/validation/bookingSchema");
const { formatPhone, calculatePricing, generateTrackingReference } = require("../../lib/utils/booking");

module.exports = function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  // --- Validate ---------------------------------------------------
  const parseResult = bookingSchema.safeParse(req.body || {});

  if (!parseResult.success) {
    const fieldErrors = parseResult.error.issues.map((issue) => ({
      field: issue.path.join(".") || "(root)",
      message: issue.message,
    }));
    return res.status(400).json({ error: "Validation failed.", details: fieldErrors });
  }

  const data = parseResult.data;

  // --- Resolve package ----------------------------------------------
  const pkg = getPackageById(data.packageId);
  if (!pkg) {
    return res.status(404).json({
      error: "Not Found",
      message: `No package found for id "${data.packageId}".`,
    });
  }

  // --- Derive booking details ----------------------------------------
  const formattedPhone = formatPhone(data.phone);
  const pricing = calculatePricing(pkg.discountPrice);
  const reference = generateTrackingReference(
    (candidate) => getBookingByReference(candidate) !== null
  );

  const booking = {
    reference,
    status: "confirmed",
    package: {
      id: pkg.id,
      name: pkg.name,
      estimatedHours: pkg.estimatedHours,
    },
    customer: {
      name: data.customerName,
      email: data.email,
      phone: formattedPhone,
    },
    vehicle: {
      make: data.carMake,
      model: data.carModel,
      year: data.year,
    },
    scheduledDate: data.scheduledDate,
    pricing,
    createdAt: new Date().toISOString(),
  };

  createBooking(booking);

  return res.status(201).json({
    success: true,
    message: `Package booked successfully! Your tracking reference is ${reference}.`,
    booking,
  });
};
