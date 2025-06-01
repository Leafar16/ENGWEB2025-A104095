const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  _id: Number,
  utilizador: { type: String },
  acao: { type: String },
  detalhes: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);
