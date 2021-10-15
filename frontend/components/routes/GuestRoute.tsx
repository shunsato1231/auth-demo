import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuthContext } from '~/hooks/Auth/Auth.context';

interface GuestRouteProps extends RouteProps {
  path: string;
  component: React.FC;
  toRedirect: string;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({
  path,
  component,
  toRedirect,
}): JSX.Element => {
  const auth = useAuthContext();
  const isRedirect = () => {
    if (auth.flag.mfaEnabled) {
      return auth.flag.mfaVerified;
    } else {
      return auth.flag.tokenVerified;
    }
  };
  return isRedirect() ? (
    <Redirect to={toRedirect} />
  ) : (
    <Route path={path} component={component} exact />
  );
};
