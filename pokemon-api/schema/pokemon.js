const mongoose = require('mongoose');

const PokemonSchema = new mongoose.Schema({
  id: Number,
  name: {
    english: String,
    japanese: String,
    chinese: String,
    french: String
  },
  type: [String],
  base: {
    HP: Number,
    Attack: Number,
    Defense: Number,
    'Sp. Attack': Number,
    'Sp. Defense': Number,
    Speed: Number
  },
  species: String,
  description: String,
  evolution: {
    prev: [[String]],
    next: [[String]], // nested arrays (e.g., [["2", "Level 16"]])
  },
  profile: {
    height: String,
    weight: String,
    egg: [String],
    ability: [[String]], // e.g., [["Overgrow", "false"], ["Chlorophyll", "true"]]
    gender: String
  },
  image: {
    sprite: String,
    thumbnail: String,
    hires: String
  }
});

module.exports = mongoose.model('Pokemon', PokemonSchema, 'mons'); // ✅ force use of "mons" collection
