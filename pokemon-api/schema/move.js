const mongoose = require('mongoose');

const MoveSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  ename: { type: String, required: true },
  jname: { type: String, required: true },
  cname: { type: String, required: true },
  accuracy: { type: Number },
  power: { type: Number },
  pp: { type: Number },
  category: { type: String },
  type: { type: String }
}, { collection: 'moves' }); // Case-sensitive match to DB collection

module.exports = mongoose.model('Move', MoveSchema);
