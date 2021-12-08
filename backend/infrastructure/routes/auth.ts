import { Router } from 'express';
import SignUp from '../action/SignUp';
import SignIn from '../action/SignIn';

const router = Router();
router.route('/signup').post(SignUp);
router.route('/signin').post(SignIn);

export default router;
