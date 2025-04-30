import { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import TopBar from './components/TopBar';
import SideDrawer from './components/SideDrawer';
import TeamDrawer from './components/TeamDrawer';
import MainContent from './page/MainContent';
import LoginPage from './page/loginPage';


function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [team, setTeam] = useState([[], [], [], [], [], []]); // 6 team slots
  const [activeTeamIndex, setActiveTeamIndex] = useState(() => {
    const saved = localStorage.getItem('activeTeamIndex');
    return saved !== null ? parseInt(saved) : 0;
  });
  
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    localStorage.setItem('activeTeamIndex', activeTeamIndex);
  }, [activeTeamIndex]);

  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);

  };

 

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);


  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar onMenuClick={() => setDrawerOpen(!drawerOpen)} />
      <SideDrawer open={drawerOpen} setOpen={setDrawerOpen} onLogout={handleLogout} />
      <MainContent
        team={team}
        setTeam={setTeam}
        drawerOpen={drawerOpen}
        activeTeamIndex={activeTeamIndex}
      />
      <TeamDrawer
        team={team[activeTeamIndex]}
        setTeam={setTeam}
        activeTeamIndex={activeTeamIndex}
        setActiveTeamIndex={setActiveTeamIndex}
      />
    </Box>
  );
}

export default App;
