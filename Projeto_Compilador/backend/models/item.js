const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    texto: String,
    autor: String,
    data: { type: Date, default: Date.now }
});

const types = ['foto', 'crónica', 'treino', 'evento', 'pensamento', 'resultados'];

const ItemSchema = new mongoose.Schema({
    _id: Number,
    titulo: { type: String, required: true },
    owner : { type: String, required: true },
    descricao: String,
    tipo: { type: String, required: true, enum: types },
    dataCriacao: Date,
    dataSubmissao: { type: Date, default: Date.now },
    produtor: { type: String },
    publico: { type: Boolean, default: false },
    classificadores: [String],
    ficheiros: [String],
    comentarios: [CommentSchema],
    likes: [String]
});

module.exports = mongoose.model('Item', ItemSchema);
