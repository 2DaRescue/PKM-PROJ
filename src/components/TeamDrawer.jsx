import { Drawer, Toolbar, Typography, Box, List, ListItem,
   ToggleButton, Card, CardContent,  Grid } from '@mui/material';
 import { useEffect } from 'react';

 import axios from 'axios';

const teamDrawerWidth = 240;

export default function TeamDrawer({ team, setTeam, activeTeamIndex, setActiveTeamIndex }) {
  const handleTeamChange = (event, newIndex) => {
    if (newIndex !== null) {
      setActiveTeamIndex(newIndex);
    }
  };

  useEffect(() => {
    const fetchTeam = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:3000/team/${activeTeamIndex}`, {
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
          overflowX: 'auto',

        },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          minHeight: '100vh',
          padding: 2, overflow: 'auto', p: 2
        }}>
        <Typography variant="h6" align="center" gutterBottom>
          Your Team
        </Typography>
        <Grid
          container
          spacing={0}
          columns={6}
          sx={{
            maxWidth: 'fit-content',        // ✅ only take as much space as needed
            mx: 'auto',                     // ✅ center horizontally
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
                  fontSize: '0.65rem',         // ✅ small font like type badges
                  height: 28,                  // ✅ height similar to type chips
                  borderRadius: 1,
                  m: 0.5,                      // ✅ tiny margin to separate slightly
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
    const pokemon = team[i]; // ← this should not be undefined
    return (
      <Grid item xs={12} key={i}>
        <Card>
          <CardContent>
            {pokemon ? (
              <Typography>{pokemon.name}</Typography>
            ) : (
              <Typography color="textSecondary">Empty</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  })}
</Grid>
</Box>
      </Box>
    </Drawer>
  );
}
