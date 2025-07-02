'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';

interface HeroVisualProps {
  className?: string;
}

export function HeroVisual({ className }: HeroVisualProps) {
  const [selectedDate, setSelectedDate] = useState<number>(15);
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);

  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentMonth = 'December 2024';

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
      className={clsx(
        'flex items-center justify-center',
        'w-full h-full',
        className
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] opacity-20 blur-3xl rounded-3xl scale-110" />
        
        <motion.div
          className={clsx(
            'relative',
            'bg-[var(--base-100)] border-[var(--border)] border-[var(--base-300)]',
            'rounded-[var(--radius-box)] shadow-2xl',
            'p-8 w-80 max-w-full',
            'backdrop-blur-sm'
          )}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <motion.h3 
              className="text-xl font-semibold text-[var(--base-content)]"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentMonth}
            </motion.h3>
            <div className="flex gap-2">
              <motion.button 
                className="w-8 h-8 rounded-full bg-[var(--base-200)] hover:bg-[var(--base-300)] flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </motion.button>
              <motion.button 
                className="w-8 h-8 rounded-full bg-[var(--base-200)] hover:bg-[var(--base-300)] flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                →
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-[var(--base-content)] opacity-60 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {monthDays.slice(0, 25).map((day) => (
              <motion.button
                key={day}
                className={clsx(
                  'aspect-square rounded-[var(--radius)] text-sm font-medium',
                  'flex items-center justify-center',
                  'transition-all duration-200',
                  'hover:bg-[var(--base-200)]',
                  selectedDate === day && 'bg-[var(--primary)] text-[var(--primary-content)] shadow-lg',
                  hoveredDate === day && selectedDate !== day && 'bg-[var(--base-200)] scale-110'
                )}
                onClick={() => setSelectedDate(day)}
                onMouseEnter={() => setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
                whileHover={{ scale: selectedDate === day ? 1 : 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {day}
              </motion.button>
            ))}
          </div>

          <motion.div 
            className="mt-8 pt-4 border-t border-[var(--base-300)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm text-[var(--base-content)] opacity-60 text-center">
              Interactive Component Preview
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute -top-4 -right-4 w-16 h-16 bg-[var(--accent)] rounded-full opacity-60"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        <motion.div
          className="absolute -bottom-6 -left-6 w-12 h-12 bg-[var(--secondary)] rounded-full opacity-40"
          animate={{ 
            scale: [1.2, 1, 1.2],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
    </motion.div>
  );
} 