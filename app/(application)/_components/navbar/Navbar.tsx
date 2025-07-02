'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';

interface Brand {
  text?: string;
  href?: string;
  children?: React.ReactNode;
}

interface ComponentsLink {
  href?: string;
  text?: string;
}

interface NavbarProps {
  brand?: Brand;
  componentsLink?: ComponentsLink;
  children?: React.ReactNode;
  variant?: 'default' | 'transparent' | 'blur';
  className?: string;
}

export function Navbar({ 
  brand = { text: 'Virtual UI', href: '/' },
  componentsLink = { href: '/components', text: 'Components' },
  children,
  variant = 'default',
  className 
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'transparent':
        return 'bg-transparent';
      case 'blur':
        return 'bg-[var(--base-100)]/80 backdrop-blur-md';
      default:
        return 'bg-[var(--base-100)]';
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={clsx(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300 ease-in-out',
        getVariantStyles(),
        isScrolled && variant !== 'transparent' && 'shadow-lg border-b border-[var(--base-300)]',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center space-x-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex items-center"
            >
              <a
                href={brand.href}
                className={clsx(
                  'flex items-center space-x-2',
                  'transition-opacity duration-200',
                  'hover:opacity-80',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 rounded-lg',
                  'px-2 py-1'
                )}
              >
                {brand.children || (
                  <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent font-bold text-xl">
                    {brand.text}
                  </span>
                )}
              </a>
            </motion.div>

            {componentsLink && (
              <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <a
                  href={componentsLink.href}
                  className={clsx(
                    'px-3 py-2 rounded-lg',
                    'text-sm font-medium',
                    'transition-all duration-200',
                    'hover:bg-[var(--base-200)]',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2',
                    'text-[var(--base-content)] hover:text-[var(--primary)]'
                  )}
                >
                  {componentsLink.text}
                </a>
              </motion.div>
            )}
          </div>

          {children && (
            <div className="flex items-center space-x-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
} 