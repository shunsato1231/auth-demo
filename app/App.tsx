import React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/default';

import { Login } from './pages/Login';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Login />
    </ThemeProvider>
  );
};

export default App;