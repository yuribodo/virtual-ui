'use client';

import { useId } from 'react';
import clsx from 'clsx';

interface DotPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  opacity?: number;
}

export function DotPattern({
  width = 24,
  height = 24,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 0.8,
  className,
  opacity = 0.3,
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute inset-0 h-full w-full',
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle 
            cx={cx} 
            cy={cy} 
            r={cr} 
            fill="currentColor"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect 
        width="100%" 
        height="100%" 
        strokeWidth={0} 
        fill={`url(#${id})`} 
      />
    </svg>
  );
} 