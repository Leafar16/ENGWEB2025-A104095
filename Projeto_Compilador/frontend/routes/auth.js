var express = require('express');
var router = express.Router();
var axios = require('axios');
const {getRole,verifyToken} = require('../middlewares/auth');

router.get('/login', function (req, res, next) {
    res.render('auth/login', { title: 'Login' });
});

router.post('/login', function (req, res, next) {
    const { username, password } = req.body;
    axios.post('http://localhost:3001/users/login', {
        username: username,
        password: password
    })
        .then(response => {
            if (response.data.token) {
                res.cookie('token', response.data.token, { httpOnly: true });
                level = getRole(response.data.token);
                if (level === 'admin') {
                    return res.redirect('/admin/users');
                }
                if (level === 'client') {
                    return res.redirect('/profile');
                } else {
                    return res.redirect('/');
                }
            } else {
                res.render('auth/login', { title: 'Login', error: 'Invalid credentials' });
            }
        })
        .catch(error => {
            res.render('auth/login', { title: 'Login', error: 'An error occurred during login' });
        });
});

router.post('/register/admin', function (req, res, next) {
    const { username, email, password, level } = req.body;
    axios.post('http://localhost:3001/users/register', {
        username: username,
        email: email,
        password: password,
        level: level || 'client'
    })
        .then(() => {
            res.redirect('/admin/users');
        })
        .catch(error => {
            res.render('auth/register', { title: 'Register', error: 'An error occurred during registration' });
        });
});

router.get('/register', function (req, res, next) {
    res.render('auth/register', { title: 'Register' });
});

router.post('/register', function (req, res, next) {
    const { username, email, password, level } = req.body;
    axios.post('http://localhost:3001/users/register', {
        username: username,
        email: email,
        password: password,
        level: level || 'client'
    })
        .then(response => {
            if (response.data.success) {
                res.redirect('/login');
            } else {
                res.render('auth/register', { title: 'Register', error: response.data.message });
            }
        })
        .catch(error => {
            res.render('auth/register', { title: 'Register', error: 'An error occurred during registration' });
        });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

router.get('/login-callback', async (req, res) => {
    const token = req.query.access_token;
    const state = req.query.state;
    if (!token) {
        return res.render('auth/callbackpage');
    }
    if (state === 'google') {
        try {
            const userInfo = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { email, name } = userInfo.data;
            const response = await axios.post('http://localhost:3001/users/social-login', {
                email, name
            });
            if (response.data.token) {
                res.cookie('token', response.data.token, { httpOnly: true });
                return res.redirect('/profile');
            } else {
                return res.redirect('/login');
            }
        } catch (err) {
            return res.redirect('/login');
        }
    } else if (state === 'facebook') {
        try {
            const userInfo = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
            const { name } = userInfo.data;
            const response = await axios.post('http://localhost:3001/users/social-login', {
                name: name
            });
            if (response.data.token) {
                res.cookie('token', response.data.token, { httpOnly: true });
                return res.redirect('/profile');
            } else {
                return res.redirect('/login');
            }
        } catch (err) {
            return res.redirect('/login');
        }
    } else {
        return res.redirect('/login');
    }
});

module.exports = router;