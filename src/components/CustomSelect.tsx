'use strict';
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  label?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Pilih salah satu...',
  className = '',
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
          {label}
        </label>
      )}

      {/* Select Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C3B1] bg-white text-left text-xs sm:text-sm font-medium text-[#2C1F17] hover:border-[#A85842] focus:outline-none focus:ring-2 focus:ring-[#A85842]/40 flex items-center justify-between gap-2 shadow-2xs transition-colors cursor-pointer"
      >
        <span className={selectedOption ? 'text-[#2C1F17]' : 'text-zinc-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#7A5239] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#A85842]' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-2xl bg-white border border-[#D8C3B1] shadow-xl py-1.5 max-h-60 overflow-y-auto animate-in fade-in-50 zoom-in-95">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-left text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF6F0] text-[#A85842] font-bold'
                    : 'text-[#4A3528] hover:bg-[#F5ECE1]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="truncate">{option.label}</span>
                  {option.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#EADBCE]/60 text-[#7A5239] font-normal shrink-0">
                      {option.badge}
                    </span>
                  )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#A85842] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
