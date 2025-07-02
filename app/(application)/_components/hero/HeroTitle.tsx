'use client';

import React from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';

interface HeroTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroTitle({ children, className }: HeroTitleProps) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: 0.2, 
        ease: [0.23, 1, 0.32, 1]
      }}
      className={clsx(
        'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
        'font-bold leading-tight',
        'text-[var(--base-content)]',
        'mb-4',
        'cursor-default',
        'transform-gpu',
        className
      )}
    >
      <motion.span
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ backgroundPosition: '100% 50%' }}
        transition={{ 
          duration: 3, 
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'reverse'
        }}
        className="inline-block"
        style={{
          backgroundSize: '200% 100%',
        }}
      >
        {children}
      </motion.span>
    </motion.h1>
  );
} 