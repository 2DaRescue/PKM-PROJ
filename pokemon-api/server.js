
require('dotenv').config();



const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


const User = require('./schema/users');
const Pokemon = require('./schema/pokemon');
const Team = require('./schema/teams');
const { isAuthenticated } = require('./auth_jwt');
require('./auth_jwt'); // passport strategy


const app = express();


const allowedOrigins = [
  'http://localhost:5173',
  'https://pkm-proj.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());


mongoose.connect(process.env.PokemonDB)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB error:', err));

// 🌐 Test route
app.get('/', (req, res) => {
  res.send('Welcom to my simple API!');
});

//  Signup route
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

//  Login route
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).select('name username password');
    if (!user) return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      const payload = { id: user._id, username: user.username };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '72h' });
      res.json({ success: true, token: 'jwt ' + token });
    } else {
      res.status(401).json({ success: false, msg: 'Authentication failed. Incorrect password.' });
    }
    console.log('✅ Token generated:', token);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

//  Get all Pokémon
app.get('/pokemon', async (req, res) => {
  try {
    const allPokemon = await Pokemon.find();
    res.json(allPokemon);
  } catch (err) {
    console.error('❌ Failed to fetch Pokémon:', err);
    res.status(500).json({ error: 'Server error retrieving Pokémon' });
  }
});

app.get('/pokemon/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const poke = await Pokemon.findOne({ id });
    if (!poke) {
      return res.status(404).json({ success: false, msg: 'Pokémon not found.' });
    }

    res.json(poke);
  } catch (err) {
    console.error('❌ Error fetching Pokémon by ID:', err);
    res.status(500).json({ success: false, msg: 'Server error.' });
  }
});


app.post('/team/add', isAuthenticated, async (req, res) => {
  const { teamIndex, pokemon } = req.body;
  console.log('✅ /team/add called');
  // ✅ Basic input check
  if (
    typeof teamIndex !== 'number' ||
    !pokemon ||
    typeof pokemon.id !== 'number' ||
    typeof pokemon.name !== 'string' ||
    !Array.isArray(pokemon.type) ||
    typeof pokemon.sprite !== 'string'
  ) {
    return res.status(400).json({ success: false, msg: 'Invalid Pokémon data or team index.' });
  }

  try {
    let team = await Team.findOne({ userId: req.user._id, slot: teamIndex });

    if (!team) {
      // 🚀 Create new team if this is the first time slot is used
      team = new Team({
        name: `Team ${teamIndex + 1}`,
        slot: teamIndex,
        userId: req.user._id,
        pokemons: [pokemon],
      });
    } else {
      if (team.pokemons.length >= 6) {
        return res.status(400).json({ success: false, msg: 'Team is already full.' });
      }

      team.pokemons.push(pokemon);
    }

    await team.save();
    res.status(200).json({ success: true, team });
  } catch (err) {
    console.error('❌ Failed to add Pokémon to team:', err);
    res.status(500).json({ success: false, msg: 'Server error.' });
  }
});


// 🔐 GET /teams — get all teams for the logged-in user
app.get('/teams', isAuthenticated, async (req, res) => {
  try {
    const teams = await Team.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, teams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch teams' });
  }
});

// 🔐 GET /team/:index — fetch a single team by slot
app.get('/team/:index', isAuthenticated, async (req, res) => {
  const teamIndex = parseInt(req.params.index);
  if (isNaN(teamIndex)) {
    return res.status(400).json({ success: false, msg: 'Invalid team index.' });
  }

  try {
    const team = await Team.findOne({ userId: req.user._id, slot: teamIndex });
    if (!team) {
      return res.status(404).json({ success: false, msg: 'Team not found.' });
    }

    res.status(200).json({ success: true, pokemons: team.pokemons });
  } catch (err) {
    console.error('❌ Error fetching team:', err);
    res.status(500).json({ success: false, msg: 'Server error.' });
  }
});

// DELETE /team/:teamIndex/:pokeIndex — remove a Pokémon from a team
app.delete('/team/:teamIndex/:pokeIndex', isAuthenticated, async (req, res) => {
  const teamIndex = parseInt(req.params.teamIndex);
  const pokeIndex = parseInt(req.params.pokeIndex);

  try {
    const team = await Team.findOne({ userId: req.user._id, slot: teamIndex });
    if (!team) {
      return res.status(404).json({ success: false, msg: 'Team not found.' });
    }

    if (pokeIndex < 0 || pokeIndex >= team.pokemons.length) {
      return res.status(400).json({ success: false, msg: 'Invalid Pokémon index.' });
    }

    // Remove the Pokémon
    team.pokemons.splice(pokeIndex, 1);
    await team.save();

    res.status(200).json({ success: true, pokemons: team.pokemons });
  } catch (err) {
    console.error('❌ Failed to delete Pokémon:', err);
    res.status(500).json({ success: false, msg: 'Server error.' });
  }
});










// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API server running at http://localhost:${PORT}`));
