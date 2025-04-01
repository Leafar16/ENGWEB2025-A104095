var express = require('express');
var router = express.Router();
var axios = require("axios"); // Correctly require axios

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get("http://localhost:17000/books")
  .then(resp => {
    res.render('livros', { books: resp.data });
  })
  .catch(err => {
    console.error(err);
    res.status(500).send("Error fetching data");
  });
});



router.get('/books/:id', function(req, res, next) {
  axios.get("http://localhost:17000/books/"+req.params.id)
  .then(resp => {
    res.render('livro', { book: resp.data });
  })
  .catch(err => {
    console.error(err);
    res.status(500).send("Error fetching data");
  });
});

router.get('/entidades/:id', function(req, res, next) {
  axios.get("http://localhost:17000/books/author/"+req.params.id)
  .then(resp => {
    res.render('autor', {author:req.params.id, books: resp.data });
  })
  .catch(err => {
    console.error(err);
    res.status(500).send("Error fetching data");
  });
});

module.exports = router;