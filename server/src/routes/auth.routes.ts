import { Router } from 'express';
import { getMe, login, logout, register } from '../controllers/auth.controller';
import { optionalAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validateRequest({ body: registerSchema }), register);
router.post('/login', validateRequest({ body: loginSchema }), login);
router.post('/logout', logout);
router.get('/me', optionalAuth, getMe);

export default router;
