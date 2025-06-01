const mongoose = require('mongoose');
const mongoDB = 'mongodb://127.0.0.1:27017/app'; 

let dbConnection;

async function openDB() {
  try {
    await mongoose.connect(mongoDB);
    dbConnection = mongoose.connection;
    
    dbConnection.on('error', (err) => {
      console.error('Erro de Conexão ao MongoDB:', err);
    });
    
    dbConnection.once('open', () => {
      console.log('Conexão ao MongoDB realizada com sucesso.');
    });
    
    return dbConnection;
  } catch (err) {
    console.error('Falha ao conectar ao MongoDB:', err);
    throw err;
  }
}

async function closeDB() {
  if (dbConnection) {
    await mongoose.disconnect();
    console.log('Conexão ao MongoDB fechada com sucesso.');
  }
}

module.exports = { openDB, closeDB };