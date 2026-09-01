/**
 * lib/validation/bookingSchema.js
 * -----------------------------------------------------------------------
 * Zod schema for POST /api/packages/book.
 * -----------------------------------------------------------------------
 */
const { z } = require("zod");

const CURRENT_YEAR = new Date().getFullYear();

const bookingSchema = z.object({
  packageId: z.string().trim().min(1, "packageId is required."),

  customerName: z
    .string()
    .trim()
    .min(2, "customerName must be at least 2 characters.")
    .max(80, "customerName must be under 80 characters."),

  email: z.string().trim().email("email must be a valid email address."),

  phone: z
    .string()
    .trim()
    .min(7, "phone must have at least 7 digits.")
    .regex(/^[+()\-.\s\d]+$/, "phone contains invalid characters."),

  carMake: z.string().trim().min(1, "carMake is required.").max(40),
  carModel: z.string().trim().min(1, "carModel is required.").max(40),

  year: z.coerce
    .number()
    .int("year must be a whole number.")
    .min(1980, "year must be 1980 or later.")
    .max(CURRENT_YEAR + 1, `year must be ${CURRENT_YEAR + 1} or earlier.`),

  scheduledDate: z
    .string()
    .trim()
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "scheduledDate must be a valid date (ISO format recommended).",
    })
    .refine((val) => new Date(val).getTime() >= Date.now() - 24 * 60 * 60 * 1000, {
      message: "scheduledDate cannot be in the past.",
    }),
});

module.exports = { bookingSchema };
