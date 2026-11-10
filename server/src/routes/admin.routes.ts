import { Router } from 'express';
import {
  createAdminProduct,
  getAdminOrders,
  updateOrderStatus,
  updateProductStock,
} from '../controllers/admin.controller';
import { requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  createAdminProductSchema,
  updateOrderStatusSchema,
  updateVariantStockSchema,
} from '../schemas/order.schema';

const router = Router();

router.use(requireAdmin);

router.get('/orders', getAdminOrders);
router.patch(
  '/orders/:id/status',
  validateRequest({ body: updateOrderStatusSchema }),
  updateOrderStatus
);
router.post('/products', validateRequest({ body: createAdminProductSchema }), createAdminProduct);
router.patch(
  '/products/:id/stock',
  validateRequest({ body: updateVariantStockSchema }),
  updateProductStock
);

export default router;
