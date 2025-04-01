var express = require('express');
var router = express.Router();
var Contrato = require('../controllers/contratos');

router.get('/', function(req, res, next) {
    if (req.query.entidade) {
        Contrato.getContractByEntity(req.query.entidade)
            .then(data => res.status(200).jsonp(data))
            .catch(erro => res.status(500).jsonp(erro));
    } else if (req.query.tipo) {
        Contrato.getContratosByTipo(req.query.tipo)
            .then(data => res.status(200).jsonp(data))
            .catch(erro => res.status(500).jsonp(erro));
    } else {
        Contrato.list()
            .then(data => res.status(200).jsonp(data))
            .catch(erro => res.status(500).jsonp(erro));
    }
});

router.get('/entidades', function(req, res, next) {
  Contrato.getEntidades()
      .then(data => res.status(200).jsonp(data))
      .catch(erro => res.status(500).jsonp(erro));
});


router.get('/tipos', function(req, res, next) {
  Contrato.getTipos()
      .then(data => res.status(200).jsonp(data))
      .catch(erro => res.status(500).jsonp(erro));
});

router.get('/:id', function(req, res, next) {
    Contrato.findById(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(erro => res.status(500).jsonp(erro));
});

router.post('/', function(req, res, next) {
    Contrato.createContrato(req.body)
        .then(data => res.status(201).jsonp(data))
        .catch(erro => res.status(400).jsonp(erro));
});

router.delete('/:id', function(req, res, next) {
    Contrato.delete(req.params.id)
        .then(() => res.status(200).jsonp({ message: "Contrato eliminado com sucesso." }))
        .catch(erro => res.status(500).jsonp(erro));
});

router.put('/:id', function(req, res, next) {
    Contrato.update(req.params.id, req.body)
        .then(data => res.status(200).jsonp(data))
        .catch(erro => res.status(500).jsonp(erro));
});



module.exports = router;
