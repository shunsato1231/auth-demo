import { Router } from 'express';
import SignUp from '../action/SignUp';
import SignIn from '../action/SignIn';
import GetMfaSettingCode from '@infrastructure/action/GetMfaSettingCode';
import VerifyMfa from '@infrastructure/action/VerifyMfa';

const router = Router();
router.route('/signup').post(SignUp);
router.route('/signin').post(SignIn);
router.route('/mfa_setting_code').get(GetMfaSettingCode);
router.route('/verify_mfa').post(VerifyMfa);
export default router;
