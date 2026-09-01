/**
 * lib/data/bookingsStore.js
 * -----------------------------------------------------------------------
 * In-memory store for package bookings.
 * -----------------------------------------------------------------------
 */

const bookings = [];

function createBooking(booking) {
  bookings.push(booking);
  return booking;
}

function getAllBookings() {
  return bookings;
}

function getBookingByReference(reference) {
  return bookings.find((b) => b.reference === reference) || null;
}

module.exports = { createBooking, getAllBookings, getBookingByReference };
