import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getWishlist, toggleWishlist } from '../controllers/product.controller';
import { optionalAuth, requireAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { wishlistToggleSchema } from '../schemas/order.schema';
import { prisma } from '../config/db';

const router = Router();

const verifyCartItemsSchema = z.object({
  variantIds: z.array(z.string()).default([]),
});

// Wishlist endpoints (/api/wishlist)
router.get('/', optionalAuth, getWishlist);
router.post('/toggle', requireAuth, validateRequest({ body: wishlistToggleSchema }), toggleWishlist);

// Live cart variant inventory verification (/api/cart/verify or /api/wishlist/verify-stock)
router.post(
  '/verify-stock',
  validateRequest({ body: verifyCartItemsSchema }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { variantIds } = req.body as { variantIds: string[] };
      const variants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true },
      });

      res.status(200).json({
        success: true,
        variants: variants.map((v) => ({
          variantId: v.id,
          sku: v.sku,
          stock: v.stock,
          unitPrice: v.price ?? v.product.basePrice,
          productName: v.product.name,
        })),
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
