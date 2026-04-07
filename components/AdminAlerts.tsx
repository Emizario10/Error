"use client";

import React, { useEffect, useRef } from 'react';
import { useSystemStore } from '@/store/useSystemStore';
import { AlertTriangle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  heatLevel: number;
  stock: number;
}

interface AdminAlertsProps {
  products: Product[];
}

/**
 * ADMIN_ALERTS: Tactical Intelligence Processor.
 * Automatically identifies market volatility and hardware shortages.
 */
export default function AdminAlerts({ products }: AdminAlertsProps) {
  const { addMessage } = useSystemStore();
  const alertedNodes = useRef<Set<string>>(new Set());

  useEffect(() => {
    products.forEach((p) => {
      // Logic: Heat > 4 or Stock < 2 triggers critical warning
      const isHighHeat = p.heatLevel > 4;
      const isLowStock = p.stock < 2;

      if (isHighHeat && !alertedNodes.current.has(`${p.id}-heat`)) {
        addMessage(`[!] WARNING: HIGH_MARKET_VOLATILITY detected in hardware node ${p.name.toUpperCase()}.`, "SECURITY");
        alertedNodes.current.add(`${p.id}-heat`);
      }

      if (isLowStock && !alertedNodes.current.has(`${p.id}-stock`)) {
        addMessage(`[!] ALERT: CRITICAL_HARDWARE_DEPLETION in node ${p.name.toUpperCase()}. Current Stock: ${p.stock}`, "SECURITY");
        alertedNodes.current.add(`${p.id}-stock`);
      }
    });
  }, [products, addMessage]);

  return null;
}
