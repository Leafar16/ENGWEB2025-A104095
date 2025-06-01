var express = require('express');
var router = express.Router();
var usersRouter = require('./users');
var classifiersRouter = require('./classifiers');
var logsRouter = require('./logs');
var itemsRouter = require('./items');
var sipRouter = require('./sip');


router.get('/', function(req, res, next) {
  res.json({ message: 'API Home' });
});

router.use('/classifiers', classifiersRouter);

router.use('/users', usersRouter);

router.use('/logs', logsRouter);

router.use('/items', itemsRouter);

router.use('/sip', sipRouter);


module.exports = router;
