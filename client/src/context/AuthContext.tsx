import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { api, UserProfile } from '../services/api';

type ThemeMode = 'light' | 'dark';

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  theme: ThemeMode;
  toggleTheme: () => void;
  wishlistIds: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (name: string, email: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_WISHLIST_KEY = 'av_wishlist_ids';
const LOCAL_THEME_KEY = 'av_theme_mode';

const readLocalWishlist = (): string[] => {
  try {
    const raw = localStorage.getItem(LOCAL_WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => readLocalWishlist());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(LOCAL_THEME_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(LOCAL_THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const syncWishlistFromServer = useCallback(async () => {
    try {
      const res = await api.wishlist.get();
      const merged = Array.from(new Set([...res.productIds, ...readLocalWishlist()]));
      setWishlistIds(merged);
      localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(merged));
    } catch {
      // Keep local storage wishlist if unauthenticated
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const initSession = async () => {
      try {
        const res = await api.auth.me();
        if (mounted) {
          setUser(res.user);
          if (res.user) {
            await syncWishlistFromServer();
          }
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    void initSession();
    return () => {
      mounted = false;
    };
  }, [syncWishlistFromServer]);

  const login = useCallback(
    async (email: string, password: string): Promise<UserProfile> => {
      const res = await api.auth.login({ email, password });
      setUser(res.user);
      await syncWishlistFromServer();
      setIsAuthModalOpen(false);
      return res.user;
    },
    [syncWishlistFromServer]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<UserProfile> => {
      const res = await api.auth.register({ name, email, password });
      setUser(res.user);
      await syncWishlistFromServer();
      setIsAuthModalOpen(false);
      return res.user;
    },
    [syncWishlistFromServer]
  );

  const logout = useCallback(async () => {
    await api.auth.logout();
    setUser(null);
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      // Optimistically update local wishlist state first
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        const updated = exists
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(updated));
        return updated;
      });

      if (user) {
        try {
          const res = await api.wishlist.toggle(productId);
          setWishlistIds(res.productIds);
          localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(res.productIds));
        } catch {
          // Keep optimistic local update if request fails
        }
      }
    },
    [user]
  );

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        theme,
        toggleTheme,
        wishlistIds,
        isWishlisted,
        toggleWishlist,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
