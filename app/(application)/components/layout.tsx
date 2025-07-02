'use client';

import React from 'react';
import { ComponentsSidebar } from './_components/ComponentsSidebar';

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--base-100)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <ComponentsSidebar />
          </div>
          
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 