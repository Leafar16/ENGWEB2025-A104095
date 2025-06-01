var express = require('express');
var router = express.Router();
var Classifier = require('../controllers/classifier')

/* GET home page. */
router.get('/', function(req, res, next) {
    Classifier.list()
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
  });

router.get('/:id', function(req, res, next) {
    Classifier.findByIdClassifier(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.post('/', function(req, res, next) {
    Classifier.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.put('/:id', function(req, res, next) {
  var id = req.params.id;
  Classifier.update(id, req.body)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.delete('/:id', function(req, res, next) {
  var id = req.params.id;
  Classifier.delete(id)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

module.exports = router;