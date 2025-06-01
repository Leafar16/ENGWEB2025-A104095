var express = require('express');
var router = express.Router();
const { verifyAdminToken } = require('../middlewares/auth');
var axios = require('axios');

router.get('/users/:id', verifyAdminToken, function(req, res, next) {
    if (req.query.username) {
        axios.put(`http://localhost:3001/users/edit/${req.params.id}`, {
            username: req.query.username,
            email: req.query.email,
            level: req.query.level,
            active: true,
            creationDate: new Date(req.query.creationDate)
        }, {
            headers: { Authorization: `Bearer ${req.cookies.token}` }
        })
        .then(() => {
            res.redirect('/admin/users');
        })
        .catch(error => {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).send('Erro ao atualizar usuário.');
        }); 
    }
});

router.get('/users', verifyAdminToken, function(req, res, next) {
    axios.get('http://localhost:3001/users', {
        headers: { Authorization: `Bearer ${req.cookies.token}` }
    })
    .then(response => {
        const users = response.data;
        res.render('admin/users', { title: 'DigiME - Admin', user: req.user, users : users });
    })
    .catch(error => {
        console.error('Erro ao obter usuários:', error);
        res.status(500).send('Erro ao carregar usuários.');
    });
});




router.get('/logs', verifyAdminToken, function(req, res, next) {
    axios.get('http://localhost:3001/logs', {
        headers: { Authorization: `Bearer ${req.cookies.token}` }
    })
    .then(response => {
        const logs = response.data;
        res.render('admin/logs', { title: 'DigiME - Admin', user: req.user, logs : logs });
    })
    .catch(error => {
        console.error('Erro ao obter logs:', error);
        res.status(500).send('Erro ao carregar logs.');
    });
})


router.post('/users/:id', verifyAdminToken, function(req, res, next) {
    const userId = req.params.id;
    if (req.body.method !== 'DELETE') {
        axios.delete(`http://localhost:3001/users/${userId}`, {
            headers: { Authorization: `Bearer ${req.cookies.token}` }
        })
        .then(() => {
            res.redirect('/admin/users');
        })
        .catch(error => {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).send('Erro ao excluir usuário.');
        });
    }

});


router.post('/items/:id', verifyAdminToken, function(req, res, next) {
    const itemId = req.params.id;
    if (req.body.method !== 'DELETE') {
        axios.delete(`http://localhost:3001/items/${itemId}`, {
            headers: { Authorization: `Bearer ${req.cookies.token}` }
        })
        .then(() => {
            res.redirect('/admin/posts');
        })
        .catch(error => {
            console.error('Erro ao excluir item:', error);
            res.status(500).send('Erro ao excluir item.');
        });
    }
});

router.get('/posts', verifyAdminToken, function(req, res, next) {
    axios.get('http://localhost:3001/items', {
        headers: { Authorization: `Bearer ${req.cookies.token}` }
    })
    .then(response => {
        const items = response.data;
        items.sort((a, b) => new Date(b.dataSubmissao) - new Date(a.dataSubmissao));
        
        res.render('admin/items', { title: 'DigiME - Admin', user: req.user, items : items });
    })
    .catch(error => {
        console.error('Erro ao obter items:', error);
        res.status(500).send('Erro ao carregar items.');
    });
});
module.exports = router;