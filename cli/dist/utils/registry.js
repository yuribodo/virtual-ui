"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPONENTS_REGISTRY = void 0;
exports.getComponent = getComponent;
exports.getAllComponents = getAllComponents;
exports.getComponentNames = getComponentNames;
exports.COMPONENTS_REGISTRY = {
    'button-liquid': {
        name: 'button-liquid',
        description: 'Interactive button component with liquid ripple effects',
        dependencies: ['motion', 'clsx'],
        files: [
            {
                name: 'button-liquid.tsx',
                type: 'component',
                content: `'use client';

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

export { ButtonLiquid };`
            }
        ]
    },
    'parallax-card': {
        name: 'parallax-card',
        description: 'Interactive card component with 3D parallax effects',
        dependencies: ['motion', 'clsx'],
        files: [
            {
                name: 'parallax-card.tsx',
                type: 'component',
                content: `'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export interface ParallaxCardProps {
  titleColor?: string;
  descriptionColor?: string;
  title: string;
  description?: string;
  image?: string;
  parallaxSpeed?: number;
  variant?: 'default' | 'glass' | 'gradient' | 'shadow' | 'neon';
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}

const ParallaxCard: React.FC<ParallaxCardProps> = ({
  title,
  description = '',
  titleColor,
  descriptionColor,
  image,
  parallaxSpeed = 10,
  variant = 'default',
  onClick,
  style,
  children,
  className,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateXValue = (mouseY / rect.height) * parallaxSpeed;
      const rotateYValue = (mouseX / rect.width) * parallaxSpeed;
      
      setRotateX(-rotateXValue);
      setRotateY(rotateYValue);
    },
    [parallaxSpeed]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  }, []);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && onClick) {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50';
      case 'gradient':
        return 'bg-gradient-to-br from-blue-500 to-purple-600 text-white';
      case 'shadow':
        return 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-2xl';
      case 'neon':
        return 'bg-white dark:bg-gray-900 border-blue-500 shadow-[0_0_20px_theme(colors.blue.500)] shadow-blue-500/50';
      default:
        return 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg';
    }
  };

  const containerClasses = clsx(
    'perspective-1000 w-full max-w-sm mx-auto',
    className
  );

  const cardClasses = clsx(
    'relative overflow-hidden rounded-lg border p-6 transition-all duration-300 ease-out cursor-pointer',
    'transform-gpu will-change-transform',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    getVariantClasses(),
    {
      'scale-105': isHovered && variant !== 'neon',
      'shadow-[0_0_30px_theme(colors.blue.500)]': isHovered && variant === 'neon',
    }
  );

  const textColor = variant === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-gray-100';

  return (
    <div className={containerClasses} style={{ perspective: '1000px' }}>
      <motion.div
        ref={cardRef}
        className={cardClasses}
        style={{
          transformStyle: 'preserve-3d',
          ...style,
        }}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : -1}
        role={onClick ? 'button' : 'article'}
        aria-label={\`\${title}\${description ? \`: \${description}\` : ''}\`}
      >
        {image && (
          <div className="mb-4 overflow-hidden rounded-md">
            <motion.img
              src={image}
              alt={title}
              className="w-full h-48 object-cover"
              style={{ transform: 'translateZ(20px)' }}
              loading="lazy"
            />
          </div>
        )}
        
        <div className="space-y-3">
          <motion.h2
            className={clsx('text-xl font-bold leading-tight', textColor)}
            style={{ transform: 'translateZ(30px)', color: titleColor }}
          >
            {title}
          </motion.h2>
          
          {description && (
            <motion.p
              className={clsx('text-sm opacity-80', textColor)}
              style={{ transform: 'translateZ(20px)', color: descriptionColor }}
            >
              {description}
            </motion.p>
          )}
          
          {children && (
            <motion.div
              className="mt-4"
              style={{ transform: 'translateZ(25px)' }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export { ParallaxCard };`
            }
        ],
        tailwindConfig: {
            theme: {
                extend: {
                    perspective: {
                        '1000': '1000px',
                    }
                }
            }
        }
    }
};
function getComponent(name) {
    return exports.COMPONENTS_REGISTRY[name] || null;
}
function getAllComponents() {
    return Object.values(exports.COMPONENTS_REGISTRY);
}
function getComponentNames() {
    return Object.keys(exports.COMPONENTS_REGISTRY);
}
