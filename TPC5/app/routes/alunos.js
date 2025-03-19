var express = require('express');
var router = express.Router();
var axios=require("axios");

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get("http://localhost:3000").then(
    resp=>res.render('AlunosList', { lista_alunos: resp.data  })
  ).catch(error=>res.render('error', { error: error  }))
  
});

router.get("/:id",function(req,res,next){
  axios.get("http://localhost:3000/"+req.params.id).then(
    resp=>res.render('AlunoPage', { a: resp.data  })
  ).catch(error=>res.render('error', { error: error  }))
})

router.get('/edit/:id', function(req, res, next) {
  axios.get(`http://localhost:3000/${req.params.id}`).then(
    resp=>res.render('AlunoEditForm', { a: resp.data  })
  ).catch(error=>res.render('error', { error: error  }))
  
});


router.post('/edit/:id',function(req,res,next){
  var aluno={"id":req.body.id,"nome":req.body.nome,"gitlink":req.body.gitlink,
    tpc1: req.body.tpc1 ? true : false,  
    tpc2: req.body.tpc2 ? true : false,
    tpc3: req.body.tpc3 ? true : false,
    tpc4: req.body.tpc4 ? true : false,
    tpc5: req.body.tpc5 ? true : false,
    tpc6: req.body.tpc6 ? true : false,
    tpc7: req.body.tpc7 ? true : false,
    tpc8: req.body.tpc8 ? true : false,}
  axios.put("http://localhost:3000/"+req.params.id,aluno)
  .then(res.redirect("/"))
  .catch(error=>res.render('error', { error: error  }))
})

router.get("/delete/:id",function(req,res,next){
  axios.delete(`http://localhost:3000/${req.params.id}`)
  .then(res.redirect("/"))
  .catch(error=>res.render('error', { error: error  }))
})

router.get("/new",function(req,res,next){
  res.render("AlunoNovoForm")
})

router.post("/new",function(req,res,next){
  axios.post(`http://localhost:3000`,req.body)
  .then(()=>{res.status(201).redirect("/")})
  .catch(error=>res.render('error', { error: error  }))
})

module.exports = router;
