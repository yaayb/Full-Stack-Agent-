import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { AppError } from '../middleware/error.middleware';
import {
  CreateAdminProductInput,
  UpdateOrderStatusInput,
  UpdateVariantStockInput,
} from '../schemas/order.schema';
import { serializeProduct } from './product.controller';

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getAdminOrders = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [orders, productCount, lowStockVariants] = await Promise.all([
      prisma.order.findMany({
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
      prisma.productVariant.count({
        where: {
          stock: { lte: 3 },
        },
      }),
    ]);

    const totalRevenue = orders.reduce((acc, order) => acc + order.finalTotal, 0);

    res.status(200).json({
      success: true,
      orders,
      metrics: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders: orders.length,
        totalProducts: productCount,
        lowStockCount: lowStockVariants,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request<Record<string, string>, unknown, UpdateOrderStatusInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = String(req.params.id || '');
    const { status } = req.body;

    const existing = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existing) {
      throw new AppError('Order not found.', 404, 'ORDER_NOT_FOUND');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdminProduct = async (
  req: Request<Record<string, string>, unknown, CreateAdminProductInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;
    const baseSlug = payload.slug ? slugify(payload.slug) : slugify(payload.name);

    const existingSlug = await prisma.product.findUnique({
      where: { slug: baseSlug },
    });

    const resolvedSlug = existingSlug ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

    const created = await prisma.product.create({
      data: {
        name: payload.name,
        slug: resolvedSlug,
        description: payload.description,
        sizingNotes:
          payload.sizingNotes || 'Tailored architectural fit. Take your normal size.',
        category: payload.category,
        basePrice: payload.basePrice,
        featured: payload.featured,
        images: JSON.stringify(payload.images),
        variants: {
          create: payload.variants.map((v) => ({
            sku: v.sku.toUpperCase(),
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            price: v.price ?? payload.basePrice,
            stock: v.stock,
            imageUrl: v.imageUrl,
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    res.status(201).json({
      success: true,
      product: serializeProduct(created),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductStock = async (
  req: Request<Record<string, string>, unknown, UpdateVariantStockInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const paramId = String(req.params.id || '');
    const { variantId, stock } = req.body;

    // Resolve target variant either by explicit body variantId or by paramId matching variant.id
    const targetVariantId = variantId || paramId;

    const existingVariant = await prisma.productVariant.findUnique({
      where: { id: targetVariantId },
    });

    if (!existingVariant) {
      throw new AppError('Product variant SKU not found.', 404, 'VARIANT_NOT_FOUND');
    }

    const updatedVariant = await prisma.productVariant.update({
      where: { id: existingVariant.id },
      data: { stock },
    });

    res.status(200).json({
      success: true,
      variant: updatedVariant,
    });
  } catch (error) {
    next(error);
  }
};
