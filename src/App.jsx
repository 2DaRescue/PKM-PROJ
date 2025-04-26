import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import TopBar from './components/TopBar';
import SideDrawer from './components/SideDrawer';
import TeamDrawer from './components/TeamDrawer';
import MainContent from './components/MainContent';

const drawerWidthOpen = 240;
const drawerWidthClosed = 60;
const teamDrawerWidth = 300;

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [team, setTeam] = useState([]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar onMenuClick={() => setDrawerOpen(!drawerOpen)} />
      <SideDrawer open={drawerOpen} setOpen={setDrawerOpen} />
      <MainContent team={team} setTeam={setTeam} drawerOpen={drawerOpen} />
      <TeamDrawer team={team} />
    </Box>
  );
}

export default App;
