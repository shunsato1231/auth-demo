import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './hooks/Auth/Auth.context';
import { theme } from './theme/default';
import { CssBaseline } from '@mui/material';
import { Login } from './pages/Login';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
