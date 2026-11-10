import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidthClass = 'max-w-2xl',
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-obsidian/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={`relative z-10 w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto bg-alabaster dark:bg-[#121212] text-obsidian dark:text-alabaster border border-stone-light/60 dark:border-white/10 shadow-2xl`}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-alabaster/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-stone-light/60 dark:border-white/10">
          <div>
            {subtitle && (
              <p className="text-[10px] uppercase tracking-editorial text-gold font-medium mb-0.5">
                {subtitle}
              </p>
            )}
            {title && (
              <h3 className="font-serif text-xl sm:text-2xl tracking-wide font-normal">
                {title}
              </h3>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-stone-muted hover:text-obsidian dark:hover:text-alabaster transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
