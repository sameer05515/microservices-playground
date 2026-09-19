import React from 'react';
import {createRoot} from 'react-dom/client';
import {CssBaseline,ThemeProvider,createTheme} from '@mui/material';
import App from './App'; import './styles.css';
const theme=createTheme({palette:{primary:{main:'#2563eb'}},typography:{fontFamily:'Inter,Roboto,Arial,sans-serif'}});
createRoot(document.getElementById('root')).render(<ThemeProvider theme={theme}><CssBaseline/><App/></ThemeProvider>);
