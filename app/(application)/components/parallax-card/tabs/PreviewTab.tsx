'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ParallaxCard } from '../../(paralax)/parallax-card';

/* ---------- Static config ---------- */

const sections = [
  { id: 'playground', label: '🛠️ Playground', icon: '🎮' },
  { id: 'default', label: '🎯 Default', icon: '🎯' },
  { id: 'glass', label: '🔮 Glass', icon: '🔮' },
  { id: 'gradient', label: '🌈 Gradient', icon: '🌈' },
  { id: 'shadow', label: '⚫ Shadow', icon: '⚫' },
  { id: 'neon', label: '⚡ Neon', icon: '⚡' }
];

const variantOptions = [
  {
    value: 'default',
    label: 'Default',
    icon: '🎯',
    description: 'Clean minimal design',
    gradient: 'from-gray-100 to-gray-200',
  },
  {
    value: 'glass',
    label: 'Glass',
    icon: '🔮',
    description: 'Frosted glass effect',
    gradient: 'from-white/30 to-white/10',
  },
  {
    value: 'gradient',
    label: 'Gradient',
    icon: '🌈',
    description: 'Eye-catching gradients',
    gradient: 'from-purple-400 to-pink-400',
  },
  {
    value: 'shadow',
    label: 'Shadow',
    icon: '⚫',
    description: 'Deep shadow effects',
    gradient: 'from-gray-50 to-white',
  },
  {
    value: 'neon',
    label: 'Neon',
    icon: '⚡',
    description: 'Glowing neon borders',
    gradient: 'from-cyan-400 to-purple-400',
  },
] as const;

type Variant = typeof variantOptions[number]['value'];

const customContentTemplates = [
  {
    id: 'buttons',
    name: 'Action Buttons',
    icon: '🔘',
    content: `<div className="mt-4 flex gap-2">
  <button className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:opacity-90 transition-opacity">
    Primary Action
  </button>
  <button className="px-4 py-2 bg-base-300 text-base-content rounded-lg hover:opacity-90 transition-opacity">
    Secondary
  </button>
</div>`
  },
  {
    id: 'stats',
    name: 'Stats Grid',
    icon: '📊',
    content: `<div className="mt-4 grid grid-cols-2 gap-3">
  <div className="text-center">
    <div className="text-2xl font-bold text-primary">42</div>
    <div className="text-xs text-base-content/60">Projects</div>
  </div>
  <div className="text-center">
    <div className="text-2xl font-bold text-secondary">8.5k</div>
    <div className="text-xs text-base-content/60">Views</div>
  </div>
</div>`
  },
  {
    id: 'badges',
    name: 'Status Badges',
    icon: '🏷️',
    content: `<div className="mt-4 flex flex-wrap gap-2">
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
    Active
  </span>
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
    Featured
  </span>
</div>`
  },
  {
    id: 'progress',
    name: 'Progress Bar',
    icon: '📈',
    content: `<div className="mt-4 space-y-2">
  <div className="flex justify-between text-sm">
    <span>Progress</span>
    <span>75%</span>
  </div>
  <div className="w-full bg-base-200 rounded-full h-2">
    <div className="bg-primary h-2 rounded-full" style="width: 75%"></div>
  </div>
</div>`
  }
] as const;

const defaultImageUrl = 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80';

const colorLabels: Record<'primary'|'secondary'|'accent'|'background'|'text'|'title'|'description', string> = {
  primary: 'Primary Color',
  secondary: 'Secondary Color',
  accent: 'Accent Color',
  background: 'Background Color',
  text: 'Default Text Color',
  title: 'Title Text Color',
  description: 'Description Text Color'
};

/* ---------- CLI install helpers ---------- */

