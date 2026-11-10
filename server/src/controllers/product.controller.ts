import { Request, Response, NextFunction } from 'express';
import { Prisma, Product, ProductVariant } from '@prisma/client';
import { prisma } from '../config/db';
import { AppError } from '../middleware/error.middleware';

export interface SerializedProduct extends Omit<Product, 'images'> {
  images: string[];
  variants: ProductVariant[];
}

export const serializeProduct = (
  product: Product & { variants: ProductVariant[] }
): SerializedProduct => {
  let parsedImages: string[] = [];
  try {
    const raw = JSON.parse(product.images) as unknown;
    if (Array.isArray(raw)) {
      parsedImages = raw.filter((item): item is string => typeof item === 'string');
    }
  } catch {
    parsedImages = [];
  }

  return {
    ...product,
    images: parsedImages,
  };
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : undefined;
    const size = typeof req.query.size === 'string' ? req.query.size.trim() : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
    const featuredParam = typeof req.query.featured === 'string' ? req.query.featured : undefined;
    const sort = typeof req.query.sort === 'string' ? req.query.sort : 'newest';

    const priceMinRaw = typeof req.query.price_min === 'string' ? Number(req.query.price_min) : undefined;
    const priceMaxRaw = typeof req.query.price_max === 'string' ? Number(req.query.price_max) : undefined;
    const pageRaw = typeof req.query.page === 'string' ? Number(req.query.page) : 1;
    const limitRaw = typeof req.query.limit === 'string' ? Number(req.query.limit) : 12;

    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 50) : 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (featuredParam === 'true') {
      where.featured = true;
    }

    if (
      (priceMinRaw !== undefined && Number.isFinite(priceMinRaw)) ||
      (priceMaxRaw !== undefined && Number.isFinite(priceMaxRaw))
    ) {
      where.basePrice = {
        ...(priceMinRaw !== undefined && Number.isFinite(priceMinRaw) ? { gte: priceMinRaw } : {}),
        ...(priceMaxRaw !== undefined && Number.isFinite(priceMaxRaw) ? { lte: priceMaxRaw } : {}),
      };
    }

    if (size && size !== 'ALL') {
      where.variants = {
        some: {
          size,
        },
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { basePrice: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { basePrice: 'desc' };
    }

    const [totalCount, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          variants: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    res.status(200).json({
      success: true,
      products: products.map(serializeProduct),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = String(req.params.slug || '');
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        variants: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!product) {
      throw new AppError('Piece not found in the Atelier Vanguard archive.', 404, 'PRODUCT_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      product: serializeProduct(product),
    });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(200).json({
        success: true,
        productIds: [],
        products: [],
      });
      return;
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: req.user.userId },
      include: {
        product: {
          include: {
            variants: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      productIds: wishlistItems.map((item) => item.productId),
      products: wishlistItems.map((item) => serializeProduct(item.product)),
    });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (
  req: Request<Record<string, string>, unknown, { productId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required to persist wishlist.', 401, 'UNAUTHORIZED');
    }

    const { productId } = req.body;
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError('Product not found.', 404, 'PRODUCT_NOT_FOUND');
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId,
        },
      },
    });

    let action: 'added' | 'removed';
    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      action = 'removed';
    } else {
      await prisma.wishlistItem.create({
        data: {
          userId: req.user.userId,
          productId,
        },
      });
      action = 'added';
    }

    const updatedItems = await prisma.wishlistItem.findMany({
      where: { userId: req.user.userId },
      select: { productId: true },
    });

    res.status(200).json({
      success: true,
      action,
      productId,
      productIds: updatedItems.map((i) => i.productId),
    });
  } catch (error) {
    next(error);
  }
};
