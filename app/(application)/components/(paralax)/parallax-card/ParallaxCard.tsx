'use client';

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
        return 'bg-[var(--base-100)]/80 backdrop-blur-md border-[var(--base-300)]/50';
      case 'gradient':
        return 'bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-[var(--primary-content)]';
      case 'shadow':
        return 'bg-[var(--base-100)] border-[var(--base-300)] shadow-2xl';
      case 'neon':
        return 'bg-[var(--base-100)] border-[var(--accent)] shadow-[0_0_20px_var(--accent)] shadow-[var(--accent)]/50';
      default:
        return 'bg-[var(--base-100)] border-[var(--base-300)] shadow-lg';
    }
  };

  const containerClasses = clsx(
    'perspective-1000 w-full max-w-sm mx-auto',
    className
  );

  const cardClasses = clsx(
    'relative overflow-hidden rounded-[var(--radius)] border-[var(--border)] p-6 transition-all duration-300 ease-out cursor-pointer',
    'transform-gpu will-change-transform',
    'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2',
    getVariantClasses(),
    {
      'scale-105': isHovered && variant !== 'neon',
      'shadow-[0_0_30px_var(--accent)]': isHovered && variant === 'neon',
    }
  );

  const textColor = variant === 'gradient' ? 'text-[var(--primary-content)]' : 'text-[var(--base-content)]';

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
        aria-label={`${title}${description ? `: ${description}` : ''}`}
      >
        {image && (
          <div className="mb-4 overflow-hidden rounded-[calc(var(--radius)-4px)]">
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
            className={clsx('text-xl font-bold leading-tight')}
            style={{ transform: 'translateZ(30px)', color: titleColor }}
          >
            {title}
          </motion.h2>
          
          {description && (
            <motion.p
              className={clsx('text-sm opacity-80')}
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

export default ParallaxCard; 