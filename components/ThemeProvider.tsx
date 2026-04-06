"use client";

import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

/**
 * THEME_PROVIDER: Client-side system initializer.
 * Syncs the saved vault color with the global CSS state.
 */
export default function ThemeProvider({ initialColor }: { initialColor: string }) {
  const setColor = useThemeStore((state) => state.setColor);

  useEffect(() => {
    if (initialColor) {
      setColor(initialColor);
    }
  }, [initialColor, setColor]);

  return null; // Side-effect component
}
