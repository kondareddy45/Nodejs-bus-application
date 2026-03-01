const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const Bus = require('./models/Bus');
const Booking = require('./models/Booking');

const app = express();

// MongoDB connection (use Docker container name)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://bus-mongo:27017/busBooking';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // Auto-seed buses if none exist
    const count = await Bus.countDocuments();
    if (count === 0) {
      await Bus.insertMany([
        { name: "Express A", from: "Delhi", to: "Jaipur", departureTime: "09:00 AM", price: 500 },
        { name: "SuperFast B", from: "Delhi", to: "Agra", departureTime: "10:30 AM", price: 300 },
        { name: "Comfort C", from: "Delhi", to: "Lucknow", departureTime: "08:00 AM", price: 800 }
      ]);
      console.log("✅ Sample buses seeded");
    }
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.get('/', async (req, res) => {
  const buses = await Bus.find();
  res.render('index', { buses });
});

// Seat selection
app.get('/bus/:id', async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  res.render('seat-selection', { bus });
});

// Booking route
app.post('/book', async (req, res) => {
  const { busId, passengerName, seatNumber } = req.body;

  const existing = await Booking.findOne({ busId, seatNumber });
  if (existing) {
    return res.send(`<h3>Seat ${seatNumber} already booked! <a href="/">Go Back</a></h3>`);
  }

  await Booking.create({ busId, passengerName, seatNumber });
  res.render('success', { passengerName });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
