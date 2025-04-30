import { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import TopBar from './components/TopBar';
import SideDrawer from './components/SideDrawer';
import TeamDrawer from './components/TeamDrawer';
import MainContent from './page/MainContent';
import LoginPage from './page/loginPage';

const drawerWidthOpen = 240;
const drawerWidthClosed = 60;
const teamDrawerWidth = 300;

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [team, setTeam] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Optional: Auto-remove token if it becomes invalid in future
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  // ✅ If not logged in, show login page only
  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

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
