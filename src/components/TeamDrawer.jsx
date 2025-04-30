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
