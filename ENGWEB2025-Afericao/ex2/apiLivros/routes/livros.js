var express = require('express');
var router = express.Router();
var Livro = require('../controllers/livros')

router.get('/books', function(req, res, next){
  if (req.query.character) {
    Livro.getLivrosByCharacter(req.query.character)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
  } 
  else if (req.query.genre) {
    Livro.getLivrosByGenre(req.query.genre)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
  } 
  else {
    Livro.list()
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
  }
})

router.get('/books/genres', function(req, res, next){
  Livro.getAllGenres()
  .then(data => res.status(200).jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
})

router.get('/books/characters', function(req, res, next){
  Livro.getAllCharacters()
  .then(data => res.status(200).jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
})

router.get('/books/author/:id', function(req, res, next){
  Livro.getAllBooksByAuthor(req.params.id)
  .then(data => res.status(200).jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
})


router.get('/books/:id', function(req, res, next){
  var id = req.params.id
  Livro.getById(id)
  .then(data => res.status(200).jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
})

router.post('/books', function(req, res, next) {
    Livro.insert(req.body)
        .then(data => res.status(201).jsonp(data))
        .catch(erro => res.status(400).jsonp(erro));
});

router.delete('books/:id', function(req, res, next) {
    Livro.delete(req.params.id)
        .then(() => res.status(200).jsonp({ message: "Livro eliminado com sucesso." }))
        .catch(erro => res.status(500).jsonp(erro));
});

router.put('books/:id', function(req, res, next) {
    Livro.update(req.params.id, req.body)
        .then(data => res.status(200).jsonp(data))
        .catch(erro => res.status(500).jsonp(erro));
});

module.exports = router;