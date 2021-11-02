import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { GuestRoute } from '~/components/routes/GuestRoute';
import { PrivateRoute } from '~/components/routes/PrivateRoute';
import { MfaSettingRoute } from '~/components/routes/MfaSettingRoute';

import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '~/hooks/Auth/Auth.context';
import { theme } from '~/theme/default';
import { CssBaseline } from '@mui/material';

import { Signin } from '~/components/page/Signin';
import { Signup } from '~/components/page/Signup';
import { Home } from '~/components/page/Home';
import { MfaSetting } from '~/components/page/MfaSetting';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Switch>
            <GuestRoute path="/signin" component={Signin} toRedirect="/" />
            <GuestRoute path="/signup" component={Signup} toRedirect="/" />
            <MfaSettingRoute
              path="/mfa-setting"
              component={MfaSetting}
              toRedirect="/"
            />
            <PrivateRoute path="/" component={Home} toRedirect="/signin" />
          </Switch>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
