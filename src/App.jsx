import { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import TopBar from './components/TopBar';
import SideDrawer from './components/SideDrawer';
import TeamDrawer from './components/TeamDrawer';
import PokemonDetail from './page/PokemonDetail';
import MainContent from './page/MainContent';
import LoginPage from './page/loginPage';
import { Routes, Route } from 'react-router-dom';
import { handleAddToTeam as addToTeam } from './assets/teamAction';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function App() {
  const api = import.meta.env.VITE_API_URL;
  const [drawerOpen, setDrawerOpen] = useState(true);
  
  const [team, setTeam] = useState([[], [], [], [], [], []]); // 6 team slots
  const [activeTeamIndex, setActiveTeamIndex] = useState(() => {
    const saved = localStorage.getItem('activeTeamIndex');
    return saved !== null ? parseInt(saved) : 0;
  });

  const handleAddToTeam = (pokemon,) => {
    addToTeam(pokemon, activeTeamIndex, setTeam);
  };
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    localStorage.setItem('activeTeamIndex', activeTeamIndex);
  }, [activeTeamIndex]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const fetchTeams = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL, {
          headers: { Authorization: token }
        });
        const teams = Array(6).fill([]); // fallback
        res.data.teams.forEach((team) => {
          teams[team.slot] = team.pokemons;
        });
        setTeam(teams);
      } catch (err) {
        console.error('Failed to fetch teams on load:', err);
      }
    };
  
    fetchTeams();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTeam([[], [], [], [], [], []]);      // ✅ clear team state
  setActiveTeamIndex(0);                  // ✅ reset index
  navigate('/login');                     // ✅ back to login

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

      <Routes>
        <Route path="/" element={
          <MainContent
            team={team}
            setTeam={setTeam}
            drawerOpen={drawerOpen}
            activeTeamIndex={activeTeamIndex}
            handleAddToTeam={handleAddToTeam}
          />
        } />
        <Route path="/pokemon/:id" element={
          <PokemonDetail 
          handleAddToTeam={handleAddToTeam}
          />} />
      </Routes>

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
