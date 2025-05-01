import axios from 'axios';

export const handleAddToTeam = async (pokemon, activeTeamIndex, setTeam) => {
  const token = localStorage.getItem('token');
  if (!token) return alert('You must be logged in.');
  const api = import.meta.env.host;
  const simplified = {
    id: pokemon.id,
    name: pokemon.name.english,
    type: pokemon.type,
    sprite: pokemon.image?.sprite,
  };

  try {
    // Add to backend
    await axios.post(
        api,
      { teamIndex: activeTeamIndex, pokemon: simplified },
      {
        headers: {
          Authorization: token.startsWith('jwt ') ? token : `jwt ${token}`,
        },
      }
    );

    // 🔄 Refresh that specific team slot from backend
    const teamRes = await axios.get(`${api}${activeTeamIndex}`, {
      headers: {
        Authorization: token.startsWith('jwt ') ? token : `jwt ${token}`,
      },
    });

    // ✅ Update only the active team
    setTeam((prev) => {
      const updated = [...prev];
      updated[activeTeamIndex] = teamRes.data.pokemons || [];
      return updated;
    });

    console.log('✅ Pokémon added & team updated!');
  } catch (err) {
    console.error('❌ Failed to add or refresh:', err);
    alert(err.response?.data?.msg || 'Add failed');
  }
};
