import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, Typography, Toolbar } from '@mui/material';
import PokemonCard from './PokemonCard';
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
    axios.get('http://localhost:3000/pokemon') // ✅ Correct port for backend
      .then((res) => {
        console.log(res.data); // ✅ Good for debugging
        setPokemonList(res.data);
      })
      .catch((err) => console.error('❌ API error:', err));
  }, []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: '#fafafa',
        minHeight: '100vh',
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
        {pokemonList.slice(0, visible).map((poke) => (
  <PokemonCard key={poke._id} pokemon={poke} />
))}
      </InfiniteScroll>
    </Box>
  );
}
