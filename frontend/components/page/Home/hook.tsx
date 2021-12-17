import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Dispatch } from '~/store';
import { signOut as storeSignOut } from '~/store/auth';
import { useSelector } from 'react-redux';
import { authSelector } from '~/store/auth';
export interface useHomePageType {
  signOut: () => Promise<void>;
  mfaEnabledFlag: boolean;
  pushMfaSetting: () => void;
  email: string;
}

export const useHomePage = (): useHomePageType => {
  const history = useHistory();
  const dispatch = useDispatch<Dispatch>();
  const auth = useSelector(authSelector);

  const signOut = async () => {
    await dispatch(storeSignOut());
  };

  const pushMfaSetting = () => history.push('/mfa-setting');

  return {
    signOut,
    mfaEnabledFlag: auth.mfaEnabled,
    pushMfaSetting,
    email: auth.email,
  };
};
