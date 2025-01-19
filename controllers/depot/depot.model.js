const mongoose = require('mongoose');

const DepotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  postCode: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Depot', DepotSchema);
