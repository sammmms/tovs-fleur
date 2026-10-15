'use strict';
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

interface CustomDatePickerProps {
  value: string; // e.g. "15 Oktober 2026"
  onChange: (val: string) => void;
  label?: string;
  className?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  label,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial value or fallback to current date
  const parseIndonesianDate = (str: string): Date => {
    try {
      const parts = str.trim().split(' ');
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const monthIndex = INDONESIAN_MONTHS.indexOf(parts[1]);
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && monthIndex >= 0 && !isNaN(year)) {
          return new Date(year, monthIndex, day);
        }
      }
    } catch (e) {}
    return new Date();
  };

  const initialDate = parseIndonesianDate(value);
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  useEffect(() => {
    const d = parseIndonesianDate(value);
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateToString = (year: number, monthIndex: number, day: number) => {
    return `${day} ${INDONESIAN_MONTHS[monthIndex]} ${year}`;
  };

  const handleSelectDay = (day: number) => {
    const formatted = formatDateToString(currentYear, currentMonth, day);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleQuickPreset = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const formatted = formatDateToString(d.getFullYear(), d.getMonth(), d.getDate());
    onChange(formatted);
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Highlight selected day
  const selectedParsed = parseIndonesianDate(value);
  const isSelected = (day: number) => {
    return (
      selectedParsed.getDate() === day &&
      selectedParsed.getMonth() === currentMonth &&
      selectedParsed.getFullYear() === currentYear
    );
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
          {label}
        </label>
      )}

      {/* Date Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C3B1] bg-white text-left text-xs sm:text-sm font-medium text-[#2C1F17] hover:border-[#A85842] focus:outline-none focus:ring-2 focus:ring-[#A85842]/40 flex items-center justify-between gap-2 shadow-2xs transition-colors cursor-pointer"
      >
        <span className="font-medium text-[#2C1F17]">
          {value || 'Pilih Tanggal'}
        </span>
        <CalendarIcon className="w-4 h-4 text-[#A85842]" />
      </button>

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-72 sm:w-80 rounded-2xl bg-[#FAF6F0] border-2 border-[#D8C3B1] shadow-2xl p-4 animate-in fade-in-50 zoom-in-95">
          {/* Quick presets */}
          <div className="flex gap-1.5 pb-3 border-b border-[#EADBCE] text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickPreset(0)}
              className="flex-1 py-1 px-2 rounded-lg bg-white hover:bg-[#EADBCE] text-[#7A5239] font-medium border border-[#D8C3B1] text-center cursor-pointer transition-colors"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(-1)}
              className="flex-1 py-1 px-2 rounded-lg bg-white hover:bg-[#EADBCE] text-[#7A5239] font-medium border border-[#D8C3B1] text-center cursor-pointer transition-colors"
            >
              Kemarin
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset(1)}
              className="flex-1 py-1 px-2 rounded-lg bg-white hover:bg-[#EADBCE] text-[#7A5239] font-medium border border-[#D8C3B1] text-center cursor-pointer transition-colors"
            >
              Besok
            </button>
          </div>

          {/* Month & Year Navigation */}
          <div className="flex items-center justify-between py-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-[#EADBCE] text-[#7A5239] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-serif font-bold text-sm text-[#2C1F17]">
              {INDONESIAN_MONTHS[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-[#EADBCE] text-[#7A5239] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#7A5239] uppercase mb-1">
            {DAY_NAMES.map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {/* Days in month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const active = isSelected(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    active
                      ? 'bg-[#A85842] text-white shadow-xs scale-105'
                      : 'hover:bg-white text-[#2C1F17]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