const packageManagers = [
  { id: 'pnpm', name: 'pnpm', icon: '📦', command: 'pnpm dlx virtual-ui@latest add parallax-card' },
  { id: 'npm', name: 'npm', icon: '📦', command: 'npx virtual-ui@latest add parallax-card' },
  { id: 'yarn', name: 'yarn', icon: '📦', command: 'yarn dlx virtual-ui@latest add parallax-card' },
  { id: 'bun', name: 'bun', icon: '📦', command: 'bunx virtual-ui@latest add parallax-card' }
] as const;

function InstallationTabs() {
  const [activeManager, setActiveManager] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('npm');
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
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [playgroundProps, setPlaygroundProps] = useState({
    title: 'Interactive Playground',
    description: 'Modify the props below to see changes in real-time!',
    variant: 'default' as Variant,
    parallaxSpeed: 10,
    imageEnabled: false,
    image: defaultImageUrl,
    customContent: {
      enabled: false,
      template: 'buttons',
      customCode: ''
    },
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#ffffff',
      text: '#000000',
      title: '#000000',
      description: '#000000'
    },
    className: ''
  });
  const [playgroundConfigTab, setPlaygroundConfigTab] = useState<'basic' | 'style' | 'colors' | 'animation' | 'custom'>('basic');

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
    setPlaygroundProps((p) => ({ ...p, ...{
      title: 'Interactive Playground',
      description: 'Modify the props below to see changes in real-time!',
      variant: 'default',
      parallaxSpeed: 10,
      imageEnabled: false,
      className: '',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        background: '#ffffff',
        text: '#000000',
        title: '#000000',
        description: '#000000'
      },
      customContent: {
        enabled: false,
        template: 'buttons',
        customCode: ''
      },
    }}));
  }

  function randomizeProps() {
    const variants: Variant[] = ['default', 'glass', 'gradient', 'shadow', 'neon'];
    const titles = ['Amazing Discovery', 'Creative Genius', 'Digital Innovation', 'Future Vision', 'Tech Mastery'];
    const descriptions = ['Discover the possibilities with this randomized configuration', 'Let creativity flow with unexpected combinations'];
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

    setPlaygroundProps({
      title: titles[Math.floor(Math.random() * titles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      variant: variants[Math.floor(Math.random() * variants.length)],
      parallaxSpeed: Math.floor(Math.random() * 20) + 1,
      imageEnabled: Math.random() > 0.5,
      image: defaultImageUrl,
      customContent: {
        enabled: Math.random() > 0.5,
        template: customContentTemplates[Math.floor(Math.random() * customContentTemplates.length)].id,
        customCode: ''
      },
      colors: {
        primary: colors[Math.floor(Math.random() * colors.length)],
        secondary: colors[Math.floor(Math.random() * colors.length)],
        accent: colors[Math.floor(Math.random() * colors.length)],
        background: colors[Math.floor(Math.random() * colors.length)],
        text: colors[Math.floor(Math.random() * colors.length)],
        title: colors[Math.floor(Math.random() * colors.length)],
        description: colors[Math.floor(Math.random() * colors.length)]
      },
      className: Math.random() > 0.7 ? 'border-2 border-dashed border-purple-500' : ''
    });
  }

  function copyCode() {
    const tpl = customContentTemplates.find(t => t.id === playgroundProps.customContent.template);
    const customContent = playgroundProps.customContent.enabled ? (playgroundProps.customContent.customCode || tpl?.content || '') : '';
    const code = `<ParallaxCard
  title="${playgroundProps.title}"
  description="${playgroundProps.description}"
  variant="${playgroundProps.variant}"
  parallaxSpeed={${playgroundProps.parallaxSpeed}}` +
  (playgroundProps.image ? `\n  image=\"${playgroundProps.image}\"` : '') +
  (playgroundProps.className ? `\n  className=\"${playgroundProps.className}\"` : '') +
  `
  onClick={() => console.log('Clicked!')}
  style={{
    '--primary': '${playgroundProps.colors.primary}',
    '--secondary': '${playgroundProps.colors.secondary}',
    '--accent': '${playgroundProps.colors.accent}'
  }}
>${customContent ? '\n  ' + customContent.replace(/\n/g, '\n  ') : ''}
</ParallaxCard>`;
    navigator.clipboard.writeText(code);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  }

  const isModified = playgroundProps.title !== 'Interactive Playground' ||
    playgroundProps.description !== 'Modify the props below to see changes in real-time!' ||
    playgroundProps.variant !== 'default' ||
    playgroundProps.parallaxSpeed !== 10 ||
    playgroundProps.colors.primary !== '#3b82f6' ||
    playgroundProps.customContent.enabled;

  function renderCustomContent() {
    if (!playgroundProps.customContent.enabled) return null;
    if (playgroundProps.customContent.customCode) {
      return <div dangerouslySetInnerHTML={{ __html: playgroundProps.customContent.customCode }} />;
    }
    const tpl = customContentTemplates.find(t => t.id === playgroundProps.customContent.template);
    if (!tpl) return null;
    switch (tpl.id) {
      case 'buttons':
        return (
          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-white text-sm" style={{ backgroundColor: playgroundProps.colors.primary }}>Primary Action</button>
            <button className="px-4 py-2 bg-[var(--base-300)] text-[var(--base-content)] rounded-lg hover:opacity-90 transition-opacity text-sm">Secondary</button>
          </div>
        );
      case 'stats':
        return (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: playgroundProps.colors.primary }}>42</div>
              <div className="text-xs text-[var(--base-content)]/60">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: playgroundProps.colors.secondary }}>8.5k</div>
              <div className="text-xs text-[var(--base-content)]/60">Views</div>
            </div>
          </div>
        );
      case 'badges':
        return (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>Active</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: playgroundProps.colors.accent }}>Featured</span>
          </div>
        );
      case 'progress':
        return (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm"><span>Progress</span><span>75%</span></div>
            <div className="w-full bg-[var(--base-200)] rounded-full h-2"><div className="h-2 rounded-full transition-all duration-300" style={{ width: '75%', backgroundColor: playgroundProps.colors.primary }}></div></div>
          </div>
        );
      default:
        return null;
    }
  }

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
                <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center"><span className="text-lg">🛠️</span></div>
                <div>
                  <h2 className="text-2xl font-semibold text-[var(--base-content)]">Live Playground</h2>
                  {isModified && <div className="flex items-center space-x-2 mt-1"><div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div><span className="text-xs text-orange-600 font-medium">Modified</span></div>}
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button onClick={randomizeProps} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2">🎲 Surprise Me</motion.button>
                <motion.button onClick={resetToDefaults} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 bg-[var(--base-200)] cursor-pointer hover:bg-[var(--base-300)] rounded-lg transition-colors flex items-center gap-2">🔄 Reset All</motion.button>
              </div>
            </div>

            <p className="text-[var(--base-content)]/80 mb-8"><strong>🚀 Real-time experimentation!</strong> Configure every aspect of the ParallaxCard and see changes instantly. From basic props to advanced styling and custom content.</p>

            {/* grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* left column - controls */}
              <div className="space-y-6">
                <h3 className="font-semibold text-[var(--base-content)] flex items-center gap-2">⚙️ Configuration Panel</h3>

                {/* tabs for control groups */}
                <div className="flex space-x-2 mt-4 mb-2">
                  {(['basic','style','colors','animation','custom'] as const).map((tab) => (
                    <button key={tab} onClick={() => setPlaygroundConfigTab(tab)} className={clsx('px-3 py-1 rounded-t-lg cursor-pointer', playgroundConfigTab===tab? 'bg-[var(--accent)] text-white':'bg-[var(--base-200)] text-[var(--base-content)] hover:bg-[var(--base-300)]')}>
                      {tab==='basic' && '📝 Content'}
                      {tab==='style' && '🎨 Style'}
                      {tab==='colors' && '🌈 Colors'}
                      {tab==='animation' && '⚡ Animation'}
                      {tab==='custom' && '🧩 Custom'}
                    </button>
                  ))}
                </div>

                {/* BASIC TAB */}
                {playgroundConfigTab==='basic' && (
                  <div className="bg-[var(--base-100)] rounded-lg p-4 border border-[var(--base-300)] space-y-4">
                    <h4 className="font-medium text-[var(--base-content)] mb-3 flex items-center gap-2">📝 Content</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--base-content)] mb-2">Title</label>
                        <input type="text" value={playgroundProps.title} onChange={(e)=>setPlaygroundProps(p=>({...p,title:e.target.value}))} className="w-full px-3 py-2 bg-[var(--base-100)] border border-[var(--base-300)] rounded-md text-[var(--base-content)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--base-content)] mb-2">Description</label>
                        <textarea rows={3} value={playgroundProps.description} onChange={(e)=>setPlaygroundProps(p=>({...p,description:e.target.value}))} className="w-full px-3 py-2 bg-[var(--base-100)] border border-[var(--base-300)] rounded-md text-[var(--base-content)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none" />
                      </div>
                      <label className="flex items-center space-x-2"><input type="checkbox" checked={playgroundProps.imageEnabled} onChange={(e)=>setPlaygroundProps(p=>({...p,imageEnabled:e.target.checked}))} className="w-4 h-4 text-[var(--accent)] bg-[var(--base-100)] border-[var(--base-300)] rounded focus:ring-[var(--accent)]"/><span className="text-sm font-medium text-[var(--base-content)]">Enable Image</span></label>
                    </div>
                  </div>
                )}

                {/* STYLE TAB */}
                {playgroundConfigTab==='style' && (
                  <div className="bg-[var(--base-100)] rounded-lg p-4 border border-[var(--base-300)] space-y-4">
                    <h4 className="font-medium text-[var(--base-content)] mb-3 flex items-center gap-2">🎨 Style Variant</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {variantOptions.map((o)=>(
                        <motion.button key={o.value} onClick={()=>setPlaygroundProps(p=>({...p,variant:o.value}))} whileHover={{scale:1.02}} whileTap={{scale:0.98}} className={clsx('p-3 rounded-lg border-2 transition-all cursor-pointer', playgroundProps.variant===o.value? 'border-[var(--accent)] bg-[var(--accent)]/10':'border-[var(--base-300)] hover:border-[var(--accent)]/50 hover:bg-[var(--base-200)]')}>
                          <div className={`w-full h-8 rounded mb-2 bg-gradient-to-r ${o.gradient}`}></div>
                          <div className="text-left">
                            <div className="font-medium text-sm flex items-center gap-1"><span>{o.icon}</span><span>{o.label}</span></div>
                            <div className="text-xs text-[var(--base-content)]/60 mt-1">{o.description}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* COLORS TAB */}
                {playgroundConfigTab==='colors' && (
                  <div className="bg-[var(--base-100)] rounded-lg p-4 border border-[var(--base-300)] space-y-3">
                    <h4 className="font-medium text-[var(--base-content)] mb-3 flex items-center gap-2">🌈 Color Palette</h4>
                    {Object.entries(playgroundProps.colors).map(([key,color])=> (
                      <div key={key} className="flex items-center justify-between p-3 bg-[var(--base-200)] rounded-md border border-[var(--base-300)] hover:bg-[var(--base-300)]">
                        <div className="flex items-center gap-3"><div className="w-6 h-6 rounded" style={{backgroundColor:color}}></div><div><p className="text-sm font-medium text-[var(--base-content)]">{colorLabels[key as keyof typeof colorLabels]}</p><p className="text-xs font-mono text-[var(--base-content)]/80">{color}</p></div></div>
                        <input type="color" value={color} onChange={(e)=>setPlaygroundProps(p=>({...p,colors:{...p.colors,[key]:e.target.value}}))} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                      </div>
                    ))}
                  </div>
                )}

                {/* ANIMATION TAB */}
                {playgroundConfigTab==='animation' && (
                  <div className="bg-[var(--base-100)] rounded-lg p-4 border border-[var(--base-300)] space-y-4">
                    <h4 className="font-medium text-[var(--base-content)] mb-3 flex items-center gap-2">⚡ Animation</h4>
                    <label className="block text-sm font-medium text-[var(--base-content)] mb-2">Parallax Speed: <span className="text-[var(--accent)]">{playgroundProps.parallaxSpeed}</span></label>
                    <input type="range" min={1} max={20} value={playgroundProps.parallaxSpeed} onChange={(e)=>setPlaygroundProps(p=>({...p,parallaxSpeed:parseInt(e.target.value)}))} className="w-full h-2 bg-[var(--base-200)] rounded-lg appearance-none cursor-pointer" />
                  </div>
                )}

                {/* CUSTOM TAB */}
                {playgroundConfigTab==='custom' && (
                  <div className="bg-[var(--base-100)] rounded-lg p-4 border border-[var(--base-300)] space-y-4">
                    <h4 className="font-medium text-[var(--base-content)] mb-3 flex items-center gap-2">🧩 Custom Content</h4>
                    <label className="flex items-center space-x-3"><input type="checkbox" checked={playgroundProps.customContent.enabled} onChange={(e)=>setPlaygroundProps(p=>({...p,customContent:{...p.customContent,enabled:e.target.checked}}))} className="w-4 h-4 text-[var(--accent)] bg-[var(--base-100)] border-[var(--base-300)] rounded focus:ring-[var(--accent)]"/><span className="text-sm font-medium text-[var(--base-content)]">Enable custom content</span></label>
                    {playgroundProps.customContent.enabled && (
                      <div>
                        <label className="block text-sm font-medium text-[var(--base-content)] mb-2">Content Template</label>
                        <div className="grid grid-cols-2 gap-2">
                          {customContentTemplates.map((tpl)=> (
                            <motion.button key={tpl.id} onClick={()=>setPlaygroundProps(p=>({...p,customContent:{...p.customContent,template:tpl.id,customCode:''}}))} whileHover={{scale:1.02}} whileTap={{scale:0.98}} className={clsx('p-3 rounded-lg border text-left cursor-pointer transition-all', playgroundProps.customContent.template===tpl.id?'border-[var(--accent)] bg-[var(--accent)]/10':'border-[var(--base-300)] hover:border-[var(--accent)]/50')}> <div className="flex items-center gap-2 mb-1"><span>{tpl.icon}</span><span className="text-sm font-medium">{tpl.name}</span></div> </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* right column - live preview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between"><h3 className="font-semibold text-[var(--base-content)] flex items-center gap-2">🎬 Live Preview</h3><div className="flex items-center gap-2 text-xs text-[var(--base-content)]/60"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span>Real-time updates</span></div></div>

                <div className="bg-gradient-to-br from-[var(--base-200)] to-[var(--base-300)] rounded-xl p-8 min-h-[500px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5"><div className="absolute inset-0" style={{ backgroundImage:'radial-gradient(circle at 1px 1px, var(--base-content) 1px, transparent 0)', backgroundSize:'20px 20px'}}></div></div>

                  <div className="relative z-10 max-w-sm w-full">
                    <ParallaxCard title={playgroundProps.title} description={playgroundProps.description} titleColor={playgroundProps.colors.title} descriptionColor={playgroundProps.colors.description} variant={playgroundProps.variant} parallaxSpeed={playgroundProps.parallaxSpeed} image={playgroundProps.imageEnabled?playgroundProps.image:undefined} className={playgroundProps.className || undefined} onClick={()=>alert('🎉 Card clicked!')} style={{ '--primary':playgroundProps.colors.primary,'--secondary':playgroundProps.colors.secondary,'--accent':playgroundProps.colors.accent, backgroundColor:playgroundProps.colors.background, color:playgroundProps.colors.text } as React.CSSProperties}>{renderCustomContent()}</ParallaxCard>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs"><div className="flex items-center gap-4"><span>Speed: {playgroundProps.parallaxSpeed}</span><span>Variant: {playgroundProps.variant}</span>{playgroundProps.customContent.enabled && <span>Custom: ✓</span>}</div></div>
                </div>

                {/* generated code */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><h4 className="font-medium text-[var(--base-content)] flex items-center gap-2">📋 Generated Code</h4><motion.button onClick={copyCode} whileHover={{scale:1.02}} whileTap={{scale:0.98}} className={clsx('px-3 py-2 rounded-lg text-sm cursor-pointer transition-all flex items-center gap-2', copyFeedback?'bg-green-100 text-green-800 border border-green-300':'bg-[var(--base-200)] hover:bg-[var(--base-300)] text-[var(--base-content)]')}>{copyFeedback?<>✅<span>Copied!</span></>:<>📋<span>Copy Code</span></>}</motion.button></div>

                  <pre className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-4 text-xs overflow-x-auto max-h-64"><code className="text-[var(--base-content)] whitespace-pre-wrap">{(()=>{const tpl=customContentTemplates.find(t=>t.id===playgroundProps.customContent.template);const custom=playgroundProps.customContent.enabled?(playgroundProps.customContent.customCode||tpl?.content||''):'';let snippet = `<ParallaxCard\n  title=\"${playgroundProps.title}\"\n  description=\"${playgroundProps.description}\"\n  variant=\"${playgroundProps.variant}\"\n  parallaxSpeed={${playgroundProps.parallaxSpeed}}`; if(playgroundProps.image){snippet += `\n  image=\"${playgroundProps.image}\"`; } if(playgroundProps.className){snippet += `\n  className=\"${playgroundProps.className}\"`; } snippet += `\n  onClick={() => console.log('Clicked!')}\n  style={{\n    '--primary': '${playgroundProps.colors.primary}',\n    '--secondary': '${playgroundProps.colors.secondary}',\n    '--accent': '${playgroundProps.colors.accent}'\n  }}\n>`; if(custom){ snippet += `\n  ${custom.replace(/\n/g,'\n  ')}`; } snippet += `\n</ParallaxCard>`; return snippet;})()}</code></pre>
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
          <p className="text-xs text-[var(--base-content)]/60 mt-3">✨ This will automatically install dependencies and add the component to your project</p>
        </div>
      </section>

      {/* ---------- VARIANT DEMOS ---------- */}
      {[
        {
          id: 'default',
          icon: '🎯',
          title: 'Default Variant',
          description: 'Clean and minimal design',
          variant: 'default' as Variant,
          speed: 8,
          notes: [
            'Perfect for: Corporate websites, professional portfolios',
            'Performance: Lightweight with minimal visual effects',
            'Accessibility: High contrast, screen reader friendly'
          ]
        },
        {
          id: 'glass',
          icon: '🔮',
          title: 'Glass Morphism',
          description: 'Frosted glass effect with backdrop blur',
          variant: 'glass' as Variant,
          speed: 10,
          notes: [
            'Perfect for: Modern apps, creative portfolios, dashboards',
            'Browser Support: Webkit (Safari), Chromium browsers',
            'Performance: Uses backdrop-filter (GPU accelerated)'
          ]
        },
        {
          id: 'gradient',
          icon: '🌈',
          title: 'Gradient Masterpiece',
          description: 'Eye-catching gradients for maximum impact',
          variant: 'gradient' as Variant,
          speed: 8,
          notes: [
            'Perfect for: Marketing sites, call-to-action cards, hero sections',
            'Customization: Easily change gradient colors via CSS variables',
            'Performance: CSS gradients are hardware accelerated'
          ]
        },
        {
          id: 'shadow',
          icon: '⚫',
          title: 'Deep Shadow',
          description: 'Pronounced shadows create impressive depth',
          variant: 'shadow' as Variant,
          speed: 12,
          notes: [
            'Perfect for: Material design, card layouts, product showcases',
            'Design: Multiple shadow layers for realistic depth',
            'Performance: CSS box-shadow optimized for smooth animation'
          ]
        },
        {
          id: 'neon',
          icon: '⚡',
          title: 'Neon Glow',
          description: 'Glowing neon borders perfect for gaming',
          variant: 'neon' as Variant,
          speed: 15,
          notes: [
            'Perfect for: Gaming UIs, tech products, cyberpunk themes',
            'Effects: Animated glow, pulsing borders, neon colors',
            'Performance: Uses CSS animations with will-change optimization'
          ]
        }
      ].map((demo) => (
        <section key={demo.id} id={demo.id} className="scroll-mt-20 space-y-4">
          <div>
            <h4 className="text-xl font-semibold text-[var(--base-content)]">{demo.icon} {demo.title}</h4>
            <p className="text-[var(--base-content)]/70">{demo.description}</p>
          </div>
          <div className="bg-[var(--base-200)] rounded-lg p-8">
            <div className="max-w-sm mx-auto">
              <ParallaxCard title={demo.title} description={demo.description} variant={demo.variant} parallaxSpeed={demo.speed} />
            </div>
          </div>
          <div className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-4">
            <h5 className="font-medium text-[var(--base-content)] mb-2">💡 Developer Notes</h5>
            <ul className="text-sm text-[var(--base-content)]/80 space-y-1">
              {demo.notes.map((note) => (<li key={note}>• {note}</li>))}
            </ul>
          </div>
        </section>
      ))}

      {/* ---------- SPEED LAB ---------- */}
      <section className="space-y-4">
        <div>
          <h4 className="text-xl font-semibold text-[var(--base-content)]">🚀 Speed Laboratory</h4>
          <p className="text-[var(--base-content)]/70">Compare different parallax speeds</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{label:'🐌 Subtle (5)',speed:5,variant:'default'},{label:'⚖️ Balanced (10)',speed:10,variant:'glass'},{label:'💫 Dynamic (18)',speed:18,variant:'neon'}].map((cfg)=>(
            <div key={cfg.speed} className="space-y-3">
              <h5 className="font-medium text-center">{cfg.label}</h5>
              <div className="bg-[var(--base-200)] rounded-lg p-6">
                <ParallaxCard title={cfg.label} description="Speed demo" variant={cfg.variant as Variant} parallaxSpeed={cfg.speed} />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800"><strong>⚠️ Performance Warning:</strong> Higher speeds (15+) may impact performance on lower-end devices.</p>
        </div>
      </section>

      {/* ---------- IMAGE INTEGRATION ---------- */}
      <section className="space-y-4">
        <div>
          <h4 className="text-xl font-semibold text-[var(--base-content)]">🖼️ Image Integration</h4>
          <p className="text-[var(--base-content)]/70">Images become part of the 3D effect</p>
        </div>
        <div className="bg-[var(--base-200)] rounded-lg p-8">
          <div className="max-w-sm mx-auto">
            <ParallaxCard title="Image Parallax" description="Images participate in the 3D transformation." image="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80" variant="default" parallaxSpeed={8} />
          </div>
        </div>
        <div className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-4">
          <h5 className="font-medium text-[var(--base-content)] mb-2">💡 Developer Notes</h5>
          <ul className="text-sm text-[var(--base-content)]/80 space-y-1">
            <li>• Images are lazy-loaded and optimized</li>
            <li>• Alt text generated from title prop</li>
            <li>• Image participates in 3D translateZ transform</li>
          </ul>
        </div>
      </section>
    </div>
  );
} 