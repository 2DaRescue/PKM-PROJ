import { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem, TextField, TableSortLabel
} from '@mui/material';
import axios from 'axios';

export default function MovesPage() {
    const [moves, setMoves] = useState([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [minPower, setMinPower] = useState('');
    const [minAccuracy, setMinAccuracy] = useState('');
    const [minPP, setMinPP] = useState('');

    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    // Step 1: Apply filters
    const filteredMoves = moves.filter(move => {
        if (typeFilter && move.type !== typeFilter) return false;
        if (minPower && (move.power ?? 0) < minPower) return false;
        if (minAccuracy && (move.accuracy ?? 0) < minAccuracy) return false;
        if (minPP && (move.pp ?? 0) < minPP) return false;
        return true;
    });

    // Step 2: Apply sorting to the filtered list
    const sortedMoves = [...filteredMoves].sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
      
        // Treat null/undefined as 0 for numeric fields
        if (['power', 'pp', 'accuracy'].includes(sortBy)) {
          valA = valA ?? 0;
          valB = valB ?? 0;
        } else {
          valA = valA ?? '';
          valB = valB ?? '';
        }
      
        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
      
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
      





    useEffect(() => {
        const fetchMoves = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/moves`);
                setMoves(res.data);
            } catch (err) {
                console.error('❌ Error loading moves:', err);
            }
        };
        fetchMoves();
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Moves</Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={typeFilter}
                        label="Type"
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {Array.from(new Set(moves.map(m => m.type))).map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Min Power"
                    type="number"
                    value={minPower}
                    onChange={(e) => setMinPower(e.target.value)}
                />
                <TextField
                    label="Min Accuracy"
                    type="number"
                    value={minAccuracy}
                    onChange={(e) => setMinAccuracy(e.target.value)}
                />
                <TextField
                    label="Min PP"
                    type="number"
                    value={minPP}
                    onChange={(e) => setMinPP(e.target.value)}
                />
            </Box>


            <TableContainer component={Paper} sx={{ maxHeight: 600, minWidth: 1200 }}>
                <Table stickyHeader >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sortBy === 'id'}
                                    direction={sortBy === 'id' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('id')}
                                >ID</TableSortLabel></TableCell>
                            <TableCell>  
                                <TableSortLabel
                                    active={sortBy === 'ename'}
                                    direction={sortBy === 'ename' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('ename')}
                                >English</TableSortLabel>
                                </TableCell>
                            <TableCell>  <TableSortLabel
                                    active={sortBy === 'jname'}
                                    direction={sortBy === 'jname' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('jname')}
                                >Japanese</TableSortLabel></TableCell>
                            <TableCell>  <TableSortLabel
                                    active={sortBy === 'type'}
                                    direction={sortBy === 'type' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('type')}
                                >Type</TableSortLabel></TableCell>
                            <TableCell>  <TableSortLabel
                                    active={sortBy === 'category'}
                                    direction={sortBy === 'category' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('category')}
                                >Category</TableSortLabel></TableCell>
                            <TableCell>  <TableSortLabel
                                    active={sortBy === 'power'}
                                    direction={sortBy === 'power' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('power')}
                                >Power</TableSortLabel></TableCell>
                            <TableCell>  <TableSortLabel
                                    active={sortBy === 'accuracy'}
                                    direction={sortBy === 'accuracy' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('accuracy')}
                                >Accuracy</TableSortLabel> </TableCell>
                            <TableCell>  <TableSortLabel
                                    active={sortBy === 'pp'}
                                    direction={sortBy === 'pp' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('pp')}
                                >PP</TableSortLabel></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedMoves.map((move) => (
                            <TableRow key={move.id}>
                                <TableCell>{move.id}</TableCell>
                                <TableCell>{move.ename}</TableCell>
                                <TableCell>{move.jname}</TableCell>
                                <TableCell>{move.type}</TableCell>
                                <TableCell>{move.category}</TableCell>
                                <TableCell>{move.power ?? '—'}</TableCell>
                                <TableCell>{move.accuracy ?? '—'}</TableCell>
                                <TableCell>{move.pp ?? '—'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}