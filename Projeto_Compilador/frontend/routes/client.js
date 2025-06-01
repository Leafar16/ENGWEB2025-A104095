var express = require('express');
var router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const FormData = require('form-data');
var axios = require('axios');
const multer = require('multer');
const upload = multer();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  next();
});

router.get('/', function(req, res, next) {
  res.render('homepage', { title: 'DigiME', user: req.user });
});

router.get('/profile', verifyToken, async function(req, res) {
  try {
    const token = req.cookies.token;
    const username = req.user.username;
    const userResponse = await axios.get(`http://localhost:3001/users?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = userResponse.data[0];

    const [ownItemsResponse, followingResponse] = await Promise.all([
      axios.get(`http://localhost:3001/items/owner/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`http://localhost:3001/users/following/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    let items = ownItemsResponse.data;
    items.sort((a, b) => new Date(b.dataSubmissao) - new Date(a.dataSubmissao));
    let lastDate = null;
    items = items.map(item => {
      const currentDate = new Date(item.dataSubmissao).toDateString();
      const showDateSeparator = currentDate !== lastDate;
      lastDate = currentDate;
      return {
        ...item,
        showDateSeparator,
        dateLabel: new Date(item.dataSubmissao).toLocaleDateString('pt-PT', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      };
    });


    res.render('client/profile', { 
      title: 'Perfil', 
      items, 
      user: username, 
      followers: user.followers || [],
      following: followingResponse.data.map(u => u.username) || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar o perfil.');
  }
});

router.get('/home', verifyToken, async function(req, res) {
  try {
    const token = req.cookies.token;
    const username = req.user.username;
    const userResponse = await axios.get(`http://localhost:3001/users?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = userResponse.data;

    const [followingItemsResponse, followingResponse] = await Promise.all([
      axios.get(`http://localhost:3001/items/following/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`http://localhost:3001/users/following/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    let items = followingItemsResponse.data;
    items.sort((a, b) => new Date(b.dataSubmissao) - new Date(a.dataSubmissao));
    let lastDate = null;
    items = items.map(item => {
      const currentDate = new Date(item.dataSubmissao).toDateString();
      const showDateSeparator = currentDate !== lastDate;
      lastDate = currentDate;
      return {
        ...item,
        showDateSeparator,
        dateLabel: new Date(item.dataSubmissao).toLocaleDateString('pt-PT', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      };
    });

    res.render('client/homepage', { 
      title: 'Feed de Seguidores', 
      items, 
      user: username, 
      following: followingResponse.data.map(u => u.username) || []
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar o feed de seguidores.');
  }
});

router.get('/upload', verifyToken, function(req, res) {
  res.render('client/formulario', { title: 'Formulário' });
});

router.post('/upload', upload.single('sipFile'), async (req, res) => {
  try {
    const token = req.cookies.token;
    const formData = new FormData();
    formData.append('sipFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    const response = await axios.post('http://localhost:3001/sip/upload', formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao enviar para o backend' });
  }
});

router.post('/items/:id/comments', function(req, res, next) {
  const itemId = req.params.id;
  const comment = req.body;
  axios.post(`http://localhost:3001/items/${itemId}/comments`, comment, {
    headers: { Authorization: `Bearer ${req.cookies.token}` }
  })
  .then(response => {
    res.status(201).jsonp(response.data);
  })
  .catch(error => {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).send('Erro ao adicionar comentário.');
  });
});

router.post('/items/:id/like', function(req, res, next) {
  const itemId = req.params.id;
  const { username } = req.body;
  axios.post(`http://localhost:3001/items/${itemId}/like`, { username }, {
    headers: { Authorization: `Bearer ${req.cookies.token}` }
  })
  .then(response => {
    res.status(201).jsonp(response.data);
  })
  .catch(error => {
    console.error('Erro ao gerir gosto:', error);
    res.status(500).send('Erro ao gerir gosto.');
  });
});

router.get('/download/:username/:pub_id', verifyToken, async (req, res) => {
  try {
    const { username, pub_id } = req.params;
    const token = req.cookies.token;
    const backendResponse = await axios({
      url: `http://localhost:3001/items/download/${username}/${pub_id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'arraybuffer'
    });
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', `attachment; filename="download_${username}_${pub_id}.zip"`);
    res.send(Buffer.from(backendResponse.data));
  } catch (error) {
    console.error('Error in client.js download:', error.message);
    res.status(500).send('Error retrieving download package');
  }
});



module.exports = router;