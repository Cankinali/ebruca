'use client';

import { useState } from 'react';
import { FilterOptions } from '@/lib/types';

interface FilterPanelProps {
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  activeFilters: Partial<FilterOptions>;
}

const SIZES: { value: string; label: string; sub?: string }[] = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
  { value: '38/40', label: '38/40', sub: '1 BEDEN' },
  { value: '42/44', label: '42/44', sub: '2 BEDEN' },
  { value: '46/48', label: '46/48', sub: '3 BEDEN' },
  { value: '50/52', label: '50/52', sub: '4 BEDEN' },
  { value: '54/56', label: '54/56', sub: '5 BEDEN' },
];
const COLORS = ['Siyah', 'Beyaz', 'Ekru', 'Camel', 'Lacivert', 'Bordo', 'Haki', 'Pudra', 'Gri', 'Pembe'];

export default function FilterPanel({ onFilterChange, activeFilters }: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['fiyat', 'beden', 'renk'])
  );

  const toggle = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const toggleSize = (size: string) => {
    const current = activeFilters.sizes || [];
    const next = current.includes(size)
      ? current.filter(s => s !== size)
      : [...current, size];
    onFilterChange({ sizes: next });
  };

  const toggleColor = (color: string) => {
    const current = activeFilters.colors || [];
    const next = current.includes(color)
      ? current.filter(c => c !== color)
      : [...current, color];
    onFilterChange({ colors: next });
  };

  return (
    <div className="space-y-0">
      {/* Price */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggle('fiyat')}
          className="w-full flex items-center justify-between py-4 text-sm font-semibold tracking-wider uppercase"
        >
          Fiyat
          <svg
            className={`w-4 h-4 transition-transform ${expandedSections.has('fiyat') ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.has('fiyat') && (
          <div className="pb-4 space-y-3">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min TL"
                className="w-full border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-black"
                onChange={e =>
                  onFilterChange({
                    priceRange: [Number(e.target.value), activeFilters.priceRange?.[1] ?? 99999],
                  })
                }
              />
              <span className="text-gray-400 self-center">—</span>
              <input
                type="number"
                placeholder="Max TL"
                className="w-full border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-black"
                onChange={e =>
                  onFilterChange({
                    priceRange: [activeFilters.priceRange?.[0] ?? 0, Number(e.target.value)],
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Size */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggle('beden')}
          className="w-full flex items-center justify-between py-4 text-sm font-semibold tracking-wider uppercase"
        >
          Beden
          <svg
            className={`w-4 h-4 transition-transform ${expandedSections.has('beden') ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.has('beden') && (
          <div className="pb-4 flex flex-wrap gap-2">
            {SIZES.map(({ value, label, sub }) => (
              <button
                key={value}
                onClick={() => toggleSize(value)}
                className={`flex flex-col items-center px-3 py-1.5 text-xs border transition-colors leading-tight ${
                  activeFilters.sizes?.includes(value)
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span>{label}</span>
                {sub && <span className="opacity-70">{sub}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggle('renk')}
          className="w-full flex items-center justify-between py-4 text-sm font-semibold tracking-wider uppercase"
        >
          Renk
          <svg
            className={`w-4 h-4 transition-transform ${expandedSections.has('renk') ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.has('renk') && (
          <div className="pb-4 flex flex-wrap gap-2">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={`px-3 py-1.5 text-xs border transition-colors ${
                  activeFilters.colors?.includes(color)
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
