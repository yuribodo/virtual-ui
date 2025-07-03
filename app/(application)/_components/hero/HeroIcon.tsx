'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import clsx from 'clsx';

interface HeroIconProps {
  className?: string;
}

export function HeroIcon({ className }: HeroIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  // Mouse tracking for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring animations for smooth mouse follow
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  
  // Transform mouse position to rotation values
  const rotateX = useTransform(springY, [-100, 100], [10, -10]);
  const rotateY = useTransform(springX, [-100, 100], [-10, 10]);
  
  // Pulse animation for the components
  const [pulseActive, setPulseActive] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 2000);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    // Reset after a few clicks to prevent overwhelming
    setTimeout(() => setClickCount(0), 2000);
  };

  return (
    <motion.div
      className={clsx('relative flex items-center justify-center', className)}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 1, 
        ease: [0.25, 0.25, 0.25, 1],
        delay: 0.2 
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      onClick={handleClick}
      style={{ perspective: '1000px' }}
    >
      {/* Glow effect background */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(139, 69, 19, 0.3) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
        animate={{
          scale: isHovered ? 1.3 : pulseActive ? 1.2 : 1,
          opacity: isHovered ? 0.8 : pulseActive ? 0.7 : 0.4,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#8B4513] rounded-full opacity-40"
          style={{
            left: `${20 + i * 12}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: [0.4, 0.0, 0.2, 1],
            delay: i * 0.3,
            repeatType: "reverse",
          }}
        />
      ))}

      {/* Main Icon Container */}
      <motion.div
        className="relative z-10 cursor-pointer"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotateZ: clickCount > 0 ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          scale: { duration: 0.2 },
          rotateZ: { duration: 0.4, ease: 'easeInOut' },
        }}
      >
        {/* Icon Shadow */}
        <motion.div
          className="absolute inset-0 transform translate-y-2 translate-x-1 opacity-20"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{
            opacity: isHovered ? 0.3 : 0.15,
            scale: isHovered ? 1.02 : 1,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="64" height="64" rx="12" fill="#000" />
            <circle cx="20" cy="20" r="4" fill="#000" />
            <circle cx="44" cy="20" r="4" fill="#000" />
            <circle cx="32" cy="44" r="4" fill="#000" />
            <line x1="24" y1="20" x2="40" y2="20" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <line x1="22" y1="23" x2="30" y2="41" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <line x1="42" y1="23" x2="34" y2="41" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* Main Icon */}
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Background with gradient animation */}
          <motion.rect
            width="64"
            height="64"
            rx="12"
            fill="#8B4513"
            animate={{
              fill: isHovered ? '#A0522D' : '#8B4513',
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Component nodes with individual animations */}
          <motion.circle
            cx="20"
            cy="20"
            r="4"
            fill="white"
            animate={{
              scale: pulseActive ? [1, 1.3, 1] : isHovered ? 1.1 : 1,
              opacity: isHovered ? [1, 0.7, 1] : 1,
            }}
            transition={{
              scale: { 
                duration: pulseActive ? 1.8 : 0.4, 
                ease: [0.25, 0.46, 0.45, 0.94],
                times: pulseActive ? [0, 0.5, 1] : undefined
              },
              opacity: { 
                duration: 2, 
                repeat: isHovered ? Infinity : 0, 
                ease: [0.4, 0.0, 0.2, 1],
                repeatType: "reverse"
              },
            }}
            style={{ transformOrigin: '20px 20px' }}
          />
          
          <motion.circle
            cx="44"
            cy="20"
            r="4"
            fill="white"
            animate={{
              scale: pulseActive ? [1, 1.3, 1] : isHovered ? 1.1 : 1,
              opacity: isHovered ? [1, 0.7, 1] : 1,
            }}
            transition={{
              scale: { 
                duration: pulseActive ? 1.8 : 0.4, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.1,
                times: pulseActive ? [0, 0.5, 1] : undefined
              },
              opacity: { 
                duration: 2, 
                repeat: isHovered ? Infinity : 0, 
                ease: [0.4, 0.0, 0.2, 1],
                delay: 0.2,
                repeatType: "reverse"
              },
            }}
            style={{ transformOrigin: '44px 20px' }}
          />
          
          <motion.circle
            cx="32"
            cy="44"
            r="4"
            fill="white"
            animate={{
              scale: pulseActive ? [1, 1.3, 1] : isHovered ? 1.1 : 1,
              opacity: isHovered ? [1, 0.7, 1] : 1,
            }}
            transition={{
              scale: { 
                duration: pulseActive ? 1.8 : 0.4, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2,
                times: pulseActive ? [0, 0.5, 1] : undefined
              },
              opacity: { 
                duration: 2, 
                repeat: isHovered ? Infinity : 0, 
                ease: [0.4, 0.0, 0.2, 1],
                delay: 0.4,
                repeatType: "reverse"
              },
            }}
            style={{ transformOrigin: '32px 44px' }}
          />
          
          {/* Connection lines with flow animation */}
          <motion.line
            x1="24"
            y1="20"
            x2="40"
            y2="20"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 1 }}
            animate={{
              pathLength: pulseActive ? [1, 0, 1] : 1,
              opacity: isHovered ? [1, 0.5, 1] : 1,
            }}
            transition={{
              pathLength: { 
                duration: pulseActive ? 3 : 0, 
                ease: [0.16, 1, 0.3, 1],
                times: pulseActive ? [0, 0.3, 1] : undefined
              },
              opacity: { 
                duration: 1.8, 
                repeat: isHovered ? Infinity : 0, 
                ease: [0.4, 0.0, 0.2, 1],
                repeatType: "reverse"
              },
            }}
          />
          
          <motion.line
            x1="22"
            y1="23"
            x2="30"
            y2="41"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 1 }}
            animate={{
              pathLength: pulseActive ? [1, 0, 1] : 1,
              opacity: isHovered ? [1, 0.5, 1] : 1,
            }}
            transition={{
              pathLength: { 
                duration: pulseActive ? 3 : 0, 
                ease: [0.16, 1, 0.3, 1], 
                delay: 0.15,
                times: pulseActive ? [0, 0.3, 1] : undefined
              },
              opacity: { 
                duration: 1.8, 
                repeat: isHovered ? Infinity : 0, 
                ease: [0.4, 0.0, 0.2, 1], 
                delay: 0.1,
                repeatType: "reverse"
              },
            }}
          />
          
          <motion.line
            x1="42"
            y1="23"
            x2="34"
            y2="41"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 1 }}
            animate={{
              pathLength: pulseActive ? [1, 0, 1] : 1,
              opacity: isHovered ? [1, 0.5, 1] : 1,
            }}
            transition={{
              pathLength: { 
                duration: pulseActive ? 3 : 0, 
                ease: [0.16, 1, 0.3, 1], 
                delay: 0.3,
                times: pulseActive ? [0, 0.3, 1] : undefined
              },
              opacity: { 
                duration: 1.8, 
                repeat: isHovered ? Infinity : 0, 
                ease: [0.4, 0.0, 0.2, 1], 
                delay: 0.2,
                repeatType: "reverse"
              },
            }}
          />
        </motion.svg>
      </motion.div>

      {/* Click ripple effect */}
      {clickCount > 0 && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#8B4513]"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
    </motion.div>
  );
} 