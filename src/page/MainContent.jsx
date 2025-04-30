import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, Typography, Toolbar } from '@mui/material';
import PokemonCard from '../components/PokemonCard';
import { useState, useEffect } from 'react';
import axios from 'axios';

const PAGE_SIZE = 30;

export default function MainContent({ drawerOpen }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [pokemonList, setPokemonList] = useState([]); // ✅ Array, not {}

  const loadMore = () => {
    setVisible((prev) => prev + PAGE_SIZE);
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
      <Box
  id="scrollableCardArea"

>
      <InfiniteScroll
        dataLength={visible}
        next={loadMore}
        hasMore={visible < pokemonList.length}
        loader={<h4>Loading...</h4>}
        style={{ width: "100%", display: 'flex', flexWrap: 'wrap', gap: 16 }}
      >
        {Array.isArray(pokemonList) && pokemonList.slice(0, visible).map((poke) => (
      <PokemonCard key={poke._id} pokemon={poke} />
))}
      </InfiniteScroll>
    </Box>
    </Box>
  );
}
