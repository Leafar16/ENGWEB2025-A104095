const fs = require('fs');
const path = require('path');

exports.uploadSIP = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum ficheiro recebido' });
    }

    res.status(200).json({ 
      message: 'SIP recebido com sucesso!',
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar SIP' });
  }
};