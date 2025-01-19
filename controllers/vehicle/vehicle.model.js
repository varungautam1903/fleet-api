const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  reg: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  mot: { type: String, required: true },
  roadTax: { type: String, required: true },
  insurance: { type: String, required: true },
  service: { type: String, required: true },
  mileage: { type: String, required: true },
  status: {
    type: String, enum: ["Available", "In Maintenance", "Out of Service"], default: "Available",
  },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
