import { Router } from 'express';
import AuthRouter from './auth';

const router = Router();

// Add sub-routes
router.use('/auth', AuthRouter);

export default router;
