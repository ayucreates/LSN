import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { FilterState, ProductCategory, ProductSize, ProductColor } from '../types';

const ALL_CATEGORIES: ProductCategory[] = ['Women Western', 'Women Ethnic', 'Kids', 'Accessories', 'Festive Collection', 'Gifting'];
const ALL_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const ALL_COLORS: ProductColor[] = ['Red', 'Blue', 'Black', 'White', 'Green', 'Pink', 'Yellow', 'Navy', 'Maroon', 'Multicolor'];
const PRICE_MIN = 0;
const PRICE_MAX = 1500;

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
      active ? 'bg-gold-600 text-white border-gold-600' : 'bg-white text-gray-600 border-gold-200 hover:border-gold-500 hover:text-gold-700'
    }`}>{label}</button>
  );
}

export function Filters({ filters, onChange }: FiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCategory = (cat: ProductCategory) => {
    const next = filters.categories.includes(cat) ? filters.categories.filter((c) => c !== cat) : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  };
  const toggleSize = (size: ProductSize) => {
    const next = filters.sizes.includes(size) ? filters.sizes.filter((s) => s !== size) : [...filters.sizes, size];
    onChange({ ...filters, sizes: next });
  };
  const toggleColor = (color: ProductColor) => {
    const next = filters.colors.includes(color) ? filters.colors.filter((c) => c !== color) : [...filters.colors, color];
    onChange({ ...filters, colors: next });
  };
  const clearAll = () => onChange({ categories: [], sizes: [], colors: [], priceRange: [PRICE_MIN, PRICE_MAX], searchQuery: filters.searchQuery });

  const hasActiveFilters = filters.categories.length > 0 || filters.sizes.length > 0 || filters.colors.length > 0 ||
    filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX;

  const content = (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </h2>
        {hasActiveFilters && <button onClick={clearAll} className="text-xs text-gold-600 hover:text-gold-700 font-medium">Clear all</button>}
      </div>

      <div className="pb-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Category</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => <Toggle key={cat} label={cat} active={filters.categories.includes(cat)} onClick={() => toggleCategory(cat)} />)}
        </div>
      </div>

      <div className="pb-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Size</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => <Toggle key={size} label={size} active={filters.sizes.includes(size)} onClick={() => toggleSize(size)} />)}
        </div>
      </div>

      <div className="pb-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Color</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((color) => <Toggle key={color} label={color} active={filters.colors.includes(color)} onClick={() => toggleColor(color)} />)}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price Range</h3>
        <div className="space-y-2 px-1">
          <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={filters.priceRange[1]}
            onChange={(e) => onChange({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
            className="w-full accent-gold-600" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)}
        className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-white border border-gold-200 rounded px-2 py-1 hover:bg-gold-50">
        <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
        {hasActiveFilters && <span className="bg-gold-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {(filters.categories.length > 0 ? 1 : 0) + (filters.sizes.length > 0 ? 1 : 0) + (filters.colors.length > 0 ? 1 : 0) +
            (filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX ? 1 : 0)}
        </span>}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 sm:w-80 bg-white shadow-xl p-4 sm:p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Filters</h2>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
