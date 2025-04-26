import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, Typography, Toolbar } from '@mui/material';
import PokemonCard from './PokemonCard';
import { useState } from 'react';
import { dummyPokemon } from '../assets/dummyPokemon';



const PAGE_SIZE = 30;

export default function MainContent({ drawerOpen }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const loadMore = () => {
    setVisible((prev) => prev + PAGE_SIZE);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        
       
        p: 3,
        backgroundColor: '#fafafa',
        minHeight: '100vh'
      }}
    >
      <Toolbar />
      <Typography variant="h4" align="center" gutterBottom>Pokémon List</Typography>

      <InfiniteScroll
        dataLength={visible}
        next={loadMore}
        hasMore={visible < dummyPokemon.length}
        loader={<h4>Loading...</h4>}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}
      >
        {dummyPokemon.map((poke) => (
  <PokemonCard key={poke.id} pokemon={poke} />
))}
      </InfiniteScroll>
    </Box>
  );
}
