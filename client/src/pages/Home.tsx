import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Sparkles, Compass } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { Product, ProductVariant } from '../services/api';
import { ProductCard } from '../components/catalog/ProductCard';
import { Modal } from '../components/common/Modal';
import { VariantPicker } from '../components/catalog/VariantPicker';
import { useCart } from '../context/CartContext';

export const Home: React.FC = () => {
  const { data, isLoading } = useProducts({ featured: true, limit: 4 });
  const { addItem } = useCart();

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    const defaultVariant =
      product.variants.find((v) => v.stock > 0) || product.variants[0] || null;
    setSelectedVariant(defaultVariant);
  };

  return (
    <div className="space-y-24">
      {/* Architectural Hero Section */}
      <section className="relative min-h-[82vh] flex items-center bg-obsidian text-alabaster overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85"
          alt="Atelier Vanguard Serie IV Campaign"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/75 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-24">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs uppercase tracking-editorial text-gold font-mono">
              ARCHIVE SERIE IV — AUTUMN / WINTER
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-wide">
              Monolithic Form. Weightless Drape.
            </h1>
            <p className="text-sm sm:text-base text-alabaster/80 leading-relaxed max-w-xl">
              Engineered in our Paris and Milan studios from double-faced Inner Mongolian cashmere,
              high-twist Japanese gabardine, and full-grain Florentine box calfskin.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/catalog"
                className="px-8 py-4 bg-alabaster text-obsidian text-xs uppercase tracking-editorial font-medium inline-flex items-center gap-3 hover:bg-gold hover:text-obsidian transition-colors"
              >
                <span>Explore Full Archive</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/catalog?category=Outerwear"
                className="px-8 py-4 border border-alabaster/40 text-alabaster text-xs uppercase tracking-editorial hover:border-gold hover:text-gold transition-colors"
              >
                Outerwear Study
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Editions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-editorial text-gold mb-2">
              Curated Selection
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl">Signature Atelier Editions</h2>
          </div>
          <Link
            to="/catalog"
            className="text-xs uppercase tracking-luxury inline-flex items-center gap-2 hover:text-gold transition-colors"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-3 animate-pulse">
                <div className="aspect-[3/4] bg-stone-light/50 dark:bg-white/5" />
                <div className="h-4 bg-stone-light/50 dark:bg-white/5 w-2/3" />
                <div className="h-4 bg-stone-light/50 dark:bg-white/5 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data?.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={handleOpenQuickView}
              />
            ))}
          </div>
        )}
      </section>

      {/* Editorial Category Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/catalog?category=Structured+Leather"
            className="group relative aspect-[16/10] overflow-hidden bg-obsidian text-alabaster flex items-end p-8"
          >
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85"
              alt="Structured Leather Goods"
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-transparent" />
            <div className="relative z-10 space-y-2">
              <p className="text-[10px] uppercase tracking-editorial text-gold">
                Florentine Workshop
              </p>
              <h3 className="font-serif text-3xl">Structured Leather Vessels</h3>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury pt-1 group-hover:text-gold transition-colors">
                <span>Discover Objects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          <Link
            to="/catalog?category=Tailored+Knitwear"
            className="group relative aspect-[16/10] overflow-hidden bg-obsidian text-alabaster flex items-end p-8"
          >
            <img
              src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85"
              alt="Tailored Knitwear"
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-transparent" />
            <div className="relative z-10 space-y-2">
              <p className="text-[10px] uppercase tracking-editorial text-gold">
                17.5-Micron Merino & Mulberry Silk
              </p>
              <h3 className="font-serif text-3xl">Architectural Knitwear</h3>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury pt-1 group-hover:text-gold transition-colors">
                <span>Explore Knitwear</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* House Philosophy Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-stone-light/70 dark:border-white/10 py-14">
          <div className="space-y-2">
            <Compass className="w-5 h-5 text-gold mb-3" />
            <h4 className="font-serif text-xl">Architectural Patternmaking</h4>
            <p className="text-xs text-stone-muted leading-relaxed">
              Every silhouette is drafted from geometric proportion studies—balancing cantilevered
              shoulders with fluid, unlined internal construction.
            </p>
          </div>
          <div className="space-y-2">
            <Sparkles className="w-5 h-5 text-gold mb-3" />
            <h4 className="font-serif text-xl">Traceable Mill Provenance</h4>
            <p className="text-xs text-stone-muted leading-relaxed">
              We partner exclusively with family-owned Biella weavers, Inner Mongolian cashmere
              cooperatives, and vegetable-tanned Tuscan tanneries.
            </p>
          </div>
          <div className="space-y-2">
            <Shield className="w-5 h-5 text-gold mb-3" />
            <h4 className="font-serif text-xl">Lifetime Atelier Care</h4>
            <p className="text-xs text-stone-muted leading-relaxed">
              Each numbered garment includes complimentary re-pressing, horn button replacement,
              and leather edge re-lacquering at our Paris flagship.
            </p>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
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
