'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';

import PreviewTab from './tabs/PreviewTab';
import CodeTab from './tabs/CodeTab';
import PropsTab from './tabs/PropsTab';

export default function ButtonLiquidPage() {
  const tabs = [
    { id: 'preview', name: 'Preview', component: <PreviewTab /> },
    { id: 'code', name: 'Code', component: <CodeTab /> },
    { id: 'props', name: 'Props', component: <PropsTab /> },
  ];

  const [activeTab, setActiveTab] = useState<string>('preview');

  return (
    <div className="relative space-y-4">
      {/* Header */}
      <div className="border-b border-[var(--base-300)] pb-6">
        <h1 className="text-3xl font-bold text-[var(--base-content)]">Button Liquid</h1>
        <p className="text-[var(--base-content)]/70 mt-2">
          Interactive button component with liquid ripple effects that respond to click position. Features multiple visual variants, customizable animations, and full accessibility support.
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex space-x-1 bg-[var(--base-200)] p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2',
              activeTab === tab.id
                ? 'bg-[var(--base-100)] text-[var(--primary)] shadow-sm'
                : 'text-[var(--base-content)]/70 hover:text-[var(--base-content)] hover:bg-[var(--base-100)]/50'
            )}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.name}
          </motion.button>
        ))}
      </div>

      {/* Active tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="min-h-[400px]"
      >
        {tabs.find((t) => t.id === activeTab)?.component}
      </motion.div>
    </div>
  );
}