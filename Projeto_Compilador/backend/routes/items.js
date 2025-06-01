var express = require('express');
var router = express.Router();
var Item = require('../controllers/item');
const AdmZip = require('adm-zip');
const fs = require('fs').promises;
const User = require('../models/user');
var mongoose = require('mongoose');
const xmlbuilder = require('xmlbuilder');
var logController = require('../controllers/log');

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  next();
});

router.get('/', function(req, res, next) {
  Item.list()
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp({ error: erro.message }))
});

router.get('/:id', function(req, res, next) {
  Item.findByIdItem(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp({ error: erro.message }))
});

router.post('/', function(req, res, next) {
  Item.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.status(500).jsonp({ error: erro.message }))
});

router.get('/owner/:owner', async function(req, res, next) {
  try {
    const owner = decodeURIComponent(req.params.owner);
    const user = await User.findOne({ username: owner });
    if (!user) {
      return res.status(404).jsonp({ error: 'User not found' });
    }
    const items = await Item.findByOwner(owner);
    res.jsonp(items);
  } catch (erro) {
    console.error('Error in /owner:', erro);
    res.status(500).jsonp({ error: 'Failed to load items' });
  }
});

router.get('/following/:username', async function(req, res, next) {
  try {
    const username = decodeURIComponent(req.params.username);
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).jsonp({ error: 'User not found' });
    }
    const following = user.following || [];
    if (following.length === 0) {
      return res.jsonp([]);
    }
    const items = await Item.findPublicByOwners(following);
    res.jsonp(items);
  } catch (erro) {
    console.error('Error in /following:', erro);
    res.status(500).jsonp({ error: 'Failed to load items' });
  }
});

router.put('/:id', function(req, res, next) {
  var id = req.params.id;
  Item.update(id, req.body)
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp({ error: erro.message }))
});

router.delete('/:id', async function(req, res, next) {
  const id = req.params.id;

  try {
    const item = await Item.findByIdItem(id);
    if (!item) {
      return res.status(404).jsonp({ error: 'Item não encontrado' });
    }

    await Item.delete(id);

    await logController.createLog({
      utilizador: item.owner || 'desconhecido',
      acao: 'remoção_item',
      detalhes: `Item com ID ${id} removido`,
      timestamp: new Date()
    });

    res.jsonp({ message: 'Item removido com sucesso', item });
  } catch (erro) {
    res.status(500).jsonp({ error: 'Erro ao remover item', details: erro });
  }
});


router.post('/:id/comments', function(req, res, next) {
  Item.addComment(req.params.id, req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.status(500).jsonp({ error: erro.message }))
});

router.post('/:id/:username/like', async function(req, res, next) {
  try {
    const itemId = req.params.id;
    const username = req.params.username; 

    const item = await Item.findByIdItem(itemId);
    if (!item) {
      return res.status(404).jsonp({ error: 'Item not found' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).jsonp({ error: 'User not found' });
    }

    if (!item.likes) {
      item.likes = [];
    }

    const userIndex = item.likes.indexOf(username);
    if (userIndex === -1) {
      item.likes.push(username);
    } else {
      item.likes.splice(userIndex, 1);
    }


    const updatedItem = await Item.update(itemId, { likes: item.likes });
    res.status(200).jsonp({
      message: 'Like updated successfully',
      likes: updatedItem.likes,
      liked: userIndex === -1 
    });
  } catch (erro) {
    console.error('Error toggling like:', erro);
    res.status(500).jsonp({ error: 'Failed to toggle like' });
  }
});

router.get('/download/:username/:pub_id', async function(req, res, next) {
  try {
    const { pub_id } = req.params;
    const item = await Item.findByIdItem(pub_id);

    if (!item) {
      return res.status(404).jsonp({ error: 'Item not found' });
    }

    const zip = new AdmZip();

    // Formata a data para o padrão ISO 8601 com timezone UTC
    const creationDate = item.dataCriacao
      ? new Date(item.dataCriacao).toISOString()
      : new Date().toISOString();

    const metadataXml = xmlbuilder.create('sip', { encoding: 'UTF-8' })
      .ele('metadata')
        .ele('id', item._id || 'unknown').up()
        .ele('titulo', item.titulo || '').up()
        .ele('descricao', item.descricao || '').up()
        .ele('tipo', item.tipo || 'unknown').up()
        .ele('dataCriacao', creationDate).up()
        .ele('produtor', item.owner || 'unknown').up()
        .ele('publico', 'true').up()
        .ele('classificadores', (item.classificadores || []).join(',')).up()
      .up()
      .ele('files');

    if (item.ficheiros && item.ficheiros.length > 0) {
      for (const filePath of item.ficheiros) {
        metadataXml.ele('file').ele('path', filePath.split('/').pop()).up().up();
      }
    }

    const xmlString = metadataXml.end({ pretty: true });
    zip.addFile('manifesto.xml', Buffer.from(xmlString, 'utf8'));

    // Adiciona os ficheiros reais
    if (item.ficheiros && item.ficheiros.length > 0) {
      for (const filePath of item.ficheiros) {
        try {
          const fullPath = `../backend${filePath}`;
          const fileBuffer = await fs.readFile(fullPath);
          const fileName = filePath.split('/').pop();
          zip.addFile(fileName, fileBuffer);
        } catch (fileError) {
          console.error(`Erro ao ler o arquivo ${filePath}:`, fileError.message);
          continue;
        }
      }
    }

    const zipBuffer = zip.toBuffer();
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', `attachment; filename="download_${item.owner || 'unknown'}_${pub_id}.zip"`);
    res.send(zipBuffer);
  } catch (erro) {
    console.error('Erro ao gerar o ZIP:', erro);
    res.status(500).jsonp({ error: 'Falha ao gerar o arquivo ZIP' });
  }
});

module.exports = router;