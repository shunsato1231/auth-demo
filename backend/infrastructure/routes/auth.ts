import { Router } from 'express';
import SignUp from '../action/SignUp';

const router = Router();
router.route('/signup').post(SignUp);

export default router;
