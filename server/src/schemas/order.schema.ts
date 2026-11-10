import { z } from 'zod';

export const validatePromoSchema = z.object({
  code: z.string().trim().min(1, 'Promo code is required').toUpperCase(),
  cartSubtotal: z.number().nonnegative('Cart subtotal must be non-negative'),
});

export const checkoutOrderItemSchema = z.object({
  variantId: z.string().min(1, 'Variant ID is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2, 'Recipient full name is required'),
  customerEmail: z.string().trim().email('Valid email address is required'),
  customerPhone: z.string().trim().min(6, 'Valid contact phone number is required'),
  shippingAddress: z.string().trim().min(5, 'Street address is required'),
  shippingCity: z.string().trim().min(2, 'City is required'),
  shippingPostalCode: z.string().trim().min(3, 'Postal code is required'),
  shippingCountry: z.string().trim().min(2, 'Country is required'),
  paymentMethod: z.string().trim().default('CARD •••• 4242'),
  promoCode: z.string().trim().optional(),
  items: z.array(checkoutOrderItemSchema).min(1, 'Your bag cannot be empty'),
});

export const wishlistToggleSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

export const createAdminVariantSchema = z.object({
  sku: z.string().trim().min(3, 'SKU is required'),
  size: z.enum(['XS', 'S', 'M', 'L', 'XL']),
  color: z.string().trim().min(1, 'Color name is required'),
  colorHex: z
    .string()
    .trim()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Valid hex color is required (e.g. #0B0B0B)'),
  price: z.number().positive('Price must be positive').optional(),
  stock: z.number().int().nonnegative('Stock must be zero or positive'),
  imageUrl: z.string().url('Variant image must be a valid URL'),
});

export const createAdminProductSchema = z.object({
  name: z.string().trim().min(3, 'Product name is required'),
  slug: z
    .string()
    .trim()
    .min(3, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens')
    .optional(),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  sizingNotes: z.string().trim().optional(),
  category: z.string().trim().min(2, 'Category is required'),
  basePrice: z.number().positive('Base price must be positive'),
  featured: z.boolean().default(false),
  images: z.array(z.string().url('Each gallery image must be a valid URL')).min(1),
  variants: z.array(createAdminVariantSchema).min(1, 'At least one variant is required'),
});

export const updateVariantStockSchema = z.object({
  variantId: z.string().min(1, 'Variant ID is required').optional(),
  stock: z.number().int().nonnegative('Stock must be 0 or greater'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']),
});

export type ValidatePromoInput = z.infer<typeof validatePromoSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateAdminProductInput = z.infer<typeof createAdminProductSchema>;
export type UpdateVariantStockInput = z.infer<typeof updateVariantStockSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
