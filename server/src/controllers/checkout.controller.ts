import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { AppError } from '../middleware/error.middleware';
import { CreateOrderInput, ValidatePromoInput } from '../schemas/order.schema';

export const FREE_SHIPPING_THRESHOLD = 250;
export const EXPRESS_SHIPPING_FEE = 25;

interface PromoCalculationResult {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
  minCartSpend: number;
}

const evaluatePromoCode = async (
  rawCode: string,
  cartSubtotal: number
): Promise<PromoCalculationResult> => {
  const code = rawCode.trim().toUpperCase();
  const promo = await prisma.promoCode.findUnique({
    where: { code },
  });

  if (!promo || !promo.isActive) {
    throw new AppError(`Promo code "${code}" is invalid or inactive.`, 400, 'INVALID_PROMO');
  }

  if (new Date(promo.expiresAt).getTime() < Date.now()) {
    throw new AppError(`Promo code "${code}" has expired.`, 400, 'EXPIRED_PROMO');
  }

  if (cartSubtotal < promo.minCartSpend) {
    throw new AppError(
      `Promo code "${code}" requires a minimum bag subtotal of $${promo.minCartSpend.toFixed(0)}.`,
      400,
      'MIN_SPEND_NOT_MET'
    );
  }

  const discountType: 'PERCENTAGE' | 'FIXED' =
    promo.discountType === 'PERCENTAGE' ? 'PERCENTAGE' : 'FIXED';

  const rawDiscount =
    discountType === 'PERCENTAGE'
      ? Number(((cartSubtotal * promo.discountValue) / 100).toFixed(2))
      : promo.discountValue;

  const discountAmount = Math.min(cartSubtotal, rawDiscount);

  return {
    code: promo.code,
    discountType,
    discountValue: promo.discountValue,
    discountAmount,
    minCartSpend: promo.minCartSpend,
  };
};

export const validatePromo = async (
  req: Request<Record<string, string>, unknown, ValidatePromoInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, cartSubtotal } = req.body;
    const result = await evaluatePromoCode(code, cartSubtotal);

    res.status(200).json({
      success: true,
      promo: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (
  req: Request<Record<string, string>, unknown, CreateOrderInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;
    const userId = req.user?.userId ?? null;

    const createdOrder = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const preparedLineItems: Array<{
        variantId: string;
        productName: string;
        sku: string;
        size: string;
        color: string;
        unitPrice: number;
        quantity: number;
        imageUrl: string;
      }> = [];

      for (const requestedItem of payload.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: requestedItem.variantId },
          include: { product: true },
        });

        if (!variant) {
          throw new AppError(
            'One or more selected variants no longer exist.',
            404,
            'VARIANT_NOT_FOUND'
          );
        }

        if (variant.stock < requestedItem.quantity) {
          throw new AppError(
            `Insufficient inventory for ${variant.product.name} (${variant.color} / ${variant.size}). Available: ${variant.stock}.`,
            400,
            'INSUFFICIENT_STOCK'
          );
        }

        // Decrement stock inside the transaction
        await tx.productVariant.update({
          where: { id: variant.id },
          data: {
            stock: {
              decrement: requestedItem.quantity,
            },
          },
        });

        const resolvedUnitPrice = variant.price ?? variant.product.basePrice;
        subtotal += resolvedUnitPrice * requestedItem.quantity;

        preparedLineItems.push({
          variantId: variant.id,
          productName: variant.product.name,
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          unitPrice: resolvedUnitPrice,
          quantity: requestedItem.quantity,
          imageUrl: variant.imageUrl,
        });
      }

      subtotal = Number(subtotal.toFixed(2));

      let discountAmount = 0;
      let promoCodeApplied: string | null = null;

      if (payload.promoCode && payload.promoCode.trim().length > 0) {
        const promoEval = await evaluatePromoCode(payload.promoCode, subtotal);
        discountAmount = promoEval.discountAmount;
        promoCodeApplied = promoEval.code;
      }

      const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : EXPRESS_SHIPPING_FEE;
      const finalTotal = Number(Math.max(0, subtotal - discountAmount + shippingFee).toFixed(2));

      const order = await tx.order.create({
        data: {
          userId,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone,
          shippingAddress: payload.shippingAddress,
          shippingCity: payload.shippingCity,
          shippingPostalCode: payload.shippingPostalCode,
          shippingCountry: payload.shippingCountry,
          paymentMethod: payload.paymentMethod,
          subtotal,
          discountAmount,
          shippingFee,
          finalTotal,
          promoCodeApplied,
          status: 'PROCESSING',
          items: {
            create: preparedLineItems,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });

    res.status(201).json({
      success: true,
      order: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};
