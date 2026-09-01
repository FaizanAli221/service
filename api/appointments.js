// api/appointments.js
// POST /api/appointments
// Accepts a booking payload, validates it, and returns confirmation with bookingId.

const { applyCors } = require("../lib/cors");
const { SERVICES } = require("../lib/data");
const { validateAppointment } = require("../lib/validators");

function generateBookingId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `APX-${random}`;
}

module.exports = (req, res) => {
  if (applyCors(req, res)) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed. Use POST.`,
    });
  }

  const body = req.body || {};
  const validServiceIds = SERVICES.map((s) => s.id);
  const { valid, errors } = validateAppointment(body, validServiceIds);

  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }

  const service = SERVICES.find((s) => s.id === body.serviceId);
  const bookingId = generateBookingId();

  const confirmation = {
    bookingId,
    status: "confirmed",
    customer: {
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
    },
    vehicle: {
      make: body.carMake.trim(),
      model: body.carModel.trim(),
      year: Number(body.year),
    },
    service: {
      id: service.id,
      name: service.name,
      category: service.category,
      estimatedTime: service.estimatedTime,
      basePrice: service.basePrice,
    },
    preferredDate: body.preferredDate,
    notes: body.notes ? body.notes.trim() : null,
    createdAt: new Date().toISOString(),
  };

  return res.status(201).json({
    success: true,
    message: `Appointment ${bookingId} confirmed! We will call you at ${body.phone.trim()} to finalize your appointment slot.`,
    data: confirmation,
  });
};
