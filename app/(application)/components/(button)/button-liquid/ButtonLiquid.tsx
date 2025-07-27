'use client';

import React, { useState, useRef, MouseEvent, ReactNode } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

export interface ButtonLiquidProps {
  children: ReactNode;
  variant?: 'solid' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  rippleColor?: string;
  rippleDuration?: number;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

export function ButtonLiquid({
  children,
  variant = 'solid',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  rippleColor,
  rippleDuration = 600,
  onClick,
  type = 'button',
  style,
  ...props
}: ButtonLiquidProps) {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const rippleIdRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled || loading) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple: RippleEffect = {
      id: rippleIdRef.current++,
      x,
      y,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, rippleDuration);

    if (onClick) {
      onClick(event);
    }
  };

  const baseClasses = clsx(
    'relative overflow-hidden rounded-[var(--radius)] font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2',
    'transform-gpu will-change-transform',
    'disabled:cursor-not-allowed disabled:opacity-50',
    {
      'cursor-pointer': !disabled && !loading,
      'cursor-not-allowed': disabled,
      'cursor-wait': loading,
    }
  );

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const variantClasses = {
    solid: clsx(
      'bg-[var(--primary)] text-[var(--primary-content)]',
      'hover:bg-[var(--primary)]/90 hover:scale-105',
      'active:scale-95'
    ),
    outline: clsx(
      'border-[var(--border)] border-[var(--primary)] text-[var(--primary)] bg-transparent',
      'hover:bg-[var(--primary)] hover:text-[var(--primary-content)] hover:scale-105',
      'active:scale-95'
    ),
    ghost: clsx(
      'text-[var(--primary)] bg-transparent',
      'hover:bg-[var(--primary)]/10 hover:scale-105',
      'active:scale-95'
    ),
    gradient: clsx(
      'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-content)]',
      'hover:from-[var(--primary)]/90 hover:to-[var(--secondary)]/90 hover:scale-105',
      'active:scale-95'
    ),
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled || loading}
      onClick={createRipple}
      className={clsx(baseClasses, sizeClasses[size], variantClasses[variant], className)}
      style={style}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {children}
      </span>

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              backgroundColor: rippleColor || 'rgba(255, 255, 255, 0.6)',
            }}
            initial={{
              width: 0,
              height: 0,
              x: '-50%',
              y: '-50%',
              opacity: 1,
            }}
            animate={{
              width: '200px',
              height: '200px',
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: rippleDuration / 1000,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

export default ButtonLiquid;