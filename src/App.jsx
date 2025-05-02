import { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import TopBar from './components/TopBar';
import SideDrawer from './components/SideDrawer';
import TeamDrawer from './components/TeamDrawer';
import PokemonDetail from './page/PokemonDetail';
import MainContent from './page/MainContent';
import ItemsPage from './page/ItemsPage';
import LoginPage from './page/loginPage';
import { Routes, Route } from 'react-router-dom';
import { handleAddToTeam as addToTeam } from './assets/teamAction';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MovesPage from './page/MovePage';

function App() {
  const api = import.meta.env.VITE_API_URL;
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [team, setTeam] = useState([[], [], [], [], [], []]); // 6 team slots
  const [activeTeamIndex, setActiveTeamIndex] = useState(() => {
    const saved = localStorage.getItem('activeTeamIndex');
    return saved !== null ? parseInt(saved) : 0;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleAddToTeam = (pokemon) => {
    addToTeam(pokemon, activeTeamIndex, setTeam);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTeam([[], [], [], [], [], []]);
    setActiveTeamIndex(0);
    navigate('/'); // fallback after logout
  };

  const API_BASE = import.meta.env.VITE_API_URL;
  useEffect(() => {
    localStorage.setItem('activeTeamIndex', activeTeamIndex);
  }, [activeTeamIndex]);

  useEffect(() => {
    if (!token) return;

    const fetchTeams = async () => {
      try {
        const res = await axios.get(`${API_BASE}/teams`, {
          headers: { Authorization: token }
        });
        const teams = Array(6).fill([]);
        res.data.teams.forEach((team) => {
          teams[team.slot] = team.pokemons;
        });
        setTeam(teams);
      } catch (err) {
        console.error('Failed to fetch teams on load:', err);
      }
    };

    fetchTeams();
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  // ⛔ If not logged in, show LoginPage alone
  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <TopBar onMenuClick={() => setDrawerOpen(!drawerOpen)} />
      <SideDrawer open={drawerOpen} setOpen={setDrawerOpen} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/"
          element={
            <MainContent
              team={team}
              setTeam={setTeam}
              drawerOpen={drawerOpen}
              activeTeamIndex={activeTeamIndex}
              handleAddToTeam={handleAddToTeam}
            />
          }
        />
        <Route
          path="/pokemon/:id"
          element={<PokemonDetail handleAddToTeam={handleAddToTeam} />}
        />
        <Route path="/Items" element={<ItemsPage />} />
        <Route path="/moves" element={<MovesPage />} />
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
