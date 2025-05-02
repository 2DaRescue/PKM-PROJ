const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  name: {
    japanese: { type: String, required: true },
    english: { type: String, required: true },
    chinese: { type: String, required: true }
  }
}, { collection: 'Items' }); // 👈 Explicitly match the case used in your DB

module.exports = mongoose.model('Item', ItemSchema);
