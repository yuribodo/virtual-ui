'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const codeFiles = [
  {
    id: 'component',
    name: 'ButtonLiquid.tsx',
    description: 'Main component implementation',
    language: 'typescript',
    code: `'use client';

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

export default ButtonLiquid;`
  },
  {
    id: 'usage',
    name: 'Usage Examples',
    description: 'Common usage patterns and examples',
    language: 'typescript',
    code: `// Basic usage
<ButtonLiquid onClick={() => console.log('Clicked!')}>
  Click me!
</ButtonLiquid>

// Different variants
<ButtonLiquid variant="solid">Solid Button</ButtonLiquid>
<ButtonLiquid variant="outline">Outline Button</ButtonLiquid>
<ButtonLiquid variant="ghost">Ghost Button</ButtonLiquid>
<ButtonLiquid variant="gradient">Gradient Button</ButtonLiquid>

// Different sizes
<ButtonLiquid size="sm">Small</ButtonLiquid>
<ButtonLiquid size="md">Medium</ButtonLiquid>
<ButtonLiquid size="lg">Large</ButtonLiquid>
<ButtonLiquid size="xl">Extra Large</ButtonLiquid>

// States
<ButtonLiquid loading>Loading...</ButtonLiquid>
<ButtonLiquid disabled>Disabled</ButtonLiquid>

// Custom ripple effect
<ButtonLiquid 
  rippleColor="rgba(255, 0, 0, 0.5)"
  rippleDuration={800}
>
  Custom Ripple
</ButtonLiquid>

// With custom styling
<ButtonLiquid 
  className="border-2 border-dashed border-purple-500"
  style={{ '--primary': '#8b5cf6' }}
>
  Custom Style
</ButtonLiquid>

// Form usage
<form onSubmit={handleSubmit}>
  <ButtonLiquid type="submit" loading={isSubmitting}>
    {isSubmitting ? 'Submitting...' : 'Submit Form'}
  </ButtonLiquid>
</form>

// With icons (using your preferred icon library)
<ButtonLiquid variant="gradient">
  <IconDownload className="w-4 h-4" />
  Download
</ButtonLiquid>`
  },
  {
    id: 'advanced',
    name: 'Advanced Examples',
    description: 'Advanced patterns and customizations',
    language: 'typescript',
    code: `// Custom component with ButtonLiquid
function CallToActionButton({ children, ...props }) {
  return (
    <ButtonLiquid
      variant="gradient"
      size="lg"
      className="shadow-lg hover:shadow-xl transition-shadow"
      rippleColor="rgba(255, 255, 255, 0.8)"
      rippleDuration={700}
      style={{
        '--primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '--secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      }}
      {...props}
    >
      {children}
    </ButtonLiquid>
  );
}

// Async action handler
async function handleAsyncAction() {
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    try {
      await fetch('/api/action', { method: 'POST' });
      toast.success('Action completed!');
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ButtonLiquid loading={loading} onClick={handleClick}>
      {loading ? 'Processing...' : 'Execute Action'}
    </ButtonLiquid>
  );
}

// Conditional rendering based on state
function ConditionalButton({ user, onLogin, onLogout }) {
  if (user) {
    return (
      <ButtonLiquid variant="outline" onClick={onLogout}>
        Sign Out
      </ButtonLiquid>
    );
  }

  return (
    <ButtonLiquid variant="solid" onClick={onLogin}>
      Sign In
    </ButtonLiquid>
  );
}

// Button group with different variants
function ButtonGroup() {
  return (
    <div className="flex gap-3">
      <ButtonLiquid variant="ghost">Cancel</ButtonLiquid>
      <ButtonLiquid variant="outline">Save Draft</ButtonLiquid>
      <ButtonLiquid variant="solid">Publish</ButtonLiquid>
    </div>
  );
}

// Responsive sizing
function ResponsiveButton({ children }) {
  return (
    <ButtonLiquid 
      size="sm"
      className="md:text-base md:px-6 md:py-3 lg:text-lg lg:px-8 lg:py-4"
    >
      {children}
    </ButtonLiquid>
  );
}`
  },
  {
    id: 'styling',
    name: 'Custom Styling',
    description: 'CSS customization and theming',
    language: 'css',
    code: `/* Custom CSS variables for theming */
.button-liquid-custom {
  --primary: #3b82f6;
  --primary-content: #ffffff;
  --secondary: #8b5cf6;
  --radius: 0.75rem;
  --border: 2px;
}

/* Dark theme variant */
.dark .button-liquid {
  --primary: #60a5fa;
  --primary-content: #1e293b;
}

/* Custom ripple animations */
.button-liquid-slow-ripple {
  --ripple-duration: 1000ms;
}

.button-liquid-fast-ripple {
  --ripple-duration: 300ms;
}

/* Size variants */
.button-liquid-xs {
  @apply px-2 py-1 text-xs;
}

.button-liquid-2xl {
  @apply px-10 py-5 text-2xl;
}

/* Custom gradient variants */
.button-liquid-sunset {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
}

.button-liquid-ocean {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Hover effects */
.button-liquid-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

/* Loading spinner customization */
.button-liquid .loading-spinner {
  border-color: currentColor;
  border-top-color: transparent;
}

/* Focus styles */
.button-liquid:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}`
  }
];

