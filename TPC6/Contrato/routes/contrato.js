var express = require('express');
var router = express.Router();
var axios = require("axios");

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get("http://localhost:16000/contratos")
  .then(resp=>
    res.render('paginaInicial', { contratos: resp.data })
  )
  .catch(err=>{
    res.render('error',{error:err})
  });
});

router.get('/contrato/:id', function(req, res, next) {
  axios.get("http://localhost:16000/contratos/"+req.params.id)
  .then(resp=>
    res.render('paginaContrato', { contrato: resp.data })
  )
  .catch(err=>{
    res.render('error',{error:err})
  });
});

router.get('/entidade/:id', function(req, res, next) {
  axios.get("http://localhost:16000/contratos?entidade="+req.params.id)
  .then(resp=>
    res.render('paginaEntidade', { contratos: resp.data,nipc:req.params.id,nomeEntidade:resp.data[0].entidade_comunicante})
  )
  .catch(err=>{
    res.render('error',{error:err})
  });
});

module.exports = router;
