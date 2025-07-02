export interface ComponentInfo {
  name: string;
  description: string;
  dependencies: string[];
  devDependencies?: string[];
  files: ComponentFile[];
  tailwindConfig?: TailwindConfig;
  globalCSS?: string[];
}

export interface ComponentFile {
  name: string;
  content: string;
  type: 'component' | 'utils' | 'types';
  target?: string;
}

export interface TailwindConfig {
  theme?: Record<string, any>;
  plugins?: string[];
}

export const COMPONENTS_REGISTRY: Record<string, ComponentInfo> = {
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

export function getComponent(name: string): ComponentInfo | null {
  return COMPONENTS_REGISTRY[name] || null;
}

export function getAllComponents(): ComponentInfo[] {
  return Object.values(COMPONENTS_REGISTRY);
}

export function getComponentNames(): string[] {
  return Object.keys(COMPONENTS_REGISTRY);
} 