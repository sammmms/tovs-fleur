'use strict';
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Lock, User, KeyRound, X, Sparkles, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password.trim() === 'TovsFleur123') {
      localStorage.setItem('tovs_florist_auth', 'true');
      setError('');
      onLoginSuccess();
      onClose();
    } else {
      setError('Username atau password salah! (Gunakan admin / TovsFleur123)');
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 sm:p-7 shadow-2xl border border-[#D8C3B1] flex flex-col relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#FAF6F0] text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Logo & Lock icon */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D8C3B1] mx-auto mb-2 bg-[#FAF6F0] p-1 flex items-center justify-center shadow-xs">
            <Image
              src="/logo.png"
              alt="Tov's Fleur Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#2C1F17]">
            Masuk Akses Florist
          </h3>
          <p className="text-xs text-[#7A5239] mt-0.5">
            Akses khusus tim Tov’s Fleur untuk invoice & pencatatan pesanan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#7A5239] absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A85842]"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B4E3D] mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#7A5239] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8C3B1] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A85842]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#7A5239] hover:bg-[#5C3D2E] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Buka Akses Admin</span>
          </button>
        </form>
      </div>
    </div>
  );
};
