import { Drawer, Toolbar, Typography, Box, List, ListItem } from '@mui/material';

const teamDrawerWidth = 300;

export default function TeamDrawer({ team }) {
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
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Your Team
        </Typography>

        <List>
          {team.length === 0 ? (
            <Typography variant="body2" align="center">No Pokémon selected yet</Typography>
          ) : (
            team.map((poke, idx) => (
              <ListItem key={idx}>
                {poke.name}
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Drawer>
  );
}
