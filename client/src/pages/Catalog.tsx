import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Product, ProductVariant } from '../services/api';
import { ProductCard } from '../components/catalog/ProductCard';
import {
  ProductFilters,
  CatalogFilterState,
} from '../components/catalog/ProductFilters';
import { VariantPicker } from '../components/catalog/VariantPicker';
import { Modal } from '../components/common/Modal';

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlistIds } = useAuth();
  const { addItem } = useCart();

  const filters: CatalogFilterState = useMemo(() => {
    const sortParam = searchParams.get('sort');
    const resolvedSort: CatalogFilterState['sort'] =
      sortParam === 'price_asc' || sortParam === 'price_desc' ? sortParam : 'newest';

    return {
      category: searchParams.get('category') || 'ALL',
      size: searchParams.get('size') || 'ALL',
      priceMax: Number(searchParams.get('price_max')) || 2500,
      sort: resolvedSort,
      onlyWishlist: searchParams.get('wishlist') === 'true',
    };
  }, [searchParams]);

  const { data, isLoading } = useProducts({
    category: filters.category !== 'ALL' ? filters.category : undefined,
    size: filters.size !== 'ALL' ? filters.size : undefined,
    price_max: filters.priceMax < 2500 ? filters.priceMax : undefined,
    sort: filters.sort,
    limit: 24,
  });

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const handleFilterChange = (updated: Partial<CatalogFilterState>) => {
    const next = { ...filters, ...updated };
    const nextParams = new URLSearchParams();
    if (next.category !== 'ALL') nextParams.set('category', next.category);
    if (next.size !== 'ALL') nextParams.set('size', next.size);
    if (next.priceMax < 2500) nextParams.set('price_max', String(next.priceMax));
    if (next.sort !== 'newest') nextParams.set('sort', next.sort);
    if (next.onlyWishlist) nextParams.set('wishlist', 'true');
    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const displayedProducts = useMemo(() => {
    const list = data?.products || [];
    if (!filters.onlyWishlist) return list;
    return list.filter((p) => wishlistIds.includes(p.id));
  }, [data?.products, filters.onlyWishlist, wishlistIds]);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    const firstAvailable =
      product.variants.find((v) => v.stock > 0) || product.variants[0] || null;
    setSelectedVariant(firstAvailable);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {/* Editorial Header */}
      <div className="mb-8 space-y-2">
        <p className="text-xs uppercase tracking-editorial text-gold">
          Atelier Vanguard — Serie IV
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal">
          {filters.onlyWishlist
            ? 'Saved Private Client Archive'
            : filters.category === 'ALL'
            ? 'Complete Ready-to-Wear & Objects'
            : filters.category}
        </h1>
      </div>

      {/* Interactive Filter Bar */}
      <ProductFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={displayedProducts.length}
      />

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="space-y-3 animate-pulse">
              <div className="aspect-[3/4] bg-stone-light/50 dark:bg-white/5" />
              <div className="h-4 bg-stone-light/50 dark:bg-white/5 w-2/3" />
              <div className="h-4 bg-stone-light/50 dark:bg-white/5 w-1/3" />
            </div>
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="py-20 text-center border border-stone-light/60 dark:border-white/10 space-y-4">
          <h3 className="font-serif text-2xl">No Archive Pieces Match Your Filter Criteria</h3>
          <p className="text-xs text-stone-muted max-w-md mx-auto">
            Try clearing your size or price constraints to view all available editions in Serie IV.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-6 py-3 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial hover:bg-gold hover:text-obsidian transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={handleOpenQuickView}
            />
          ))}
        </div>
      )}

      {/* Quick-View & Live Swatch Modal */}
      {quickViewProduct && selectedVariant && (
        <Modal
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
          subtitle={quickViewProduct.category}
          title={quickViewProduct.name}
          maxWidthClass="max-w-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[3/4] bg-stone-light/30 overflow-hidden">
              <img
                src={selectedVariant.imageUrl || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="font-mono text-2xl">
                  ${(selectedVariant.price ?? quickViewProduct.basePrice).toLocaleString()}
                </p>
                <p className="text-xs text-stone-muted leading-relaxed">
                  {quickViewProduct.description}
                </p>

                <VariantPicker
                  variants={quickViewProduct.variants}
                  selectedVariant={selectedVariant}
                  onSelectVariant={setSelectedVariant}
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-light/50 dark:border-white/10">
                <button
                  type="button"
                  disabled={selectedVariant.stock <= 0}
                  onClick={() => {
                    addItem(quickViewProduct, selectedVariant, 1);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-3.5 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial font-medium hover:bg-gold hover:text-obsidian dark:hover:bg-gold transition-colors disabled:opacity-40"
                >
                  {selectedVariant.stock <= 0 ? 'Out of Stock' : 'Add to Atelier Bag'}
                </button>
                <Link
                  to={`/products/${quickViewProduct.slug}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="block text-center text-xs uppercase tracking-luxury text-stone-muted hover:text-gold py-1"
                >
                  View Full Editorial Dossier →
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
