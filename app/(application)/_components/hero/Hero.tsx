'use client';

import React from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { HeroTitle } from './HeroTitle';
import { HeroDescription } from './HeroDescription';
import { HeroActions } from './HeroActions';
import { HeroVisual } from './HeroVisual';
import { DotPattern } from './DotPattern';
import { HeroIcon } from './HeroIcon';

interface HeroProps {
  children: React.ReactNode;
  className?: string;
}

function HeroRoot({ children, className }: HeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className={clsx(
        'relative w-full min-h-screen',
        'bg-[var(--base-100)] text-[var(--base-content)]',
        'flex items-center justify-center',
        'px-4 py-16 md:px-8 lg:px-16',
        'overflow-hidden',
        className
      )}
    >
      <DotPattern 
        width={32}
        height={32}
        cx={16}
        cy={16}
        cr={1.2}
        opacity={0.15}
        className="text-[var(--base-content)]"
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--base-100)]/50 via-transparent to-[var(--base-100)]/30" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {children}
      </div>
    </motion.section>
  );
}

function HeroContent({ children, className }: HeroProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
      className={clsx(
        'flex flex-col items-center space-y-8',
        'text-center',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export const Hero = Object.assign(HeroRoot, {
  Content: HeroContent,
  Title: HeroTitle,
  Description: HeroDescription,
  Actions: HeroActions,
  Visual: HeroVisual,
  Icon: HeroIcon,
}); 