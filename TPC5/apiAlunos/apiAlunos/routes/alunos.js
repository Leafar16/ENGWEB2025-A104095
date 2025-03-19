var express = require('express');
var router = express.Router();
var aluno=require("../controllers/alunos")
/* GET alunos listing */
router.get('/', function(req, res, next) {
  aluno.list()
  .then(data=>res.jsonp(data))
  .catch(error=>res.jsonp(error))
});

router.get('/:id', function(req, res, next) {
  aluno.findByID(req.params.id)
  .then(data=>res.jsonp(data))
  .catch(error=>res.jsonp(error))
});

router.post('/', function(req, res, next) {
  aluno.insert(req.body)
  .then(data=>res.status(201).jsonp(data)) //devolve a resposta em json
  .catch(error=>res.jsonp(error))
});

router.put('/:id', function(req, res, next) {
  aluno.update(req.params.id,req.body)
  .then(data=>res.jsonp(data)) //devolve a resposta em json
  .catch(error=>res.jsonp(error))
});

router.delete('/:id', function(req, res, next) {
  aluno.delete(req.params.id)
  .then(data=>res.jsonp(data)) //devolve a resposta em json
  .catch(error=>res.jsonp(error))
});

router.put('/:id/tpc/:idTpc', function(req, res, next) {
  aluno.inverteTPC(req.params.id,req.params.idTpc)
  .then(data=>res.jsonp(data)) //devolve a resposta em json
  .catch(error=>res.jsonp(error))
});

module.exports = router;
