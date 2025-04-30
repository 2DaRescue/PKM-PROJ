import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, Typography, Toolbar, IconButton } from '@mui/material';
import PokemonCard from '../components/PokemonCard';
import { useState, useEffect } from 'react';
import axios from 'axios';

const PAGE_SIZE = 30;

export default function MainContent({ drawerOpen , activeTeamIndex}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [pokemonList, setPokemonList] = useState([]); // ✅ Array, not {}

  const loadMore = () => {
    setVisible((prev) => prev + PAGE_SIZE);
  };




  
   // ✅ Define the add handler completely
   const handleAddToTeam = async (pokemon) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in.');

    const simplified = {
      id: pokemon.id,
      name: pokemon.name.english,
      type: pokemon.type,
      sprite: pokemon.image.sprite,
    };
    const teamRes = await axios.get(`http://localhost:3000/team/${activeTeamIndex}`, {
      headers: {
        Authorization: token.startsWith('jwt ') ? token : `jwt ${token}`,
      },
    });
    setTeam(prev => {
      const updated = [...prev];
      updated[activeTeamIndex] = teamRes.data.pokemons || [];
      return updated;
    });
    try {
      const res = await axios.post(
        'http://localhost:3000/team/add', // ✅ Must match backend route exactly
        { teamIndex: activeTeamIndex, pokemon: simplified },
        { headers: { Authorization: token.startsWith('jwt ') ? token : `jwt ${token}` } }
      );
      console.log('✅ Added to team:', res.data);
     
    } catch (err) {
      console.error('❌ Failed to add:', err);
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
      
      <InfiniteScroll
        dataLength={visible}
        next={loadMore}
        hasMore={visible < pokemonList.length}
        loader={<h4>Loading...</h4>}
        style={{ width: "100%", display: 'flex', flexWrap: 'wrap', gap: 16 }}
      >
        {Array.isArray(pokemonList) && pokemonList.slice(0, visible).map((poke) => (
      <PokemonCard
      key={poke._id}
      pokemon={poke}
      onAdd={handleAddToTeam} // ✅ pass it here!
    />
))}
      </InfiniteScroll>
    
    </Box>
  );
}
