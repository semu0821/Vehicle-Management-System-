const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/your_database')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Vehicle Schema
const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// API Routes

// Fetch all vehicles
app.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Add a new vehicle
app.post('/vehicles', async (req, res) => {
  const { name, status } = req.body;

  try {
    const newVehicle = new Vehicle({ name, status });
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(400).send('Failed to add vehicle');
  }
});

// Update vehicle status
app.put('/vehicles/:id', async (req, res) => {
  const { status } = req.body;

  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).send('Vehicle not found');

    vehicle.status = status;
    vehicle.lastUpdated = new Date();

    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    res.status(500).send('Failed to update vehicle');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
