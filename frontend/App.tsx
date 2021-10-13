import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { GuestRoute } from './components/routes/GuestRoute';
import { PrivateRoute } from './components/routes/PrivateRoute';

import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './hooks/Auth/Auth.context';
import { theme } from './theme/default';
import { CssBaseline } from '@mui/material';

import { Signin } from './pages/Signin';
import { Home } from './pages/Home';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Switch>
            <GuestRoute path="/signin" component={Signin} toRedirect="/" />
            <PrivateRoute path="/" component={Home} toRedirect="/signin" />
          </Switch>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
