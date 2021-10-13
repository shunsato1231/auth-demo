import React from 'react';
import { AuthContextType, useAuth } from './Auth.hook';
import { createContext, useContext } from 'react';

const defaultAuthContext: AuthContextType = {
  flag: {
    mfaEnabled: false,
    mfaVerified: false,
    tokenVerified: false,
  },
  signUp: async () => {
    /** default signup **/
  },
  signIn: async () => {
    /** default signin **/
  },
  signOut: async () => {
    /** default signout **/
  },
  verifiedMfa: async () => {
    /** default verifiedMfa **/
  },
  getMfaQr: async () => '',
  enabledMfa: async () => {
    /** default enabledMfa **/
  },
};

export const AuthContext: React.Context<AuthContextType> =
  createContext<AuthContextType>(defaultAuthContext);

export const useAuthContext = (): AuthContextType => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }): JSX.Element => {
  const authCtx = useAuth();
  return (
    <AuthContext.Provider value={authCtx}>{children}</AuthContext.Provider>
  );
};
