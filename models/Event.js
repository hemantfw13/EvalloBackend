const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  participants: [String],
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  notes: String,
  googleEventId: String,
});

module.exports = mongoose.model('Event', eventSchema);
