import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Sun,
  Moon,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Modal } from './Modal';

export const Navbar: React.FC = () => {
  const {
    user,
    theme,
    toggleTheme,
    wishlistIds,
    login,
    register,
    logout,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  } = useAuth();
  const { totalItems, openCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fillCredentials = (preset: 'admin' | 'client') => {
    setAuthMode('login');
    setAuthError(null);
    if (preset === 'admin') {
      setEmail('admin@ateliervanguard.com');
      setPassword('Admin123!');
    } else {
      setEmail('client@ateliervanguard.com');
      setPassword('Client123!');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 backdrop-blur-md ${
          isScrolled
            ? 'bg-alabaster/90 dark:bg-obsidian/90 border-b border-stone-light/70 dark:border-white/10 py-3.5 shadow-sm'
            : 'bg-alabaster/70 dark:bg-obsidian/70 border-b border-stone-light/40 dark:border-white/5 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Left Editorial Navigation */}
          <div className="flex items-center gap-6 lg:gap-8">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-1.5 text-obsidian dark:text-alabaster"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-luxury font-medium">
              <Link
                to="/catalog"
                className={`transition-colors hover:text-gold ${
                  location.pathname === '/catalog' && !location.search
                    ? 'text-gold'
                    : 'text-obsidian/80 dark:text-alabaster/80'
                }`}
              >
                Archive
              </Link>
              <Link
                to="/catalog?category=Outerwear"
                className="text-obsidian/80 dark:text-alabaster/80 hover:text-gold transition-colors"
              >
                Outerwear
              </Link>
              <Link
                to="/catalog?category=Tailored+Knitwear"
                className="text-obsidian/80 dark:text-alabaster/80 hover:text-gold transition-colors"
              >
                Knitwear
              </Link>
              <Link
                to="/catalog?category=Structured+Leather"
                className="text-obsidian/80 dark:text-alabaster/80 hover:text-gold transition-colors"
              >
                Leather
              </Link>
              <Link
                to="/catalog?category=Footwear"
                className="text-obsidian/80 dark:text-alabaster/80 hover:text-gold transition-colors"
              >
                Footwear
              </Link>
            </nav>
          </div>

          {/* Center Wordmark */}
          <Link
            to="/"
            className="font-serif text-xl sm:text-2xl tracking-editorial uppercase font-semibold text-obsidian dark:text-alabaster"
          >
            ATELIER VANGUARD
          </Link>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-3 sm:gap-5">
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-luxury bg-gold/15 text-gold border border-gold/40 hover:bg-gold hover:text-obsidian transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Atelier Admin</span>
              </Link>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 text-obsidian/80 dark:text-alabaster/80 hover:text-gold transition-colors"
              title={theme === 'dark' ? 'Switch to Alabaster Light' : 'Switch to Obsidian Dark'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-gold" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/catalog?wishlist=true')}
              className="relative p-2 text-obsidian/80 dark:text-alabaster/80 hover:text-gold transition-colors"
              title="Saved Wishlist"
              aria-label="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold text-obsidian text-[10px] font-mono font-semibold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-xs tracking-wide text-stone-muted">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={() => void logout()}
                  title="Sign Out"
                  className="p-2 text-obsidian/80 dark:text-alabaster/80 hover:text-gold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="flex items-center gap-1.5 p-2 text-xs uppercase tracking-luxury text-obsidian/80 dark:text-alabaster/80 hover:text-gold transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden md:inline">Account</span>
              </button>
            )}

            <button
              type="button"
              onClick={openCart}
              aria-label="Open shopping bag"
              className="relative flex items-center gap-2 pl-2 pr-1 py-1.5 text-obsidian dark:text-alabaster hover:text-gold transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-mono text-xs px-1.5 py-0.5 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian">
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-light/60 dark:border-white/10 bg-alabaster dark:bg-obsidian px-6 py-5 space-y-3 text-xs uppercase tracking-luxury">
            <Link
              to="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-gold"
            >
              Full Archive
            </Link>
            <Link
              to="/catalog?category=Outerwear"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-gold"
            >
              Outerwear
            </Link>
            <Link
              to="/catalog?category=Tailored+Knitwear"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-gold"
            >
              Tailored Knitwear
            </Link>
            <Link
              to="/catalog?category=Structured+Leather"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-gold"
            >
              Structured Leather
            </Link>
            <Link
              to="/catalog?category=Footwear"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-gold"
            >
              Footwear
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-gold font-semibold"
              >
                Atelier Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Authentication Modal */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        subtitle="Atelier Vanguard Private Client"
        title={authMode === 'login' ? 'Sign In to Your Archive' : 'Create Private Client Account'}
        maxWidthClass="max-w-md"
      >
        <form onSubmit={(e) => void handleAuthSubmit(e)} className="space-y-4">
          {authError && (
            <div className="p-3 text-xs border border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400">
              {authError}
            </div>
          )}

          {authMode === 'register' && (
            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Clara Vance"
                className="w-full px-3.5 py-2.5 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@ateliervanguard.com"
              className="w-full px-3.5 py-2.5 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-stone-muted mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-transparent border border-stone-light dark:border-white/20 focus:border-gold outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-obsidian text-alabaster dark:bg-alabaster dark:text-obsidian text-xs uppercase tracking-editorial font-medium hover:bg-gold hover:text-obsidian dark:hover:bg-gold transition-colors disabled:opacity-50"
          >
            {submitting
              ? 'Authenticating...'
              : authMode === 'login'
              ? 'Enter Atelier'
              : 'Register Client Profile'}
          </button>

          {/* Instant Demo Credentials Helper */}
          <div className="pt-3 border-t border-stone-light/60 dark:border-white/10">
            <p className="text-[11px] uppercase tracking-luxury text-stone-muted mb-2">
              Seeded Evaluation Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('client')}
                className="px-3 py-2 text-[11px] uppercase tracking-wider border border-stone-light dark:border-white/15 hover:border-gold text-left transition-colors"
              >
                <span className="block font-medium">Client Demo</span>
                <span className="text-[10px] text-stone-muted font-mono">client@atelier...</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="px-3 py-2 text-[11px] uppercase tracking-wider border border-gold/40 bg-gold/5 hover:border-gold text-left transition-colors"
              >
                <span className="block font-medium text-gold">Admin Director</span>
                <span className="text-[10px] text-stone-muted font-mono">admin@atelier...</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode((prev) => (prev === 'login' ? 'register' : 'login'));
                setAuthError(null);
              }}
              className="text-xs text-stone-muted hover:text-gold underline underline-offset-4"
            >
              {authMode === 'login'
                ? 'New to Atelier Vanguard? Create a Private Client profile'
                : 'Already registered? Sign in to your account'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
