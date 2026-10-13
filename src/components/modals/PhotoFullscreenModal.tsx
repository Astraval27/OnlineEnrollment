import React, { useEffect } from 'react';
import { X, Maximize2 } from 'lucide-react';

interface PhotoFullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt?: string;
  title?: string;
}

export const PhotoFullscreenModal: React.FC<PhotoFullscreenModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageAlt = 'Fullscreen Photo Display',
  title = 'DepEd E-Enroll Registration & Admissions Desk',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="photo-fullscreen-modal"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl w-full max-h-[95vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between pb-3 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-neutral-200">
              {title}
            </span>
          </div>

          <button
            id="btn-close-fullscreen"
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative w-full overflow-hidden rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl flex items-center justify-center">
          <img
            src={imageSrc}
            alt={imageAlt}
            referrerPolicy="no-referrer"
            className="w-full max-h-[82vh] object-contain select-none"
          />
        </div>
      </div>
    </div>
  );
};
