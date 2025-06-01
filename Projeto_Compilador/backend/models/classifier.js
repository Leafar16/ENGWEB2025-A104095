const mongoose = require('mongoose');

const ClassifierSchema = new mongoose.Schema({
  _id: Number,
  nome: { type: String, required: true, unique: true },
  descricao: String
});

module.exports = mongoose.model('Classifier', ClassifierSchema);
