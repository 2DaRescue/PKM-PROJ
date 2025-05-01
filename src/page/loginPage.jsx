import {
    Avatar,
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Grid,
    Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage({ onLogin }) {
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isSignup ? '/signup' : '/login';

        try {
            const res = await axios.post(`http://localhost:3000${url}`, form);


            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                onLogin?.(res.data.token);
                
            } else {
                alert('Login success, but no token received');
            }
        } catch (err) {
            console.error('Auth error:', err);
            alert('Login or Signup failed!');
        }
    };

    return (


        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.default',
                padding: 60
                , // helps on smaller screens
            }}
        >
            <Box
                sx={{
                  
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'background.paper',
                    p: 4,
                  
                    boxShadow: 3,
                    
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {isSignup ? 'Sign Up' : 'Log In'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="username"
                        label="Username"
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        onChange={handleChange}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        {isSignup ? 'Create Account' : 'Log In'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" onClick={() => setIsSignup(!isSignup)} variant="body2">
                                {isSignup
                                    ? 'Already have an account? Log in'
                                    : 'Don’t have an account? Sign Up'}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>


    );
}
