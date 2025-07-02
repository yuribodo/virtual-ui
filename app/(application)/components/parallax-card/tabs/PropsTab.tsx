'use client';

import React from 'react';
import clsx from 'clsx';

export default function PropsTab() {
  const propsData = [
    { name: 'title', type: 'string', defaultVal: 'required', description: 'The main title text displayed on the card' },
    { name: 'description', type: 'string', defaultVal: 'undefined', description: 'Optional description text below the title' },
    { name: 'variant', type: "'default' | 'glass' | 'gradient' | 'shadow' | 'neon'", defaultVal: "'default'", description: 'Visual style variant of the card' },
    { name: 'parallaxSpeed', type: 'number', defaultVal: '10', description: 'Speed of the parallax effect (1-20)' },
    { name: 'image', type: 'string', defaultVal: 'undefined', description: 'Optional image URL' },
    { name: 'onClick', type: '() => void', defaultVal: 'undefined', description: 'Click handler function' },
    { name: 'children', type: 'React.ReactNode', defaultVal: 'undefined', description: 'Custom content inside the card' },
    { name: 'className', type: 'string', defaultVal: 'undefined', description: 'Additional CSS classes' },
  ];

  return (
    <div className="space-y-4">
      <section id="props" className="scroll-mt-20">
        <h3 className="text-lg font-semibold text-[var(--base-content)]">⚙️ Props Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg mt-4">
            <thead>
              <tr className="border-b border-[var(--base-300)] bg-[var(--base-200)]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--base-content)]">Prop</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--base-content)]">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--base-content)]">Default</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--base-content)]">Description</th>
              </tr>
            </thead>
            <tbody>
              {propsData.map((prop, index) => (
                <tr
                  key={prop.name}
                  className={clsx(
                    'border-b border-[var(--base-300)]/50',
                    index % 2 === 0 && 'bg-[var(--base-50)]'
                  )}
                >
                  <td className="py-3 px-4 text-sm font-mono text-[var(--primary)]">{prop.name}</td>
                  <td className="py-3 px-4 text-sm font-mono text-[var(--base-content)]/80">{prop.type}</td>
                  <td className="py-3 px-4 text-sm font-mono text-[var(--base-content)]/60">{prop.defaultVal}</td>
                  <td className="py-3 px-4 text-sm text-[var(--base-content)]/80">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="performance" className="scroll-mt-20">
        <h3 className="text-lg font-semibold text-[var(--base-content)] mb-4">🚀 Performance Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-6">
            <h4 className="font-semibold mb-3 text-green-600">✅ Best Practices</h4>
            <ul className="text-sm text-[var(--base-content)]/80 space-y-2">
              <li>• Use GPU acceleration with transform3d</li>
              <li>• Parallax speed 5-12 for optimal performance</li>
              <li>• Debounce mouse events for smoother animation</li>
              <li>• Use will-change CSS property sparingly</li>
            </ul>
          </div>

          <div className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-6">
            <h4 className="font-semibold mb-3 text-orange-600">⚠️ Considerations</h4>
            <ul className="text-sm text-[var(--base-content)]/80 space-y-2">
              <li>• Test on mobile devices for battery impact</li>
              <li>• Higher speeds (15+) may affect low-end devices</li>
              <li>• Consider reduced motion preferences</li>
              <li>• Monitor frame rate with many cards</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
} 