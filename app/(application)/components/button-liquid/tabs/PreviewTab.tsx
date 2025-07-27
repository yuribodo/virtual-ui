'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ButtonLiquid } from '../../(button)/button-liquid/ButtonLiquid';

/* ---------- Static config ---------- */

const sections = [
  { id: 'playground', label: '🛠️ Playground', icon: '🎮' },
  { id: 'installation', label: '📦 Installation', icon: '📦' },
  { id: 'solid', label: '🔵 Solid', icon: '🔵' },
  { id: 'outline', label: '⭕ Outline', icon: '⭕' },
  { id: 'ghost', label: '👻 Ghost', icon: '👻' },
  { id: 'gradient', label: '🌈 Gradient', icon: '🌈' },
  { id: 'sizes', label: '📏 Sizes', icon: '📏' },
  { id: 'states', label: '⚡ States', icon: '⚡' }
];

const variantOptions = [
  {
    value: 'solid',
    label: 'Solid',
    icon: '🔵',
    description: 'Classic filled button',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    value: 'outline',
    label: 'Outline',
    icon: '⭕',
    description: 'Border only design',
    gradient: 'from-gray-100 to-gray-200 border-2 border-blue-500',
  },
  {
    value: 'ghost',
    label: 'Ghost',
    icon: '👻',
    description: 'Minimal transparent style',
    gradient: 'from-transparent to-blue-50',
  },
  {
    value: 'gradient',
    label: 'Gradient',
    icon: '🌈',
    description: 'Eye-catching gradients',
    gradient: 'from-purple-500 to-pink-500',
  },
] as const;

type Variant = typeof variantOptions[number]['value'];

const sizeOptions = [
  { value: 'sm', label: 'Small', description: 'Compact buttons' },
  { value: 'md', label: 'Medium', description: 'Standard size' },
  { value: 'lg', label: 'Large', description: 'Prominent buttons' },
  { value: 'xl', label: 'Extra Large', description: 'Hero buttons' },
] as const;

type Size = typeof sizeOptions[number]['value'];

/* ---------- CLI install helpers ---------- */

const packageManagers = [
  { id: 'pnpm', name: 'pnpm', icon: '📦', command: 'pnpm dlx virtual-ui@latest add button-liquid' },
  { id: 'npm', name: 'npm', icon: '📦', command: 'npx virtual-ui@latest add button-liquid' },
  { id: 'yarn', name: 'yarn', icon: '📦', command: 'yarn dlx virtual-ui@latest add button-liquid' },
  { id: 'bun', name: 'bun', icon: '📦', command: 'bunx virtual-ui@latest add button-liquid' }
] as const;

