'use client';

import React from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';

interface HeroDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroDescription({ children, className }: HeroDescriptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={clsx(
        'text-lg md:text-xl lg:text-2xl',
        'leading-relaxed',
        'text-[var(--base-content)] opacity-80',
        'max-w-2xl mx-auto',
        className
      )}
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.5,
          ease: [0.23, 1, 0.32, 1]
        }}
        className="transform-gpu"
      >
        {children}
      </motion.p>
    </motion.div>
  );
} 