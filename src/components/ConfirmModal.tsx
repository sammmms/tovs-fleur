'use strict';
'use client';

import React from 'react';
import { AlertTriangle, Copy, Trash2, LogOut, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  type?: 'delete' | 'duplicate' | 'logout';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  type = 'delete',
  title,
  message,
  confirmText,
  cancelText = 'Batal',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const isDelete = type === 'delete';
  const isDuplicate = type === 'duplicate';

  const defaultConfirmText = isDelete
    ? 'Ya, Hapus'
    : isDuplicate
    ? 'Ya, Duplikat'
    : 'Ya, Lanjutkan';

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#D8C3B1] flex flex-col text-center relative overflow-hidden">
        {/* Icon Badge */}
        <div className="mx-auto mb-3">
          {isDelete ? (
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
          ) : isDuplicate ? (
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Copy className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#EADBCE] text-[#7A5239] flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Title & Message */}
        <h3 className="font-serif font-bold text-lg text-[#2C1F17] mb-1">
          {title}
        </h3>
        <p className="text-xs text-[#7A5239] mb-6 whitespace-pre-line leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#D8C3B1] bg-white hover:bg-[#FAF6F0] text-xs font-semibold text-[#7A5239] transition-colors cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-sm transition-all cursor-pointer ${
              isDelete
                ? 'bg-rose-600 hover:bg-rose-700'
                : isDuplicate
                ? 'bg-[#7A5239] hover:bg-[#5C3D2E]'
                : 'bg-[#A85842] hover:bg-[#7A5239]'
            }`}
          >
            {confirmText || defaultConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