function InstallationTabs() {
  const [activeManager, setActiveManager] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');
  const [copied, setCopied] = useState(false);

  const copyCommand = (command: string, managerName: string) => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    toast.success(`Copied ${managerName} command!`, { description: command, duration: 3000 });
    setTimeout(() => setCopied(false), 2000);
  };

  const activeCommand = packageManagers.find(pm => pm.id === activeManager)!.command;
  const activeManagerName = packageManagers.find(pm => pm.id === activeManager)!.name;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-[var(--base-200)] p-1 rounded-lg">
          {packageManagers.map((pm) => (
            <motion.button
              key={pm.id}
              onClick={() => setActiveManager(pm.id)}
              className={clsx(
                'px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer flex items-center gap-2',
                activeManager === pm.id
                  ? 'bg-[var(--base-100)] text-[var(--primary)] shadow-sm'
                  : 'text-[var(--base-content)]/70 hover:text-[var(--base-content)] hover:bg-[var(--base-100)]/50'
              )}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{pm.icon}</span>
              <span>{pm.name}</span>
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={() => copyCommand(activeCommand, activeManagerName)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={clsx(
            'px-3 py-2 rounded-md transition-all cursor-pointer flex items-center gap-2 text-sm font-medium',
            copied
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-[var(--base-300)] hover:bg-[var(--base-400)] text-[var(--base-content)]'
          )}
          title="Copy command"
        >
          <span>{copied ? '✅' : '📋'}</span>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </motion.button>
      </div>

      <pre className="bg-[var(--base-200)] rounded-lg p-4 text-sm overflow-x-auto">
        <code className="text-[var(--primary)] font-medium">{activeCommand}</code>
      </pre>
    </div>
  );
}

/* ---------- Main component ---------- */

export default function PreviewTab() {
  /* ----- state ----- */
  const [activeSection, setActiveSection] = useState('playground');
  const [playgroundProps, setPlaygroundProps] = useState({
    text: 'Click me!',
    variant: 'solid' as Variant,
    size: 'md' as Size,
    disabled: false,
    loading: false,
    rippleColor: 'rgba(255, 255, 255, 0.6)',
    rippleDuration: 600,
    className: ''
  });

  const [copyFeedback, setCopyFeedback] = useState(false);

  /* ----- scroll spy ----- */
  useEffect(() => {
    function onScroll() {
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          if (scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ----- helpers ----- */
  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function resetToDefaults() {
    setPlaygroundProps({
      text: 'Click me!',
      variant: 'solid',
      size: 'md',
      disabled: false,
      loading: false,
      rippleColor: 'rgba(255, 255, 255, 0.6)',
      rippleDuration: 600,
      className: ''
    });
  }

  function randomizeProps() {
    const variants: Variant[] = ['solid', 'outline', 'ghost', 'gradient'];
    const sizes: Size[] = ['sm', 'md', 'lg', 'xl'];
    const texts = ['🚀 Launch', '💎 Premium', '🎯 Action', '⚡ Power', '🌟 Magic'];
    const colors = [
      'rgba(255, 255, 255, 0.6)',
      'rgba(0, 0, 0, 0.3)',
      'rgba(59, 130, 246, 0.5)',
      'rgba(168, 85, 247, 0.5)',
      'rgba(236, 72, 153, 0.5)'
    ];

    setPlaygroundProps({
      text: texts[Math.floor(Math.random() * texts.length)],
      variant: variants[Math.floor(Math.random() * variants.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      disabled: false,
      loading: Math.random() > 0.7,
      rippleColor: colors[Math.floor(Math.random() * colors.length)],
      rippleDuration: Math.floor(Math.random() * 400) + 400,
      className: Math.random() > 0.7 ? 'border-2 border-dashed border-purple-500' : ''
    });
  }

  function copyCode() {
    const code = `<ButtonLiquid
  variant="${playgroundProps.variant}"
  size="${playgroundProps.size}"${playgroundProps.disabled ? '\n  disabled' : ''}${playgroundProps.loading ? '\n  loading' : ''}${playgroundProps.rippleColor !== 'rgba(255, 255, 255, 0.6)' ? `\n  rippleColor="${playgroundProps.rippleColor}"` : ''}${playgroundProps.rippleDuration !== 600 ? `\n  rippleDuration={${playgroundProps.rippleDuration}}` : ''}${playgroundProps.className ? `\n  className="${playgroundProps.className}"` : ''}
  onClick={() => console.log('Clicked!')}
>
  ${playgroundProps.text}
</ButtonLiquid>`;

    navigator.clipboard.writeText(code);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  }

  const isModified = playgroundProps.text !== 'Click me!' ||
    playgroundProps.variant !== 'solid' ||
    playgroundProps.size !== 'md' ||
    playgroundProps.disabled ||
    playgroundProps.loading ||
    playgroundProps.rippleColor !== 'rgba(255, 255, 255, 0.6)' ||
    playgroundProps.rippleDuration !== 600 ||
    playgroundProps.className !== '';

  /* ----- UI render ----- */
  const TableOfContents = () => (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 hidden xl:block">
      <nav className="space-y-2">
        {sections.map((s) => (
          <button key={s.id} onClick={() => scrollToSection(s.id)} className={activeSection === s.id ? 'block text-sm text-[var(--primary)]' : 'block text-sm text-[var(--base-content)]/40 hover:text-[var(--base-content)]/70'}>
            {s.label.split(' ').slice(1).join(' ')}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="space-y-12 pb-12">
      <TableOfContents />
      {/* -------------- PLAYGROUND ---------------- */}
      <section id="playground" className="scroll-mt-20">
        <div className="bg-gradient-to-r from-[var(--accent)]/10 to-[var(--primary)]/10 rounded-xl border border-[var(--accent)]/20 overflow-hidden">
          <div className="p-8 border-b border-[var(--accent)]/20">
            {/* header row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center">
                  <span className="text-lg">🛠️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[var(--base-content)]">Live Playground</h2>
                  {isModified && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-orange-600 font-medium">Modified</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={randomizeProps}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
                >
                  🎲 Surprise Me
                </motion.button>
                <motion.button
                  onClick={resetToDefaults}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-[var(--base-200)] cursor-pointer hover:bg-[var(--base-300)] rounded-lg transition-colors flex items-center gap-2"
                >
                  🔄 Reset All
                </motion.button>
              </div>
            </div>

            <p className="text-[var(--base-content)]/80 mb-8">
              <strong>🚀 Real-time experimentation!</strong> Configure every aspect of the ButtonLiquid and see changes instantly. From basic props to advanced styling and ripple effects.
            </p>

            {/* grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* left column - controls */}
              <div className="space-y-6">
                <h3 className="font-semibold text-[var(--base-content)] flex items-center gap-2">
                  ⚙️ Configuration Panel
                </h3>

                {/* Basic Settings */}
                <div className="bg-[var(--base-100)] rounded-lg p-4 border border-[var(--base-300)] space-y-4">
                  <h4 className="font-medium text-[var(--base-content)] mb-3 flex items-center gap-2">
                    📝 Content & Basic
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-[var(--base-content)] mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={playgroundProps.text}
                      onChange={(e) => setPlaygroundProps(p => ({ ...p, text: e.target.value }))}
                      className="w-full px-3 py-2 bg-[var(--base-100)] border border-[var(--base-300)] rounded-md text-[var(--base-content)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={playgroundProps.disabled}
                        onChange={(e) => setPlaygroundProps(p => ({ ...p, disabled: e.target.checked }))}
                        className="w-4 h-4 text-[var(--accent)] bg-[var(--base-100)] border-[var(--base-300)] rounded focus:ring-[var(--accent)]"
                      />
                      <span className="text-sm font-medium text-[var(--base-content)]">Disabled</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={playgroundProps.loading}
                        onChange={(e) => setPlaygroundProps(p => ({ ...p, loading: e.target.checked }))}
                        className="w-4 h-4 text-[var(--accent)] bg-[var(--base-100)] border-[var(--base-300)] rounded focus:ring-[var(--accent)]"
                      />
                      <span className="text-sm font-medium text-[var(--base-content)]">Loading</span>
                    </label>
                  </div>
                </div>

                {/* Variant Selection */}
                <div className="bg-[var(--base-100)] rounded-lg p-4 border border-[var(--base-300)] space-y-4">
                  <h4 className="font-medium text-[var(--base-content)] mb-3 flex items-center gap-2">
                    🎨 Style Variant
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {variantOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => setPlaygroundProps(p => ({ ...p, variant: option.value }))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={clsx(
                          'p-3 rounded-lg border-2 transition-all cursor-pointer',
                          playgroundProps.variant === option.value
                            ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                            : 'border-[var(--base-300)] hover:border-[var(--accent)]/50 hover:bg-[var(--base-200)]'
                        )}
                      >
                        <div className={`w-full h-8 rounded mb-2 bg-gradient-to-r ${option.gradient}`}></div>
                        <div className="text-left">
                          <div className="font-medium text-sm flex items-center gap-1">
                            <span>{option.icon}</span>
                            <span>{option.label}</span>
                          </div>
                          <div className="text-xs text-[var(--base-content)]/60 mt-1">
                            {option.description}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="bg-[var(--base-100)] rounded-lg p-4 border border-[var(--base-300)] space-y-4">
                  <h4 className="font-medium text-[var(--base-content)] mb-3 flex items-center gap-2">
                    📏 Size
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {sizeOptions.map((size) => (
                      <motion.button
                        key={size.value}
                        onClick={() => setPlaygroundProps(p => ({ ...p, size: size.value }))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={clsx(
                          'p-3 rounded-lg border-2 transition-all cursor-pointer text-left',
                          playgroundProps.size === size.value
                            ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                            : 'border-[var(--base-300)] hover:border-[var(--accent)]/50 hover:bg-[var(--base-200)]'
                        )}
                      >
                        <div className="font-medium text-sm">{size.label}</div>
                        <div className="text-xs text-[var(--base-content)]/60 mt-1">
                          {size.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Ripple Configuration */}
                <div className="bg-[var(--base-100)] rounded-lg p-4 border border-[var(--base-300)] space-y-4">
                  <h4 className="font-medium text-[var(--base-content)] mb-3 flex items-center gap-2">
                    💧 Liquid Ripple
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-[var(--base-content)] mb-2">
                      Ripple Color
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded border-2 border-[var(--base-300)]"
                        style={{ backgroundColor: playgroundProps.rippleColor }}
                      ></div>
                      <input
                        type="text"
                        value={playgroundProps.rippleColor}
                        onChange={(e) => setPlaygroundProps(p => ({ ...p, rippleColor: e.target.value }))}
                        className="flex-1 px-3 py-2 bg-[var(--base-100)] border border-[var(--base-300)] rounded-md text-[var(--base-content)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-mono text-xs"
                        placeholder="rgba(255, 255, 255, 0.6)"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--base-content)] mb-2">
                      Duration: <span className="text-[var(--accent)]">{playgroundProps.rippleDuration}ms</span>
                    </label>
                    <input
                      type="range"
                      min={200}
                      max={1000}
                      value={playgroundProps.rippleDuration}
                      onChange={(e) => setPlaygroundProps(p => ({ ...p, rippleDuration: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-[var(--base-200)] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* right column - live preview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--base-content)] flex items-center gap-2">
                    🎬 Live Preview
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--base-content)]/60">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Real-time updates</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[var(--base-200)] to-[var(--base-300)] rounded-xl p-8 min-h-[500px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, var(--base-content) 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                      }}
                    ></div>
                  </div>

                  <div className="relative z-10">
                    <ButtonLiquid
                      variant={playgroundProps.variant}
                      size={playgroundProps.size}
                      disabled={playgroundProps.disabled}
                      loading={playgroundProps.loading}
                      rippleColor={playgroundProps.rippleColor}
                      rippleDuration={playgroundProps.rippleDuration}
                      className={playgroundProps.className || undefined}
                      onClick={() => toast.success('🎉 Button clicked!')}
                    >
                      {playgroundProps.text}
                    </ButtonLiquid>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs">
                    <div className="flex items-center gap-4">
                      <span>Variant: {playgroundProps.variant}</span>
                      <span>Size: {playgroundProps.size}</span>
                      <span>Duration: {playgroundProps.rippleDuration}ms</span>
                    </div>
                  </div>
                </div>

                {/* generated code */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-[var(--base-content)] flex items-center gap-2">
                      📋 Generated Code
                    </h4>
                    <motion.button
                      onClick={copyCode}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        'px-3 py-2 rounded-lg text-sm cursor-pointer transition-all flex items-center gap-2',
                        copyFeedback
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-[var(--base-200)] hover:bg-[var(--base-300)] text-[var(--base-content)]'
                      )}
                    >
                      {copyFeedback ? (
                        <>
                          ✅
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          📋
                          <span>Copy Code</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  <pre className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-4 text-xs overflow-x-auto max-h-64">
                    <code className="text-[var(--base-content)] whitespace-pre-wrap">
                      {`<ButtonLiquid
  variant="${playgroundProps.variant}"
  size="${playgroundProps.size}"${playgroundProps.disabled ? '\n  disabled' : ''}${playgroundProps.loading ? '\n  loading' : ''}${playgroundProps.rippleColor !== 'rgba(255, 255, 255, 0.6)' ? `\n  rippleColor="${playgroundProps.rippleColor}"` : ''}${playgroundProps.rippleDuration !== 600 ? `\n  rippleDuration={${playgroundProps.rippleDuration}}` : ''}${playgroundProps.className ? `\n  className="${playgroundProps.className}"` : ''}
  onClick={() => console.log('Clicked!')}
>
  ${playgroundProps.text}
</ButtonLiquid>`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------- INSTALL ---------------- */}
      <section id="installation" className="scroll-mt-20">
        <h3 className="text-lg font-semibold text-[var(--base-content)] mb-4">📦 Installation</h3>
        <div className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-6">
          <p className="text-sm text-[var(--base-content)]/70 mb-3">🚀 Quick Install with Virtual UI CLI</p>
          <InstallationTabs />
          <p className="text-xs text-[var(--base-content)]/60 mt-3">
            ✨ This will automatically install dependencies and add the component to your project
          </p>
        </div>
      </section>

      {/* ---------- VARIANT DEMOS ---------- */}
      {[
        {
          id: 'solid',
          icon: '🔵',
          title: 'Solid Variant',
          description: 'Classic filled button design',
          variant: 'solid' as Variant,
          notes: [
            'Perfect for: Primary actions, call-to-action buttons',
            'Accessibility: High contrast, easily recognizable',
            'Best practices: Use for the most important action on the page'
          ]
        },
        {
          id: 'outline',
          icon: '⭕',
          title: 'Outline Variant',
          description: 'Border-only design with hover fill',
          variant: 'outline' as Variant,
          notes: [
            'Perfect for: Secondary actions, subtle emphasis',
            'Performance: Lightweight with minimal visual weight',
            'Design: Transforms to solid on hover for clear feedback'
          ]
        },
        {
          id: 'ghost',
          icon: '👻',
          title: 'Ghost Variant',
          description: 'Minimal transparent style',
          variant: 'ghost' as Variant,
          notes: [
            'Perfect for: Tertiary actions, navigation buttons',
            'Minimal impact: Doesn\'t compete with other UI elements',
            'Versatile: Works well in any color scheme'
          ]
        },
        {
          id: 'gradient',
          icon: '🌈',
          title: 'Gradient Variant',
          description: 'Eye-catching gradient backgrounds',
          variant: 'gradient' as Variant,
          notes: [
            'Perfect for: Hero sections, premium features, highlights',
            'Modern design: Trending gradient aesthetics',
            'Customizable: Easy to change colors via CSS variables'
          ]
        }
      ].map((demo) => (
        <section key={demo.id} id={demo.id} className="scroll-mt-20 space-y-4">
          <div>
            <h4 className="text-xl font-semibold text-[var(--base-content)]">
              {demo.icon} {demo.title}
            </h4>
            <p className="text-[var(--base-content)]/70">{demo.description}</p>
          </div>
          <div className="bg-[var(--base-200)] rounded-lg p-8">
            <div className="flex justify-center">
              <ButtonLiquid variant={demo.variant} onClick={() => toast.success(`${demo.title} clicked!`)}>
                {demo.title}
              </ButtonLiquid>
            </div>
          </div>
          <div className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-4">
            <h5 className="font-medium text-[var(--base-content)] mb-2">💡 Developer Notes</h5>
            <ul className="text-sm text-[var(--base-content)]/80 space-y-1">
              {demo.notes.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      {/* ---------- SIZE COMPARISON ---------- */}
      <section id="sizes" className="scroll-mt-20 space-y-4">
        <div>
          <h4 className="text-xl font-semibold text-[var(--base-content)]">📏 Size Comparison</h4>
          <p className="text-[var(--base-content)]/70">All available button sizes</p>
        </div>
        <div className="bg-[var(--base-200)] rounded-lg p-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {sizeOptions.map((size) => (
              <div key={size.value} className="flex flex-col items-center gap-2">
                <ButtonLiquid
                  size={size.value}
                  variant="solid"
                  onClick={() => toast.success(`${size.label} button clicked!`)}
                >
                  {size.label}
                </ButtonLiquid>
                <span className="text-xs text-[var(--base-content)]/60">{size.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- STATES DEMO ---------- */}
      <section id="states" className="scroll-mt-20 space-y-4">
        <div>
          <h4 className="text-xl font-semibold text-[var(--base-content)]">⚡ Interactive States</h4>
          <p className="text-[var(--base-content)]/70">Different button states and behaviors</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h5 className="font-medium text-center">Normal State</h5>
            <div className="bg-[var(--base-200)] rounded-lg p-6 flex justify-center">
              <ButtonLiquid onClick={() => toast.success('Normal button clicked!')}>
                Click me!
              </ButtonLiquid>
            </div>
          </div>
          <div className="space-y-3">
            <h5 className="font-medium text-center">Loading State</h5>
            <div className="bg-[var(--base-200)] rounded-lg p-6 flex justify-center">
              <ButtonLiquid loading onClick={() => toast.success('Loading button clicked!')}>
                Processing...
              </ButtonLiquid>
            </div>
          </div>
          <div className="space-y-3">
            <h5 className="font-medium text-center">Disabled State</h5>
            <div className="bg-[var(--base-200)] rounded-lg p-6 flex justify-center">
              <ButtonLiquid disabled onClick={() => toast.success('This should not fire!')}>
                Disabled
              </ButtonLiquid>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}