export default function CodeTab() {
  const [activeFile, setActiveFile] = useState('component');
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string, fileName: string) => {
    navigator.clipboard.writeText(code);
    setCopied(fileName);
    toast.success(`Copied ${fileName}!`, { 
      description: 'Code copied to clipboard', 
      duration: 2000 
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const activeFileData = codeFiles.find(f => f.id === activeFile)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--base-content)]">Source Code</h2>
          <p className="text-[var(--base-content)]/70 mt-1">
            Complete implementation and usage examples
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--base-content)]/60">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>TypeScript</span>
        </div>
      </div>

      {/* File tabs */}
      <div className="border-b border-[var(--base-300)]">
        <nav className="flex space-x-1 overflow-x-auto">
          {codeFiles.map((file) => (
            <motion.button
              key={file.id}
              onClick={() => setActiveFile(file.id)}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 cursor-pointer whitespace-nowrap',
                'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2',
                activeFile === file.id
                  ? 'bg-[var(--base-100)] text-[var(--primary)] border-b-2 border-[var(--primary)]'
                  : 'text-[var(--base-content)]/70 hover:text-[var(--base-content)] hover:bg-[var(--base-200)]'
              )}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <span>{file.name}</span>
                {file.id === 'component' && (
                  <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></span>
                )}
              </div>
            </motion.button>
          ))}
        </nav>
      </div>

      {/* File content */}
      <motion.div
        key={activeFile}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="space-y-4"
      >
        {/* File header */}
        <div className="flex items-center justify-between p-4 bg-[var(--base-100)] border border-[var(--base-300)] rounded-t-lg">
          <div>
            <h3 className="font-medium text-[var(--base-content)]">{activeFileData.name}</h3>
            <p className="text-sm text-[var(--base-content)]/60 mt-1">
              {activeFileData.description}
            </p>
          </div>
          <motion.button
            onClick={() => copyCode(activeFileData.code, activeFileData.name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
              'px-3 py-2 rounded-md transition-all cursor-pointer flex items-center gap-2 text-sm font-medium',
              copied === activeFileData.name
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-[var(--base-200)] hover:bg-[var(--base-300)] text-[var(--base-content)]'
            )}
            title="Copy code"
          >
            <span>{copied === activeFileData.name ? '✅' : '📋'}</span>
            <span>{copied === activeFileData.name ? 'Copied!' : 'Copy'}</span>
          </motion.button>
        </div>

        {/* Code block */}
        <div className="relative">
          <pre className="bg-[var(--base-100)] border border-[var(--base-300)] border-t-0 rounded-b-lg p-4 overflow-x-auto text-sm leading-relaxed max-h-[600px] overflow-y-auto">
            <code className="text-[var(--base-content)] whitespace-pre">
              {activeFileData.code}
            </code>
          </pre>
          
          {/* Language indicator */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-[var(--base-300)] rounded text-xs text-[var(--base-content)]/70 font-mono">
            {activeFileData.language}
          </div>
        </div>
      </motion.div>

      {/* Installation reminder */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs">💡</span>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Quick Start</h4>
            <p className="text-sm text-blue-800 mt-1">
              Use the Virtual UI CLI to automatically add this component to your project:
            </p>
            <code className="inline-block mt-2 px-2 py-1 bg-blue-100 rounded text-sm text-blue-900 font-mono">
              npx virtual-ui@latest add button-liquid
            </code>
          </div>
        </div>
      </div>

      {/* Dependencies */}
      <div className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-4">
        <h4 className="font-medium text-[var(--base-content)] mb-3">📦 Dependencies</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--base-content)]/70">React</span>
            <span className="text-[var(--base-content)] font-mono">^18.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--base-content)]/70">Framer Motion</span>
            <span className="text-[var(--base-content)] font-mono">^11.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--base-content)]/70">clsx</span>
            <span className="text-[var(--base-content)] font-mono">^2.0.0</span>
          </div>
        </div>
      </div>

      {/* Performance notes */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-medium text-orange-900 mb-2">⚡ Performance Notes</h4>
        <ul className="text-sm text-orange-800 space-y-1">
          <li>• Uses <code className="bg-orange-100 px-1 rounded">transform-gpu</code> for hardware acceleration</li>
          <li>• Ripple effects are automatically cleaned up to prevent memory leaks</li>
          <li>• <code className="bg-orange-100 px-1 rounded">will-change</code> property optimizes animations</li>
          <li>• Event listeners are properly removed on component unmount</li>
        </ul>
      </div>
    </div>
  );
}