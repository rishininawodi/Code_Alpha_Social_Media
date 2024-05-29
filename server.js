const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const PORT = 3000;

let posts = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.post('/api/posts', upload.single('photo'), (req, res) => {
  const newPost = {
    id: posts.length + 1,
    photoUrl: `/${req.file.path}`,
    likes: 0,
    comments: []
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.post('/api/posts/:id/like', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.likes += 1;
    res.status(200).json(post);
  } else {
    res.status(404).send('Post not found');
  }
});

app.post('/api/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.comments.push(req.body.comment);
    res.status(201).json(post);
  } else {
    res.status(404).send('Post not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
