var express = require('express');
var router = express.Router();
var User = require('../controllers/user');
var UserModel = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var logController = require('../controllers/log');
const user = require('../models/user');

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }
    next();
});

router.get('/', function(req, res, next) {
    if (req.query.username) {
        User.getUserByUsername(req.query.username)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ error: 'User não encontrado' });
                }
                res.status(200).json(user);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Erro ao obter user' });
            });
        return;
    }
    User.getUsers()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter users' });
        });
});

router.put('/edit/:id', function(req, res, next) {
    var username = req.params.id;
    console.log(req.body);
    User.editUser(username, req.body)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User não encontrado' });
            }
            res.status(200).json(user);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar user' });
        });
});

router.get('/fillfollow/:username', async function(req, res, next) {
    try {
        const username = req.params.username;
        const currentUser = await UserModel.findOne({ username });
        if (!currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const following = currentUser.following || [];
        const users = await UserModel.find({
            username: { $ne: username, $nin: following }
        }).select('username').exec();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao obter utilizadores' });
    }
});

router.get('/following/:username', async function(req, res, next) {
    try {
        const username = req.params.username;
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const following = user.following || [];
        const users = await UserModel.find({
            username: { $in: following }
        }).select('username').exec();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao obter utilizadores seguidos' });
    }
});

router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    User.getUserById(id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User não encontrado' });
            }
            res.status(200).json(user);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Erro ao obter user' });
        });
});

router.post('/', function(req, res, next) {
    User.createUser(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Erro ao criar user' });
        });
});

router.put('/:id', function(req, res, next) {
    var id = req.params.id;
    User.updateUser(id, req.body)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User não encontrado' });
            }
            res.status(200).json(user);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar user' });
        });
});

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        await User.deleteUser(id);
        res.status(200).json({ message: 'User removido com sucesso' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Erro ao remover user', details: error.message });
    }
});

router.post('/register', async function(req, res, next) {
    try {
        const { username, email, level, password } = req.body;

        const user = await UserModel.register(new UserModel({
            username,
            email,
            level,
            active: true,
            creationDate: new Date(),
        }), password);

        await logController.createLog({
            utilizador: username,
            acao: 'registo',
            detalhes: `Novo utilizador registado (${username})`,
            timestamp: new Date()
        });

        res.send("Success");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Erro no registo de utilizador' });
    }
});

router.post('/login', passport.authenticate('local'), async function(req, res) {
    jwt.sign({
        username: req.user.username,
        level: req.user.level,
    },
    "EngWeb2025",
    {
        expiresIn: '1h'
    },
    async (err, token) => {
        if (err) {
            res.jsonp(err);
        } else {
            await logController.createLog({
                utilizador: req.user.username,
                acao: 'login',
                detalhes: `Login efetuado com sucesso`,
                timestamp: new Date()
            });
            res.status(201).jsonp({ token: token });
        }
    });
});

router.options('/social-login', function(req, res) {
    res.status(200).end();
});

router.post('/social-login', async function(req, res) {
    try {
        const { name } = req.body;
        let user = await User.findByName(name);

        if (!user) {
            user = await User.createUser({
                username: name,
                level: 'client',
                active: true,
                createdAt: new Date()
            });
        }

        const token = jwt.sign({
            username: user.username,
            level: user.level
        }, "EngWeb2025", { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no login social' });
    }
});

router.post('/follow/:username', async function(req, res) {
    try {
        const { follower } = req.body;
        const userToFollow = await UserModel.findOne({ username: req.params.username });
        const followerUser = await UserModel.findOne({ username: follower });

        if (!userToFollow || !followerUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!userToFollow.followers.includes(follower)) {
            userToFollow.followers.push(follower);
            await userToFollow.save();
        }

        if (!followerUser.following.includes(req.params.username)) {
            followerUser.following.push(req.params.username);
            await followerUser.save();
        }

        res.status(201).json({ message: 'Followed successfully', user: followerUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to follow user' });
    }
});

router.post('/unfollow/:username', async function(req, res) {
    try {
        const { follower } = req.body;
        const userToUnfollow = await UserModel.findOne({ username: req.params.username });
        const followerUser = await UserModel.findOne({ username: follower });

        if (!userToUnfollow || !followerUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        userToUnfollow.followers = userToUnfollow.followers.filter(f => f !== follower);
        await userToUnfollow.save();

        followerUser.following = followerUser.following.filter(f => f !== req.params.username);
        await followerUser.save();

        res.status(201).json({ message: 'Unfollowed successfully', user: followerUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
});

module.exports = router;