const mongoose = require('mongoose');

const PokemonSchema = new mongoose.Schema({
  id: Number,
  name: String, 
  type: [String],
  sprite: String, 
}, { _id: false });

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slot: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  pokemons: {
    type: [PokemonSchema],
    validate: [val => val.length <= 6, 'A team can have a max of 6 Pokémon'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Team', TeamSchema);
