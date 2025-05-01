import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Typography, Paper,Button } from '@mui/material';
import axios from 'axios';
import { typeColors } from '../assets/typeColors';

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
export default function PokemonDetail({ activeTeamIndex, handleAddToTeam }) {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log('📡 Fetching for ID:', id);
    axios
      .get(`${API_BASE}/pokemon/${id}`)
      .then((res) => {
        console.log('✅ Got Pokémon:', res.data);
        setPokemon(res.data);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch Pokémon:', err);
      });
  }, [id]);

  if (!pokemon) return <Typography>Loading...</Typography>;

  const totalStats = Object.values(pokemon.base || {}).reduce((a, b) => a + b, 0);
  const radarData = [
    { stat: 'HP', display: Math.min(pokemon.base?.HP || 0, 150), actual: pokemon.base?.HP || 0 },
    { stat: 'Atk', display: Math.min(pokemon.base?.Attack || 0, 150), actual: pokemon.base?.Attack || 0 },
    { stat: 'Def', display: Math.min(pokemon.base?.Defense || 0, 150), actual: pokemon.base?.Defense || 0 },
    { stat: 'Sp.Atk', display: Math.min(pokemon.base?.["Sp. Attack"] || 0, 150), actual: pokemon.base?.["Sp. Attack"] || 0 },
    { stat: 'Sp.Def', display: Math.min(pokemon.base?.["Sp. Defense"] || 0, 150), actual: pokemon.base?.["Sp. Defense"] || 0 },
    { stat: 'Speed', display: Math.min(pokemon.base?.Speed || 0, 150), actual: pokemon.base?.Speed || 0 },
  ];
  console.log('📊 radarData:', radarData);
  return (
    <Box sx={{ display: 'flex', gap: 4, px: 4,pt:'64px', flexWrap: 'wrap' }}>
      {/* Column 1: Name, image, types */}
      <Box sx={{ flex: 1, minWidth: 240 }}>
        <Typography variant="h3" gutterBottom>{pokemon.name.english} <img
          src={pokemon.image.sprite}
          alt={`${pokemon.name.english} sprite`}
          style={{ width: 48, height: 48, marginLeft: -12, verticalAlign: 'middle' }}
        /> </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Japanese: {pokemon.name.japanese}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>National ID: #{pokemon.id}</Typography>

        <img
          src={pokemon.image?.hires || pokemon.sprite}
          alt={pokemon.name.english}
          style={{ height: 300 }}
        />

        <Typography variant="h6" sx={{ mt: 2 }}>Types:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {pokemon.type.map((t) => (
            <Box
              key={t}
              sx={{
                backgroundColor: typeColors[t] || '#ccc',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 'bold',
                fontSize: '0.875rem',
              }}
            >
              {t}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Column 2: Stats and profile */}
      <Box sx={{ flex: 1, minWidth: 240 }}>
        <Typography variant="h6">Base Stats:</Typography>
        {Object.entries(pokemon.base).map(([key, value]) => (
          <Typography key={key}>{key}: {value}</Typography>
        ))}

        <Typography variant="h6" sx={{ mt: 2 }}>Total Stats: {totalStats}</Typography>

        {pokemon.profile && (
          <>
            <Typography variant="h6" sx={{ mt: 3 }}>Profile:</Typography>
            <Typography>Height: {pokemon.profile.height}</Typography>
            <Typography>Weight: {pokemon.profile.weight}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>Abilities:</Typography>
            {pokemon.profile.ability.map(([name, isHidden]) => (
              <Typography key={name}>
                {name}{isHidden === 'true' ? ' (Hidden)' : ''}
              </Typography>
            ))}


            <Typography variant="h6" sx={{ mt: 2 }}>Egg Groups:</Typography>
            {pokemon.profile.egg.map((group) => (
              <Typography key={group}>{group}</Typography>
            ))}
          </>
        )}
      </Box>

      {/* Column 3: Radar chart */}
      <Box sx={{ flex: 1, minWidth: 400 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Stat Overview:</Typography>
        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="stat" />
              <PolarRadiusAxis domain={[0, 150]} tick={false} axisLine={false} />
              <Radar
                name={pokemon.name.english}
                dataKey="display"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
  <Button
    variant="contained"
    color="primary"
    onClick={() => handleAddToTeam(pokemon)}
  >
    Add to Active Team
  </Button>
</Box>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box sx={{ width: '100%', px: 4, pb: 4, mt: -2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Description:</Typography>
        <Typography>
          {pokemon.description || 'No description available for this Pokémon.'}
        </Typography>
      </Box>
    </Box>
  );
}
