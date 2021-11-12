import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { GuestRoute } from '~/components/routes/GuestRoute';
import { PrivateRoute } from '~/components/routes/PrivateRoute';
import { MfaSettingRoute } from '~/components/routes/MfaSettingRoute';

import { Provider } from 'react-redux';
import { store } from '~/store';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '~/theme/default';
import { CssBaseline } from '@mui/material';

import { SignIn } from '~/components/page/SignIn';
import { SignUp } from '~/components/page/SignUp';
import { Home } from '~/components/page/Home';
import { MfaSetting } from '~/components/page/MfaSetting';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Switch>
            <GuestRoute path="/signIn" component={SignIn} toRedirect="/" />
            <GuestRoute path="/signUp" component={SignUp} toRedirect="/" />
            <MfaSettingRoute
              path="/mfa-setting"
              component={MfaSetting}
              toRedirect="/"
            />
            <PrivateRoute path="/" component={Home} toRedirect="/signIn" />
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
