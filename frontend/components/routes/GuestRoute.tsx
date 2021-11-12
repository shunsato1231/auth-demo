import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authSelector } from '~/store/auth';
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
  const auth = useSelector(authSelector);
  const isRedirect = () => {
    if (auth.mfaEnabled) {
      return auth.mfaVerified;
    } else {
      return auth.tokenVerified;
    }
  };
  return isRedirect() ? (
    <Redirect to={toRedirect} />
  ) : (
    <Route path={path} component={component} exact />
  );
};
