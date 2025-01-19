const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  _user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  _depot: { type: mongoose.Schema.Types.ObjectId, ref: "Depot", required: true },
  _vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  routeNo: { type: String, required: true },
  postCode: { type: String, required: true },
  stops: { type: String, required: true },
  franchiseId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('History', HistorySchema);
