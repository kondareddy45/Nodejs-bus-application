const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    name: String,
    from: String,
    to: String,
    departureTime: String,
    price: Number,
    seats: { type: Number, default: 40 }
});

module.exports = mongoose.model('Bus', busSchema);
