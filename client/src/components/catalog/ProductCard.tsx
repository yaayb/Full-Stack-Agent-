import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { Product } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { isWishlisted, toggleWishlist } = useAuth();
  const saved = isWishlisted(product.id);

  const uniqueColors = useMemo(() => {
    const seen = new Map<string, string>();
    for (const v of product.variants) {
      if (!seen.has(v.color)) {
        seen.set(v.color, v.colorHex);
      }
    }
    return Array.from(seen.entries());
  }, [product.variants]);

  const totalStock = useMemo(
    () => product.variants.reduce((acc, v) => acc + v.stock, 0),
    [product.variants]
  );

  const primaryImage = product.images[0] || product.variants[0]?.imageUrl || '';
  const hoverImage = product.images[1] || primaryImage;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-light/40 dark:bg-white/5">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
          />
          <img
            src={hoverImage}
            alt={`${product.name} alternate view`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="px-2.5 py-1 text-[10px] uppercase tracking-editorial bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian font-medium">
              Atelier Edition
            </span>
          )}
          {totalStock === 0 && (
            <span className="px-2.5 py-1 text-[10px] uppercase tracking-editorial bg-red-600 text-white">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={() => void toggleWishlist(product.id)}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-alabaster/85 dark:bg-obsidian/85 backdrop-blur-sm border border-stone-light/50 dark:border-white/10 hover:border-gold transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              saved ? 'fill-gold text-gold' : 'text-obsidian dark:text-alabaster'
            }`}
          />
        </button>

        {/* Quick View Bar */}
        {onQuickView && (
          <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="w-full py-2.5 bg-alabaster/95 dark:bg-obsidian/95 backdrop-blur-md text-obsidian dark:text-alabaster text-[11px] uppercase tracking-editorial font-medium flex items-center justify-center gap-2 border border-stone-light/60 dark:border-white/15 hover:bg-gold hover:text-obsidian dark:hover:bg-gold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View & Swatches</span>
            </button>
          </div>
        )}
      </div>

      {/* Editorial Product Meta */}
      <div className="pt-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] uppercase tracking-luxury text-stone-muted mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1.5">
              {uniqueColors.map(([colorName, hex]) => (
                <span
                  key={colorName}
                  title={colorName}
                  className="w-2.5 h-2.5 rounded-full border border-stone-muted/40"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="font-serif text-lg leading-snug hover:text-gold transition-colors block"
          >
            {product.name}
          </Link>
        </div>

        <p className="mt-2 font-mono text-sm text-obsidian dark:text-alabaster">
          ${product.basePrice.toLocaleString()}
        </p>
      </div>
    </article>
  );
};
