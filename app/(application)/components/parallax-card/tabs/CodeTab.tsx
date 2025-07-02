'use client';

import React from 'react';

export default function CodeTab() {
  return (
    <div className="space-y-6">
      <section id="examples" className="scroll-mt-20">
        <h3 className="text-lg font-semibold text-[var(--base-content)] mb-4">💡 Usage Examples</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Basic Usage</h4>
            <pre className="bg-[var(--base-200)] rounded-lg p-4 overflow-x-auto text-sm">
              <code>{`import { ParallaxCard } from './ParallaxCard';

export function Example() {
  return (
    <ParallaxCard
      title="Default Card"
      description="A clean and minimal card design."
      variant="default"
      parallaxSpeed={8}
      onClick={() => console.log('Card clicked')}
    />
  );
}`}</code>
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">With Custom Content</h4>
            <pre className="bg-[var(--base-200)] rounded-lg p-4 overflow-x-auto text-sm">
              <code>{`<ParallaxCard
  title="Custom Content"
  description="Cards can include any custom children."
  variant="gradient"
  parallaxSpeed={8}
>
  <div className="flex gap-2 mt-4">
    <button className="px-4 py-2 bg-white/20 rounded">
      Action
    </button>
    <button className="px-4 py-2 bg-black/20 rounded">
      Cancel
    </button>
  </div>
</ParallaxCard>`}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
} 