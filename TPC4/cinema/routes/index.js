var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res) {//req-> pedido res->reposta 
  res.render('index', 
    { title: 'Engenharia Web 2025' ,
      docente:"jcr",
      instituicao:"DI-UM"
    }
  );
});

router.get('/filmes', function(req, res) {//req-> pedido res->reposta 
 axios.get("http://localhost:3000/filmes")
 .then(resp=>{
  res.render('filmes',{title:"Lista de Filmes",lista_filmes: resp.data})
 }).catch(error=>{
    console.log(error)
    res.render('error',{error: error})
 })
});

router.get("/filmes/edit/:d",function(req,res){
  axios.get("http://localhost:3000/filmes/"+req.params.d)
  .then(resp=>{
    res.status(200);
    res.render('editPage',{filme: resp.data});
  })
  .catch(err=>{
    res.status(500).render('error',{error: err})
  });
});


router.get("/delete/:d",function(req,res){
  axios.delete("http://localhost:3000/filmes/"+req.params.d)
  .then(resp=>{
    res.status(200);
    console.log(resp.data);
    res.redirect("/filmes");
  })
  .catch(err=>{
    res.status(500);
    res.render('error',{error: err});
  });
});

router.get("/ator/:d",function(req,res){
  var filmes=[];
  axios.get("http://localhost:3000/filmes")
  .then(resp=>{
    for (let i=0; i<resp.data.length; i++){
      if (resp.data[i].cast.includes(req.params.d)){
        filmes.push(resp.data[i].title);
      }
    }    
    res.render("atorFilmes",{lista_filmes: filmes,ator: req.params.d})
  })
  .catch(err=>{
    res.status(500);
    res.render("error",{error: err});
  });
});

router.post("/filmes/edit/:d",function(req,res){
  var filme = {title: req.body.titulo, year: req.body.ano, cast: req.body.cast.split(","), genres: req.body.genres.split(",")};
  axios.put("http://localhost:3000/filmes/"+req.params.d,filme)
  .then(resp=>{
    res.status(200);
    res.redirect("/filmes");
  }).catch(err=>{
    res.status(500);
    res.render('error',{error: err});
  });
});
module.exports = router;

//adicionar editar e adicionar filme