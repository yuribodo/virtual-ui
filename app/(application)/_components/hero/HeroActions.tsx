'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import clsx from 'clsx';

interface HeroActionsProps {
  children: React.ReactNode;
  className?: string;
}

interface HeroButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
  onClick?: () => void;
  className?: string;
}

function HeroActionsRoot({ children, className }: HeroActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: 0.7,
        ease: [0.23, 1, 0.32, 1]
      }}
      className={clsx(
        'flex flex-col sm:flex-row gap-4',
        'justify-center items-center',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function HeroButton({ children, variant = 'primary', href, onClick, className }: HeroButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseClasses = clsx(
    'inline-flex items-center justify-center',
    'px-8 py-4',
    'text-lg font-semibold',
    'rounded-[var(--radius)]',
    'border-[var(--border)]',
    'transition-all duration-300',
    'focus:outline-none focus:ring-4 focus:ring-opacity-50',
    'min-w-[12rem]',
    'transform-gpu',
    'relative overflow-hidden'
  );

  const variantClasses = {
    primary: clsx(
      'bg-[var(--primary)] text-[var(--primary-content)]',
      'border-[var(--primary)]',
      'hover:bg-[var(--accent)] hover:border-[var(--accent)]',
      'focus:ring-[var(--primary)]',
      'shadow-lg hover:shadow-xl'
    ),
    secondary: clsx(
      'bg-transparent text-[var(--base-content)]',
      'border-[var(--base-300)]',
      'hover:bg-[var(--base-200)] hover:border-[var(--base-content)]',
      'focus:ring-[var(--base-300)]'
    ),
  };

  const buttonClasses = clsx(baseClasses, variantClasses[variant], className);

  const ButtonComponent = href ? motion.a : motion.button;
  const buttonProps = href ? { href } : { onClick };

  return (
    <ButtonComponent
      ref={ref as any}
      {...buttonProps}
      className={buttonClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.8,
        ease: [0.23, 1, 0.32, 1]
      }}
    >
      {/* Subtle shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      <span className="relative z-10">{children}</span>
    </ButtonComponent>
  );
}

export const HeroActions = Object.assign(HeroActionsRoot, {
  Button: HeroButton,
}); 