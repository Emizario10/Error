"use client";

import React, { useState } from 'react';
import GlitchButton from '@/components/GlitchButton';
import CreatePostModal from './CreatePostModal';

interface UndergroundClientProps {
  isAdmin: boolean;
  userId: string;
}

/**
 * UNDERGROUND_CLIENT: Administrative Intelligence Hub.
 * Manages the deployment of new intelligence reports.
 */
export default function UndergroundClient({ isAdmin, userId }: UndergroundClientProps) {
  const [showModal, setShowModal] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <div className="flex items-center gap-4">
        <GlitchButton 
          text="CREATE_POST" 
          className="text-[10px] py-2 px-8"
          onClick={() => setShowModal(true)}
        />
      </div>

      {showModal && (
        <CreatePostModal 
          authorId={userId} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}
