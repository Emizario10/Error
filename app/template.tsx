"use client";

import RouteTransition from "@/components/RouteTransition";

/**
 * Next.js Template component:
 * This will wrap every page and trigger the RouteTransition component
 * whenever the pathname changes.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <RouteTransition>
      {children}
    </RouteTransition>
  );
}
