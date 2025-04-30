import { Card, CardContent, CardMedia, Typography, Stack, Chip } from '@mui/material';

export default function PokemonCard({ pokemon }) {
  return (
    <box sx={{
      width: 180, // fixed width
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}>
    <Card
      sx={{
        width: 150,
        maxWidth: 150,
        height: 280,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
      
    >
      <CardMedia
        component="img"
        height="140"
        image={pokemon.image.hires}
        alt={pokemon.name.english}
        sx={{ objectFit: 'contain', p: 2 }}
      />
      <CardContent>
      <Typography variant="h6" align="center">
  {pokemon.name?.english || 'Unknown'}
  
</Typography>

        {/* Types if you have them */}
        {pokemon.type && (
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
            {pokemon.type.map((t) => (
              <Chip key={t} label={t} size="small" />
            ))}
          </Stack>
        )}

        {/* Optional: Display stats */}
        {pokemon.base && (
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            HP: {pokemon.base.HP} | SPD: {pokemon.base.Speed}
          </Typography>
        )}
      </CardContent>
    </Card>
    </box>
  );
}
