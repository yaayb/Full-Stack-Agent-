import { Router } from 'express';
import { createOrder, validatePromo } from '../controllers/checkout.controller';
import { optionalAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createOrderSchema, validatePromoSchema } from '../schemas/order.schema';

const router = Router();

router.post('/validate-promo', validateRequest({ body: validatePromoSchema }), validatePromo);
router.post('/order', optionalAuth, validateRequest({ body: createOrderSchema }), createOrder);

export default router;
