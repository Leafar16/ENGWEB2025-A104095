const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jszip = require('jszip');
const xml2js = require('xml2js');
const Item = require('../controllers/item');
const auth = require('../auth/auth');
const logController = require('../controllers/log'); 

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }
  next();
});

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
      cb(null, true);
    } else {
      cb(new Error('Apenas ficheiros ZIP são permitidos'), false);
    }
  },
}).single('sipFile');

router.post('/upload', auth.validateClient, async function(req, res, next) {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum ficheiro recebido.' });
    }

    try {
      const oldPath = req.file.path;
      const zipData = fs.readFileSync(oldPath);
      const zip = await jszip.loadAsync(zipData);

      const manifestFile = zip.file('manifesto.xml');
      if (!manifestFile) {
        fs.unlinkSync(oldPath);
        return res.status(400).json({ error: 'manifesto.(xml) não encontrado no ZIP.' });
      }

      const manifestContent = await manifestFile.async('string');
      const parser = new xml2js.Parser({ explicitArray: false });
      const manifestData = await new Promise((resolve, reject) => {
        parser.parseString(manifestContent, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });

      const filesData = manifestData.sip?.files?.file;
      const manifestFiles = filesData
        ? (Array.isArray(filesData) ? filesData : [filesData])
        : [];

      if (manifestFiles.length === 0) {
        console.warn('Aviso: SIP sem ficheiros listados no manifesto. Nenhum ficheiro será extraído.');
      }

      for (const file of manifestFiles) {
        if (!zip.file(file.path)) {
          fs.unlinkSync(oldPath);
          return res.status(400).json({ error: `Ficheiro referenciado não encontrado: ${file.path}` });
        }
      }

      const username = req.decoded.username;
      const userDir = path.join(uploadDir, req.decoded.username);
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }

      const extractedFiles = [];
      for (const file of manifestFiles) {
        const fileContent = await zip.file(file.path).async('nodebuffer');
        const filename = path.basename(file.path);
        const fileDest = path.join(userDir, filename);
        fs.writeFileSync(fileDest, fileContent);
        const relativePath = `/uploads/${username}/${filename}`;
        extractedFiles.push(relativePath);
      }

      fs.unlinkSync(oldPath);

      if (!manifestData.sip || !manifestData.sip.metadata) {
        return res.status(400).json({ error: 'Metadata do SIP não encontrada.' });
      }

      let randomId = Math.floor(Math.random() * 1000000000);
      let exists = await Item.exists(randomId);
      while (exists) {
        randomId = Math.floor(Math.random() * 1000000000);
        exists = await Item.exists(randomId);
      }
      const uniqueId = randomId;

      const item = {
        _id: uniqueId || Date.now(),
        owner: username,
        titulo: manifestData.sip.metadata.titulo || 'Sem título',
        descricao: manifestData.sip.metadata.descricao || '',
        tipo: manifestData.sip.metadata.tipo || 'outro',
        dataCriacao: new Date(manifestData.sip.metadata.dataCriacao) || new Date(),
        dataSubmissao: new Date(),
        produtor: manifestData.sip.metadata.produtor || null,
        publico: manifestData.sip.metadata.publico === 'true' || false,
        classificadores: manifestData.sip.metadata.classificadores?.split(',') || [],
        ficheiros: extractedFiles,
        comentarios: []
      };

      const validTypes = ['foto', 'crónica', 'treino', 'evento', 'pensamento', 'resultados'];
      if (!validTypes.includes(item.tipo)) {
        return res.status(400).json({ error: `Tipo de item inválido: ${item.tipo}` });
      }

      const newItem = await Item.insert(item);

      const logEntry = {
        utilizador: username,
        acao: 'importação',
        detalhes: `Item ${newItem._id} criado via upload SIP`,
        timestamp: new Date()
      };

      await logController.createLog(logEntry);
      

      res.status(201).json({
        message: 'SIP processado e Item criado com sucesso!',
        item: newItem,
        filename: req.file.filename
      });
    } catch (err) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Erro ao processar o SIP.' });
    }
  });
});

module.exports = router;