import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, Typography, Toolbar,TextField, MenuItem } from '@mui/material';
import PokemonCard from '../components/PokemonCard';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 30;

export default function MainContent({ drawerOpen, setTeam, activeTeamIndex ,add}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [pokemonList, setPokemonList] = useState([]); // ✅ Array, not {}

  const loadMore = () => {
    setVisible((prev) => prev + PAGE_SIZE);
  };

  const [filters, setFilters] = useState({
    id: '',
    name: '',
    type: '',
    total: '',
    totalCompare: 'gt' // one dropdown for totalStats
  });
  const handleAddToTeam = async (pokemon) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in.');
  
    const simplified = {
      id: pokemon.id,
      name: pokemon.name.english,
      type: pokemon.type,
      sprite: pokemon.image.sprite,
    };
  
    try {
      // Add to backend
      await axios.post(
        'http://localhost:3000/team/add',
        { teamIndex: activeTeamIndex, pokemon: simplified },
        {
          headers: {
            Authorization: token.startsWith('jwt ') ? token : `jwt ${token}`,
          },
        }
      );
  
      // 🔄 Refresh that specific team slot from backend
      const teamRes = await axios.get(`http://localhost:3000/team/${activeTeamIndex}`, {
        headers: {
          Authorization: token.startsWith('jwt ') ? token : `jwt ${token}`,
        },
      });
  
      // ✅ Update only the active team
      setTeam((prev) => {
        const updated = [...prev];
        updated[activeTeamIndex] = teamRes.data.pokemons || [];
        return updated;
      });
  
      console.log('✅ Pokémon added & team updated!');
    } catch (err) {
      console.error('❌ Failed to add or refresh:', err);
      alert(err.response?.data?.msg || 'Add failed');
    }
  };
  


  useEffect(() => {
    axios.get('http://localhost:3000/pokemon')
      .then((res) => {
        console.log('🔥 Response:', res.data);
        setPokemonList(res.data); // res.data should be an array
      })
      .catch((err) => console.error('❌ API error:', err));
  }, []);


  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
        minHeight: '100vh',
        padding: 2,
      }}
    >
      <Toolbar />
      <Typography variant="h4" align="center" gutterBottom>
        Pokémon List
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
  <TextField
    size="small"
    label="ID"
    type="number"
    value={filters.id}
    onChange={(e) => setFilters({ ...filters, id: e.target.value })}
  />
  <TextField
    size="small"
    label="Name"
    value={filters.name}
    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
  />
  <TextField
    size="small"
    label="Type"
    value={filters.type}
    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
  />

<TextField
  size="small"
  label="Total Stats (e.g. >400)"
  value={filters.total}
  onChange={(e) => setFilters({ ...filters, total: e.target.value })}
  sx={{ width: 180 }}
/>
</Box>
      <InfiniteScroll
        dataLength={visible}
        next={loadMore}
        hasMore={visible < pokemonList.length}
        loader={<h4>Loading...</h4>}
        style={{ width: "100%", display: 'flex', flexWrap: 'wrap', gap: 16 }}
      >
        {Array.isArray(pokemonList) &&
  pokemonList
    .filter((poke) => {
      const matchId = filters.id ? poke.id.toString() === filters.id : true;
      const matchName = filters.name
        ? poke.name.english.toLowerCase().includes(filters.name.toLowerCase())
        : true;
      const matchType = filters.type
        ? poke.type.some((t) =>
            t.toLowerCase().includes(filters.type.toLowerCase())
          )
        : true;
        const matchTotal = filters.total
        ? (() => {
            const raw = filters.total.trim();
            const op = raw[0];
            const val = parseInt(raw.replace(/[<>=]/g, ''));
      
            const total = Object.values(poke.base || {}).reduce((a, b) => a + b, 0);
      
            if (isNaN(val)) return true; // skip if invalid
      
            if (op === '>') return total > val;
            if (op === '<') return total < val;
            if (op === '=') return total === val;
      
            // Default to equal if no symbol
            return total === parseInt(raw);
          })()
        : true;

      return matchId && matchName && matchType && matchTotal;
    })
    .slice(0, visible)
    .map((poke) => (

     
      <PokemonCard
        key={poke._id||poke.id}
        pokemon={poke}
        onAdd={handleAddToTeam}
      />
     

    ))}
      </InfiniteScroll>

    </Box>
  );
}
