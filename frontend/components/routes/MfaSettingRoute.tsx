import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuthContext } from '../../hooks/Auth/Auth.context';

interface PrivateRouteProps extends RouteProps {
  path: string;
  component: React.FC;
  toRedirect: string;
}

export const MfaSettingRoute: React.FC<PrivateRouteProps> = ({
  path,
  component,
  toRedirect,
}): JSX.Element => {
  const auth = useAuthContext();
  const isRedirect = () => {
    if (auth.flag.tokenVerified) {
      return auth.flag.mfaEnabled;
    } else {
      return !auth.flag.tokenVerified;
    }
  };
  return isRedirect() ? (
    <Redirect to={toRedirect} />
  ) : (
    <Route path={path} component={component} exact />
  );
};
