"use client";

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import GlitchButton from './GlitchButton';

interface AddToCartButtonProps {
  product: any;
  className?: string;
}

export default function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <GlitchButton 
      text="ADD_TO_CART" 
      className={className}
      onClick={() => addItem(product)}
    />
  );
}
