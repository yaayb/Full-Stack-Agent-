import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-light/70 dark:border-white/10 bg-alabaster dark:bg-obsidian text-obsidian dark:text-alabaster mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2 space-y-4">
          <p className="font-serif text-2xl tracking-editorial uppercase">ATELIER VANGUARD</p>
          <p className="text-sm text-stone-muted max-w-md leading-relaxed">
            Architectural minimalism and uncompromising material integrity. Designed between Paris
            and Milan, crafted in small-batch numbered editions from traceable natural fibers.
          </p>
          <p className="text-xs font-mono text-gold uppercase tracking-luxury">
            Complimentary Express Courier on Orders Over $250
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-editorial text-stone-muted font-medium">
            Collections
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/catalog?category=Outerwear" className="hover:text-gold transition-colors">
                Architectural Outerwear
              </Link>
            </li>
            <li>
              <Link
                to="/catalog?category=Tailored+Knitwear"
                className="hover:text-gold transition-colors"
              >
                Tailored Knitwear
              </Link>
            </li>
            <li>
              <Link
                to="/catalog?category=Structured+Leather"
                className="hover:text-gold transition-colors"
              >
                Structured Leather Goods
              </Link>
            </li>
            <li>
              <Link to="/catalog?category=Footwear" className="hover:text-gold transition-colors">
                Goodyear-Welted Footwear
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-editorial text-stone-muted font-medium">
            Client Services
          </h4>
          <ul className="space-y-2 text-sm text-stone-muted">
            <li>Private Client Appointments</li>
            <li>Garment Care & Restoration</li>
            <li>Promo Privilege: VANGUARD10 / ATELIER50</li>
            <li>24 Rue du Faubourg Saint-Honoré, Paris</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-light/50 dark:border-white/5 py-6 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-stone-muted gap-4">
        <p>© {new Date().getFullYear()} ATELIER VANGUARD. All rights reserved.</p>
        <p className="font-mono text-[11px]">EDITION ARCHIVE — SERIE IV</p>
      </div>
    </footer>
  );
};
