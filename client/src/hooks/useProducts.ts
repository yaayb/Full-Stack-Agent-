import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  api,
  CreateAdminProductPayload,
  FulfillmentStatus,
  ProductCatalogQuery,
} from '../services/api';

export const useProducts = (filters: ProductCatalogQuery = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.products.list(filters),
  });
};

export const useProductDetail = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => {
      if (!slug) {
        throw new Error('Product slug is required');
      }
      return api.products.getBySlug(slug);
    },
    enabled: Boolean(slug),
  });
};

export const useAdminOrders = (enabled = true) => {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.admin.getOrders(),
    enabled,
  });
};

export const useUpdateStockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      stock,
    }: {
      productId: string;
      variantId: string;
      stock: number;
    }) => api.admin.updateStock(productId, variantId, stock),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: ['product'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminProductPayload) => api.admin.createProduct(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: FulfillmentStatus }) =>
      api.admin.updateOrderStatus(orderId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
};
