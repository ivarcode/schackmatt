const mongoose = require('mongoose');

// game schema
const gameSchema = mongoose.Schema({
  white:{
    type: String,
    required: true
  },
  black:{
    type: String,
    required: true
  },
  pgn:{
    type: String,
    required: true
  },
  result:{
    type: String,
    required: true
  }
});

const Game = module.exports = mongoose.model('Game',gameSchema);
