const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/users');
const { generateToken, verifyToken } = require('./auth');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = User.findByUsername(username);
  
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = await User.create(username, password);
  const token = generateToken(newUser);
  res.status(201).json({ message: 'User created successfully', token });
});

// Route to login (authenticate)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = User.findByUsername(username);

  if (!user || !(await user.validatePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ message: 'Login successful', token });
});

// Route to access protected resource
app.get('/protected', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: 'Token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.json({ message: 'Protected resource accessed', user: decoded });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
