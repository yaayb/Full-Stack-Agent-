import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Ruler, ShieldCheck } from 'lucide-react';
import { useProductDetail } from '../hooks/useProducts';
import { ProductVariant } from '../services/api';
import { VariantPicker } from '../components/catalog/VariantPicker';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useProductDetail(slug);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useAuth();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');

  const product = data?.product;

  useEffect(() => {
    if (product && product.variants.length > 0) {
      const initial =
        product.variants.find((v) => v.stock > 0) || product.variants[0];
      setSelectedVariant(initial);
      setActiveImage(initial.imageUrl || product.images[0] || '');
    }
  }, [product]);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    if (variant.imageUrl) {
      setActiveImage(variant.imageUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-[3/4] bg-stone-light/50 dark:bg-white/5" />
        <div className="space-y-6">
          <div className="h-8 bg-stone-light/50 dark:bg-white/5 w-3/4" />
          <div className="h-6 bg-stone-light/50 dark:bg-white/5 w-1/4" />
          <div className="h-32 bg-stone-light/50 dark:bg-white/5" />
        </div>
      </div>
    );
  }

  if (error || !product || !selectedVariant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl">Archive Piece Not Found</h2>
        <p className="text-xs text-stone-muted">
          The requested garment could not be located in Serie IV.
        </p>
        <Link
          to="/catalog"
          className="inline-block px-6 py-3 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial"
        >
          Return to Archive
        </Link>
      </div>
    );
  }

  const saved = isWishlisted(product.id);
  const resolvedPrice = selectedVariant.price ?? product.basePrice;
  const allGalleryImages = Array.from(
    new Set([selectedVariant.imageUrl, ...product.images].filter(Boolean))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-stone-muted hover:text-gold mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Archive</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Image Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:w-20 shrink-0">
            {allGalleryImages.map((imgUrl, idx) => (
              <button
                key={`${imgUrl}-${idx}`}
                type="button"
                onClick={() => setActiveImage(imgUrl)}
                className={`aspect-[3/4] w-16 sm:w-20 border overflow-hidden transition-all ${
                  activeImage === imgUrl
                    ? 'border-gold ring-1 ring-gold'
                    : 'border-stone-light/60 dark:border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="flex-1 aspect-[3/4] bg-stone-light/30 dark:bg-white/5 overflow-hidden">
            <img
              src={activeImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>
        </div>

        {/* Right Editorial Details & Swatch Matrix (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-editorial text-gold mb-2">
                {product.category}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
                {product.name}
              </h1>
              <p className="mt-3 font-mono text-2xl">
                ${resolvedPrice.toLocaleString()}
              </p>
            </div>

            <p className="text-sm text-obsidian/80 dark:text-alabaster/80 leading-relaxed">
              {product.description}
            </p>

            {/* Live Variant Swatch & Size Matrix */}
            <div className="pt-4 border-t border-stone-light/60 dark:border-white/10">
              <VariantPicker
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelectVariant={handleVariantChange}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                disabled={selectedVariant.stock <= 0}
                onClick={() => addItem(product, selectedVariant, 1)}
                className="flex-1 py-4 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial font-medium inline-flex items-center justify-center gap-2.5 hover:bg-gold hover:text-obsidian dark:hover:bg-gold transition-colors disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {selectedVariant.stock <= 0
                    ? 'Variant Sold Out'
                    : `Add to Atelier Bag — $${resolvedPrice.toLocaleString()}`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => void toggleWishlist(product.id)}
                aria-label="Toggle wishlist"
                className={`px-4 border transition-colors flex items-center justify-center ${
                  saved
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-stone-light dark:border-white/20 hover:border-gold'
                }`}
              >
                <Heart className={`w-5 h-5 ${saved ? 'fill-gold text-gold' : ''}`} />
              </button>
            </div>

            {/* Sizing & Materiality Notes */}
            <div className="pt-6 border-t border-stone-light/60 dark:border-white/10 space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Ruler className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="uppercase tracking-luxury font-medium mb-1">
                    Architectural Fit & Sizing Notes
                  </p>
                  <p className="text-stone-muted leading-relaxed">{product.sizingNotes}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="uppercase tracking-luxury font-medium mb-1">
                    Provenance & Dispatch
                  </p>
                  <p className="text-stone-muted leading-relaxed">
                    Dispatched in an archival garment case from Paris within 24 hours. Complimentary
                    insured courier on orders over $250.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
