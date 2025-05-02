import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ITEM_TYPES = [
  "Pokeballs", "Medicine", "Battle items", "General items",
  "Hold items", "Key Items", "Berries","Machines"
];

export default function ItemsPage() {
  const API_BASE = import.meta.env.VITE_API_URL;

  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${API_BASE}/items`);
        setAllItems(res.data);
        setFilteredItems(res.data);
      } catch (err) {
        console.error('❌ Error loading items:', err);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredItems(allItems);
    } else {
      setFilteredItems(allItems.filter(item => selectedTypes.includes(item.type)));
    }
  }, [selectedTypes, allItems]);

  const handleTypeToggle = (event, newTypes) => {
    setSelectedTypes(newTypes);
  };

  return (
    <Box sx={{ p: 4,pt:'64px' }}>
      <Typography variant="h4" gutterBottom>Items</Typography>

      <ToggleButtonGroup
        value={selectedTypes}
        onChange={handleTypeToggle}
        aria-label="Item Types"
        sx={{ mb: 2, flexWrap: 'wrap' }}
      >
        {ITEM_TYPES.map((type) => (
          <ToggleButton key={type} value={type}>
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <TableContainer component={Paper} sx={{ maxHeight: 600, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
               <TableCell>English</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Japanese</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => {
              const nameObj = typeof item.name === 'string'
                ? { english: item.name, japanese: '—', chinese: '—' }
                : item.name;

              return (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{nameObj.english}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{nameObj.japanese || '—'}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
