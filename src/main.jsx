import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

import { ThemeProvider, CssBaseline } from '@mui/material'; // ✅ MUI theme system
import theme from './theme'; // ✅ your custom theme


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}> {/* ✅ Applies your theme */}
      <CssBaseline />             {/* ✅ Normalizes background, text, etc */}
      <BrowserRouter>
  <App />
</BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
