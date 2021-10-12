import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './hooks/Auth/Auth.context';
import { theme } from './theme/default';
import { combineComponents } from './utils/combineComponents';

import { CssBaseline } from '@mui/material';
import { Login } from './pages/Login';

const providers = [AuthProvider, () => <ThemeProvider theme={theme} />];
const AppContextProvider = combineComponents(...providers);

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <CssBaseline />
      <Login />
    </AppContextProvider>
  );
};

export default App;
