import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    // Lock body scroll on Android without causing layout shift
    const y = window.scrollY;
    document.body.style.position  = 'fixed';
    document.body.style.top       = `-${y}px`;
    document.body.style.width     = '100%';
    document.body.style.overflowY = 'scroll';
    return () => {
      document.body.style.position  = '';
      document.body.style.top       = '';
      document.body.style.width     = '';
      document.body.style.overflowY = '';
      window.scrollTo(0, y);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onPointerDown={e => { if (e.target === e.currentTarget) onClose(); }}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={panelRef}
        className="modal-panel slide-up"
        onPointerDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/8 sticky top-0 bg-dark-100 z-10 rounded-t-3xl">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="icon-btn"
            aria-label="Cerrar"
          >
            <X size={15} />
          </button>
        </div>
        {/* Body */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
