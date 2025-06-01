var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
var Log = require('../controllers/log')

router.get('/', function (req, res, next) {
    Log.getLogs()
        .then(logs => {
            res.json(logs);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter logs' });
        }
        );
});

router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    Log.getLogById(id)
        .then(log => {
            if (!log) {
                return res.status(404).json({ error: 'Log não encontrado' });
            }
            res.status(200).json(log);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter log' });
        }
        );
});


router.post('/', function (req, res, next) {
    Log.createLog(req.body)
        .then(log => {
            res.status(201).json(log);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar log' });
        }
        );
});


router.put('/:id', function (req, res, next) {
    var id = req.params.id;
    Log.updateLog(id, req.body)
        .then(log => {
            if (!log) {
                return res.status(404).json({ error: 'Log não encontrado' });
            }
            res.status(200).json(log);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar log' });
        }
        );
});

router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    Log.deleteLog(id)
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro))
});

module.exports = router;
