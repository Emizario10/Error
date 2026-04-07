"use client";

import { create } from 'zustand';

interface SystemMessage {
  id: string;
  text: string;
  type: 'INFO' | 'ALERT' | 'SECURITY';
}

interface SystemState {
  messages: SystemMessage[];
  addMessage: (text: string, type?: SystemMessage['type']) => void;
  removeMessage: (id: string) => void;
}

/**
 * USE_SYSTEM_STORE: Global dispatch for System Consciousness.
 */
export const useSystemStore = create<SystemState>((set) => ({
  messages: [],
  addMessage: (text, type = 'INFO') => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      messages: [...state.messages, { id, text, type }]
    }));

    // Auto-remove after 6 seconds
    setTimeout(() => {
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== id)
      }));
    }, 6000);
  },
  removeMessage: (id) => {
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id)
    }));
  },
}));
