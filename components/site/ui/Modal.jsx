'use client';
import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

/* Overlay dialog used by both the project and certificate cards.
   Locks page scroll and closes on Escape or backdrop click. */
export default function Modal({ open, onClose, children, label = 'Details' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        className="card relative my-auto w-full max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full border border-line bg-bg-1/90 text-ink transition-colors hover:border-accent-text hover:text-accent-text"
        >
          <FiX size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}
