const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    busId: String,
    passengerName: String,
    seatNumber: Number
});

module.exports = mongoose.model('Booking', bookingSchema);
