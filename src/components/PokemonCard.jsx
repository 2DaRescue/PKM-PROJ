import { Card, CardContent, CardMedia, Typography, Stack, Chip, Box, IconButton} from '@mui/material';
import { typeColors } from '../assets/typeColors';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function PokemonCard({ pokemon,onAdd }) {
  return (
    
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
       <IconButton
        onClick={() => onAdd(pokemon)}
        size="small"
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          backgroundColor: 'black',
          zIndex: 1,
        }}
      >
        <AddCircleOutlineIcon fontSize="small" />
      </IconButton>
      <CardMedia
        component="img"
        height="140"
        image={pokemon.image.hires}
        alt={pokemon.name.english}
        sx={{ objectFit: 'contain', p: 2 }}
      />
      <CardContent>
          {/* ID and Name */}
  <Typography variant="subtitle2" color="textSecondary" align="center">
    #{pokemon.id.toString().padStart(3, '0')} {/* Shows 001, 025, etc */}
  </Typography>

      <Typography variant="h6" align="center">
  {pokemon.name?.english || 'Unknown'}
  
</Typography>

        {/* Types if you have them */}
        {pokemon.type && (
         <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
         {pokemon.type.map((type) => (
           <Chip
             key={type}
             label={type}
             size="small"
             sx={{
               backgroundColor: typeColors[type] || 'gray', // fallback if unknown
               color: 'white',
               fontWeight: 'bold'
             }}
           />
         ))}
       </Stack>
        )}

       
      </CardContent>
    </Card>
    
  );
}
