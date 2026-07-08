import { X, ShoppingBag } from 'lucide-react';

interface ImageLightboxProps {
  onClose: () => void;
}

export function ImageLightbox({ onClose }: ImageLightboxProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10">
        <X className="w-6 h-6" />
      </button>
      <div className="w-full max-w-2xl mx-4 aspect-[4/5] bg-gradient-to-br from-gold-100 to-gold-200 rounded-lg flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <ShoppingBag className="w-32 h-32 text-gold-400" />
      </div>
    </div>
  );
}
