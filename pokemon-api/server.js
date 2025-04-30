// 🌿 Load environment variables
require('dotenv').config();
console.log('🌱 DB URI:', process.env.PokemonDB);
// 🔧 Core modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// 📦 Models & Auth Strategy
const User = require('./schema/users');
const Pokemon = require('./schema/pokemon');
require('./auth_jwt'); // passport strategy

// 🚀 Create app
const app = express();

// 🔒 Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

// 🧬 Connect to MongoDB
mongoose.connect(process.env.PokemonDB)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB error:', err));

// 🌐 Test route
app.get('/', (req, res) => {
  res.send('🎉 Pokémon API is working!');
});

// 📝 Signup route
app.post('/signup', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ success: false, msg: 'Please include both username and password to signup.' });
  }

  try {
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });
    await user.save();
    res.status(201).json({ success: true, msg: 'Successfully created new user.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Username already exists.' });
    } else {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
  }
});

// 🔐 Login route
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).select('name username password');
    if (!user) return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      const payload = { id: user._id, username: user.username };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
      console.log('✅ JWT issued:', token);
      res.json({ success: true, token: 'jwt ' + token });
    } else {
      res.status(401).json({ success: false, msg: 'Authentication failed. Incorrect password.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

// 🧠 Get all Pokémon
app.get('/pokemon', async (req, res) => {
  try {
    const allPokemon = await Pokemon.find();
    res.json(allPokemon);
  } catch (err) {
    console.error('❌ Failed to fetch Pokémon:', err);
    res.status(500).json({ error: 'Server error retrieving Pokémon' });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API server running at http://localhost:${PORT}`));
