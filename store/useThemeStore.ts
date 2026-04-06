"use client";

import { create } from 'zustand';

interface ThemeState {
  color: string;
  setColor: (newColor: string) => void;
}

/**
 * USE_THEME_STORE: Manages the dynamic tactical accent color.
 * Directly injects the color into CSS variables for real-time UI updates.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  color: '#CCFF00', // Default Acid Green
  setColor: (newColor: string) => {
    set({ color: newColor });
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--tactical-color', newColor);
    }
  },
}));
