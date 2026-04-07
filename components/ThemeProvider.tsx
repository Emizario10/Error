"use client";

import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
  initialColor: string;
}

/**
 * THEME_PROVIDER: The Injector
 * Synchronizes the server-side profile color with the client-side Zustand store.
 * Optimized to prevent infinite update loops.
 */
export default function ThemeProvider({ children, initialColor }: ThemeProviderProps) {
  const { setColor } = useThemeStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialColor) {
      setColor(initialColor);
      initialized.current = true;
    }
  }, [initialColor, setColor]);

  return <>{children}</>;
}
