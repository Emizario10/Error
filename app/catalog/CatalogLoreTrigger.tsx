"use client";

import { useEffect } from 'react';
import { useSystemStore } from '@/store/useSystemStore';

/**
 * CATALOG_LORE_TRIGGER: Randomly injects system consciousness into the catalog.
 */
export default function CatalogLoreTrigger() {
  const { addMessage } = useSystemStore();

  useEffect(() => {
    const interval = setInterval(() => {
      addMessage("// SENSORS_DETECTING_CORPORATE_SNOOPING... Protocol: Stealth.", "SECURITY");
    }, 60000); // Every 60s

    return () => clearInterval(interval);
  }, [addMessage]);

  return null;
}
