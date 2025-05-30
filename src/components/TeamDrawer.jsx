import { Drawer, Toolbar, Typography, Box, List, ListItem,
   ToggleButton, Card, CardContent,  Grid, IconButton} from '@mui/material';

 import { useEffect } from 'react';

 import axios from 'axios';

const teamDrawerWidth = 240;
const api = import.meta.env.VITE_API_URL;
export default function TeamDrawer({ team, setTeam, activeTeamIndex, setActiveTeamIndex }) {
  const handleTeamChange = (event, newIndex) => {
    if (newIndex !== null) {
      setActiveTeamIndex(newIndex);
    }
  };
  const API_BASE = import.meta.env.VITE_API_URL;
  const handleDelete = async (pokeIndex) => {
    const token = localStorage.getItem('token');
    try {
      // Delete from backend
      await axios.delete(`${API_BASE}/team/${activeTeamIndex}/${pokeIndex}`, {
        headers: {
          Authorization: token.startsWith('jwt ') ? token : `jwt ${token}`,
        },
      });
  
      // Re-fetch updated team
      const res = await axios.get(`${API_BASE}/team/${activeTeamIndex}`, {
        headers: {
          Authorization: token.startsWith('jwt ') ? token : `jwt ${token}`,
        },
      });
  
      // Update only the active team in full team array
      setTeam(prev => {
        const updated = [...prev];
        updated[activeTeamIndex] = res.data.pokemons || [];
        return updated;
      });
  
      console.log('✅ Deleted Pokémon and refreshed team!');
    } catch (err) {
      console.error('❌ Delete failed:', err);
    }
  };
  

  useEffect(() => {
    const fetchTeam = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${API_BASE}/team/${activeTeamIndex}`, {
          headers: {
            Authorization: token.startsWith('jwt ') ? token : `jwt ${token}`,
          },
        });
        setTeam(prev => {
          const updated = [...prev];
          updated[activeTeamIndex] = res.data.pokemons || [];
          return updated;
        });
      } catch (err) {
        console.error('❌ Failed to load team:', err);
      }
    };
  
    fetchTeam();
  }, [activeTeamIndex]);


  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: teamDrawerWidth,
        flexShrink: 0,
        
        '& .MuiDrawer-paper': {
          width: teamDrawerWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          overflowX: 'hidden',

        },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          Height: '100%',
          padding: 2, overflow: 'hidden', p: 2
        }}>
        <Typography variant="h6" align="center" gutterBottom  sx={ {pt:'64px'}}>
          Your Team
        </Typography>
        <Grid
          container
          spacing={0}
          columns={6}
          sx={{
            maxWidth: 'fit-content',        
            mx: 'auto',                    
            mt: 1,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Grid position='center' item xs={2} key={index}> {/* 2 columns (3 + 3 = 6 total per row) */}
              <ToggleButton
                value={index}
                selected={activeTeamIndex === index}
                onChange={handleTeamChange}
                size="small"
                sx={{
                  width: '100%',
                  fontSize: '0.65rem',        
                  height: 28,               
                  borderRadius: 1,
                  m: 0.5,                     
                }}
              >
                Team {index + 1}
              </ToggleButton>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 2, width: '100%' }}>
  <Typography variant="subtitle1" gutterBottom>
    Active Team:
  </Typography>



  <Grid container spacing={1}>
  {Array.from({ length: 6 }).map((_, i) => {
    const pokemon = team[i]; 
    return (
      <Grid item xs={12} key={i}>
        
        <CardContent
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    p: 1,
    height: 60,
  }}
>
  {pokemon ? (
    <>
      {/* Left: Sprite and Name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          style={{ width: 40, height: 40, objectFit: 'contain' }}
        />
        <Typography variant="body1">{pokemon.name}</Typography>
      </Box>

      {/* Right: Delete Button */}
      <IconButton onClick={() => handleDelete(i)} size="small" color="error">
        ❌
      </IconButton>
    </>
  ) : (
    <Typography color="textSecondary">Empty</Typography>
  )}
</CardContent>

       
      </Grid>
    );
  })}
</Grid>
</Box>
      </Box>
    </Drawer>
  );
}
