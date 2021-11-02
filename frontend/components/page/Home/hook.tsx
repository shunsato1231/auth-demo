import { useHistory } from 'react-router';
import { useAuthContext } from '~/hooks/Auth/Auth.context';

export interface useHomePageType {
  signOut: () => Promise<void>;
  mfaEnabledFlag: boolean;
  pushMfaSetting: () => void;
}

export const useHomePage = (): useHomePageType => {
  const history = useHistory();
  const auth = useAuthContext();

  const signOut = async () => {
    await auth.signOut();
    history.push('/signin');
  };

  const pushMfaSetting = () => history.push('/mfa-setting');

  return {
    signOut,
    mfaEnabledFlag: auth.flag.mfaEnabled,
    pushMfaSetting,
  };
};
