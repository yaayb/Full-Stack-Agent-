import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Package,
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Check,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  useAdminOrders,
  useProducts,
  useUpdateStockMutation,
  useCreateProductMutation,
  useUpdateOrderStatusMutation,
} from '../hooks/useProducts';
import {
  CreateAdminProductPayload,
  FulfillmentStatus,
  VariantSize,
} from '../services/api';
import { Modal } from '../components/common/Modal';

interface DraftVariant {
  sku: string;
  size: VariantSize;
  color: string;
  colorHex: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export const AdminDashboard: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const { data: adminData, isLoading: ordersLoading } = useAdminOrders(isAdmin);
  const { data: catalogData, isLoading: productsLoading } = useProducts({ limit: 50 });

  const updateStockMutation = useUpdateStockMutation();
  const createProductMutation = useCreateProductMutation();
  const updateOrderStatusMutation = useUpdateOrderStatusMutation();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [stockDrafts, setStockDrafts] = useState<Record<string, number>>({});
  const [savedVariantId, setSavedVariantId] = useState<string | null>(null);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Outerwear');
  const [newBasePrice, setNewBasePrice] = useState(1250);
  const [newFeatured, setNewFeatured] = useState(true);
  const [newDescription, setNewDescription] = useState('');
  const [newSizingNotes, setNewSizingNotes] = useState(
    'Tailored architectural fit. Take your normal size.'
  );
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85'
  );
  const [draftVariants, setDraftVariants] = useState<DraftVariant[]>([
    {
      sku: 'AV-NEW-010-OBS-S',
      size: 'S',
      color: 'Obsidian',
      colorHex: '#0B0B0B',
      price: 1250,
      stock: 8,
      imageUrl:
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85',
    },
    {
      sku: 'AV-NEW-010-OBS-M',
      size: 'M',
      color: 'Obsidian',
      colorHex: '#0B0B0B',
      price: 1250,
      stock: 10,
      imageUrl:
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85',
    },
  ]);
  const [createError, setCreateError] = useState<string | null>(null);

  // Role-Guard Check
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
        <ShieldAlert className="w-12 h-12 text-gold mx-auto" />
        <h1 className="font-serif text-3xl">Atelier Director Access Required</h1>
        <p className="text-xs text-stone-muted leading-relaxed">
          This command console is restricted to authenticated Atelier Vanguard administrators (
          <span className="font-mono text-obsidian dark:text-alabaster">
            admin@ateliervanguard.com
          </span>
          ).
        </p>
        <button
          type="button"
          onClick={openAuthModal}
          className="px-8 py-3.5 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial hover:bg-gold hover:text-obsidian transition-colors"
        >
          Sign In as Administrator
        </button>
      </div>
    );
  }

  const handleStockSave = async (productId: string, variantId: string, currentStock: number) => {
    const nextStock = stockDrafts[variantId] ?? currentStock;
    await updateStockMutation.mutateAsync({
      productId,
      variantId,
      stock: Math.max(0, nextStock),
    });
    setSavedVariantId(variantId);
    setTimeout(() => {
      setSavedVariantId((prev) => (prev === variantId ? null : prev));
    }, 1800);
  };

  const handleAddVariantRow = () => {
    const suffix = draftVariants.length + 1;
    setDraftVariants((prev) => [
      ...prev,
      {
        sku: `AV-NEW-010-V${suffix}`,
        size: 'L',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        price: newBasePrice,
        stock: 5,
        imageUrl: newImageUrl,
      },
    ]);
  };

  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    try {
      const payload: CreateAdminProductPayload = {
        name: newName,
        category: newCategory,
        basePrice: Number(newBasePrice),
        featured: newFeatured,
        description: newDescription,
        sizingNotes: newSizingNotes,
        images: [newImageUrl],
        variants: draftVariants.map((v) => ({
          ...v,
          price: Number(v.price),
          stock: Number(v.stock),
        })),
      };
      await createProductMutation.mutateAsync(payload);
      setIsAddModalOpen(false);
      setNewName('');
      setNewDescription('');
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  const metrics = adminData?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: catalogData?.products.length || 0,
    lowStockCount: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      {/* Header & Add Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-light/70 dark:border-white/10 pb-6">
        <div>
          <p className="text-xs uppercase tracking-editorial text-gold mb-1">
            Director Command Console
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl">
            Atelier Operations & SKU Inventory
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial font-medium inline-flex items-center gap-2 hover:bg-gold hover:text-obsidian dark:hover:bg-gold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Archive Piece</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 border border-stone-light/70 dark:border-white/10 bg-stone-light/10 dark:bg-white/5">
          <div className="flex items-center justify-between text-stone-muted mb-3">
            <span className="text-[11px] uppercase tracking-luxury">Gross Settled Revenue</span>
            <DollarSign className="w-4 h-4 text-gold" />
          </div>
          <p className="font-mono text-2xl font-semibold">
            ${metrics.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="p-6 border border-stone-light/70 dark:border-white/10 bg-stone-light/10 dark:bg-white/5">
          <div className="flex items-center justify-between text-stone-muted mb-3">
            <span className="text-[11px] uppercase tracking-luxury">Client Orders</span>
            <ShoppingBag className="w-4 h-4 text-gold" />
          </div>
          <p className="font-mono text-2xl font-semibold">{metrics.totalOrders}</p>
        </div>

        <div className="p-6 border border-stone-light/70 dark:border-white/10 bg-stone-light/10 dark:bg-white/5">
          <div className="flex items-center justify-between text-stone-muted mb-3">
            <span className="text-[11px] uppercase tracking-luxury">Active Archive Pieces</span>
            <Package className="w-4 h-4 text-gold" />
          </div>
          <p className="font-mono text-2xl font-semibold">{metrics.totalProducts}</p>
        </div>

        <div className="p-6 border border-stone-light/70 dark:border-white/10 bg-stone-light/10 dark:bg-white/5">
          <div className="flex items-center justify-between text-stone-muted mb-3">
            <span className="text-[11px] uppercase tracking-luxury">Low / Zero Stock SKUs</span>
            <AlertTriangle className="w-4 h-4 text-gold" />
          </div>
          <p className="font-mono text-2xl font-semibold text-gold">{metrics.lowStockCount}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-3 border-b border-stone-light/70 dark:border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 text-xs uppercase tracking-editorial border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-gold text-gold font-semibold'
              : 'border-transparent text-stone-muted hover:text-obsidian dark:hover:text-alabaster'
          }`}
        >
          Order Fulfillment ({adminData?.orders.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`px-6 py-3 text-xs uppercase tracking-editorial border-b-2 transition-colors ${
            activeTab === 'inventory'
              ? 'border-gold text-gold font-semibold'
              : 'border-transparent text-stone-muted hover:text-obsidian dark:hover:text-alabaster'
          }`}
        >
          Inline SKU Stock Editor
        </button>
      </div>

      {/* Tab 1: Order Fulfillment Table */}
      {activeTab === 'orders' && (
        <div className="border border-stone-light/70 dark:border-white/10 overflow-x-auto">
          {ordersLoading ? (
            <div className="p-12 text-center text-xs text-stone-muted">
              Loading client order dossiers...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-light/70 dark:border-white/10 bg-stone-light/20 dark:bg-white/5 text-[10px] uppercase tracking-editorial text-stone-muted">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Client & Destination</th>
                  <th className="py-3.5 px-4">Line Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-light/50 dark:divide-white/10">
                {adminData?.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-light/10 dark:hover:bg-white/5">
                    <td className="py-4 px-4 font-mono text-[11px] text-gold">{order.id}</td>
                    <td className="py-4 px-4">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-stone-muted">{order.customerEmail}</p>
                      <p className="text-stone-muted text-[11px]">
                        {order.shippingCity}, {order.shippingCountry}
                      </p>
                    </td>
                    <td className="py-4 px-4 space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="font-mono text-[11px]">
                          {item.sku} ({item.size}) × {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="py-4 px-4 font-mono font-medium">
                      ${order.finalTotal.toLocaleString()}
                      {order.promoCodeApplied && (
                        <span className="block text-[10px] text-gold">
                          {order.promoCodeApplied}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          void updateOrderStatusMutation.mutateAsync({
                            orderId: order.id,
                            status: e.target.value as FulfillmentStatus,
                          })
                        }
                        className="px-3 py-1.5 font-mono text-xs bg-alabaster dark:bg-obsidian border border-stone-light dark:border-white/20 focus:border-gold outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab 2: Inline SKU Stock Editor */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {productsLoading ? (
            <div className="p-12 text-center text-xs text-stone-muted">
              Loading SKU matrix...
            </div>
          ) : (
            catalogData?.products.map((product) => (
              <div
                key={product.id}
                className="border border-stone-light/70 dark:border-white/10 p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-light/50 dark:border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-editorial text-gold">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-xl">{product.name}</h3>
                  </div>
                  <span className="font-mono text-xs text-stone-muted">
                    Base Price: ${product.basePrice.toLocaleString()}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-luxury text-stone-muted border-b border-stone-light/40 dark:border-white/10">
                        <th className="py-2 pr-4">SKU</th>
                        <th className="py-2 px-4">Colorway</th>
                        <th className="py-2 px-4">Size</th>
                        <th className="py-2 px-4">Unit Price</th>
                        <th className="py-2 px-4">Inventory Count</th>
                        <th className="py-2 pl-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-light/30 dark:divide-white/5">
                      {product.variants.map((variant) => {
                        const draftVal = stockDrafts[variant.id] ?? variant.stock;
                        const isSaved = savedVariantId === variant.id;
                        return (
                          <tr key={variant.id}>
                            <td className="py-2.5 pr-4 font-mono">{variant.sku}</td>
                            <td className="py-2.5 px-4">
                              <span className="inline-flex items-center gap-2">
                                <span
                                  className="w-3 h-3 rounded-full border border-black/20"
                                  style={{ backgroundColor: variant.colorHex }}
                                />
                                {variant.color}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-mono">{variant.size}</td>
                            <td className="py-2.5 px-4 font-mono">
                              ${(variant.price ?? product.basePrice).toLocaleString()}
                            </td>
                            <td className="py-2.5 px-4">
                              <input
                                type="number"
                                min={0}
                                value={draftVal}
                                onChange={(e) =>
                                  setStockDrafts((prev) => ({
                                    ...prev,
                                    [variant.id]: Math.max(0, Number(e.target.value)),
                                  }))
                                }
                                className="w-20 px-2.5 py-1 font-mono text-xs bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
                              />
                            </td>
                            <td className="py-2.5 pl-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  void handleStockSave(product.id, variant.id, variant.stock)
                                }
                                className="px-3 py-1 text-[11px] uppercase tracking-luxury border border-stone-light dark:border-white/20 hover:border-gold hover:text-gold inline-flex items-center gap-1 transition-colors"
                              >
                                {isSaved ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-500" />
                                    <span className="text-emerald-500">Updated</span>
                                  </>
                                ) : (
                                  <span>Update SKU</span>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Multi-Variant "Add Product" Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        subtitle="Catalog Architecture"
        title="Register New Multi-Variant Archive Piece"
        maxWidthClass="max-w-3xl"
      >
        <form onSubmit={(e) => void handleCreateProductSubmit(e)} className="space-y-5">
          {createError && (
            <div className="p-3 text-xs border border-red-500/40 bg-red-500/10 text-red-500">
              {createError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1">
                Garment / Object Title *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Atelier Sculpted Cashmere Cape"
                className="w-full px-3.5 py-2.5 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1">
                Category *
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-alabaster dark:bg-obsidian border border-stone-light dark:border-white/20 focus:border-gold outline-none"
              >
                <option value="Outerwear">Outerwear</option>
                <option value="Tailored Knitwear">Tailored Knitwear</option>
                <option value="Structured Leather">Structured Leather</option>
                <option value="Footwear">Footwear</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1">
                Base Price (USD) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={newBasePrice}
                onChange={(e) => setNewBasePrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1">
                Primary Gallery Image URL *
              </label>
              <input
                type="url"
                required
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1">
                Editorial Description *
              </label>
              <textarea
                rows={3}
                required
                minLength={10}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Hand-finished from double-faced cashmere with raw architectural seams..."
                className="w-full px-3.5 py-2 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1">
                Sizing Notes
              </label>
              <input
                type="text"
                value={newSizingNotes}
                onChange={(e) => setNewSizingNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={newFeatured}
                  onChange={(e) => setNewFeatured(e.target.checked)}
                  className="accent-[#C5A46D]"
                />
                <span className="uppercase tracking-luxury">
                  Feature in Signature Atelier Editions
                </span>
              </label>
            </div>
          </div>

          {/* Multi-Variant Matrix Builder */}
          <div className="space-y-3 pt-4 border-t border-stone-light/60 dark:border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-luxury font-medium">
                SKU Variants ({draftVariants.length})
              </span>
              <button
                type="button"
                onClick={handleAddVariantRow}
                className="px-3 py-1 text-[11px] uppercase tracking-luxury border border-gold text-gold hover:bg-gold hover:text-obsidian transition-colors"
              >
                + Add Variant Row
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {draftVariants.map((v, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center p-2.5 border border-stone-light/60 dark:border-white/10 text-xs"
                >
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => {
                      const copy = [...draftVariants];
                      copy[idx] = { ...v, sku: e.target.value };
                      setDraftVariants(copy);
                    }}
                    placeholder="SKU"
                    className="col-span-3 px-2 py-1.5 font-mono bg-transparent border border-stone-light dark:border-white/20"
                  />
                  <select
                    value={v.size}
                    onChange={(e) => {
                      const copy = [...draftVariants];
                      copy[idx] = { ...v, size: e.target.value as VariantSize };
                      setDraftVariants(copy);
                    }}
                    className="col-span-2 px-2 py-1.5 font-mono bg-alabaster dark:bg-obsidian border border-stone-light dark:border-white/20"
                  >
                    {(['XS', 'S', 'M', 'L', 'XL'] as VariantSize[]).map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={v.color}
                    onChange={(e) => {
                      const copy = [...draftVariants];
                      copy[idx] = { ...v, color: e.target.value };
                      setDraftVariants(copy);
                    }}
                    placeholder="Color"
                    className="col-span-3 px-2 py-1.5 bg-transparent border border-stone-light dark:border-white/20"
                  />
                  <input
                    type="color"
                    value={v.colorHex}
                    onChange={(e) => {
                      const copy = [...draftVariants];
                      copy[idx] = { ...v, colorHex: e.target.value };
                      setDraftVariants(copy);
                    }}
                    className="col-span-1 h-7 w-full bg-transparent cursor-pointer"
                  />
                  <input
                    type="number"
                    min={0}
                    value={v.stock}
                    onChange={(e) => {
                      const copy = [...draftVariants];
                      copy[idx] = { ...v, stock: Number(e.target.value) };
                      setDraftVariants(copy);
                    }}
                    placeholder="Stock"
                    className="col-span-2 px-2 py-1.5 font-mono bg-transparent border border-stone-light dark:border-white/20"
                  />
                  <button
                    type="button"
                    disabled={draftVariants.length <= 1}
                    onClick={() =>
                      setDraftVariants((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="col-span-1 flex justify-center text-stone-muted hover:text-red-500 disabled:opacity-20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-2.5 text-xs uppercase tracking-luxury border border-stone-light dark:border-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProductMutation.isPending}
              className="px-8 py-2.5 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial font-medium hover:bg-gold hover:text-obsidian transition-colors"
            >
              {createProductMutation.isPending
                ? 'Publishing Piece...'
                : 'Publish to Catalog'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
