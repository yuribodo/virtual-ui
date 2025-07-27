'use client';

import React from 'react';
import clsx from 'clsx';

const props = [
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    default: undefined,
    description: 'The content to display inside the button. Can be text, icons, or any React elements.'
  },
  {
    name: 'variant',
    type: "'solid' | 'outline' | 'ghost' | 'gradient'",
    required: false,
    default: "'solid'",
    description: 'Visual style variant of the button. Controls background, borders, and hover effects.'
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg' | 'xl'",
    required: false,
    default: "'md'",
    description: 'Size of the button affecting padding, font size, and overall dimensions.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'When true, disables the button and prevents all interactions including ripple effects.'
  },
  {
    name: 'loading',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Shows a loading spinner and disables interactions while maintaining button structure.'
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    default: 'undefined',
    description: 'Additional CSS classes to apply to the button element.'
  },
  {
    name: 'rippleColor',
    type: 'string',
    required: false,
    default: "'rgba(255, 255, 255, 0.6)'",
    description: 'Color of the liquid ripple effect. Accepts any valid CSS color value.'
  },
  {
    name: 'rippleDuration',
    type: 'number',
    required: false,
    default: '600',
    description: 'Duration of the ripple animation in milliseconds. Range: 200-1000ms recommended.'
  },
  {
    name: 'onClick',
    type: '(e: MouseEvent<HTMLButtonElement>) => void',
    required: false,
    default: 'undefined',
    description: 'Click event handler. Called after the ripple effect is created.'
  },
  {
    name: 'type',
    type: "'button' | 'submit' | 'reset'",
    required: false,
    default: "'button'",
    description: 'HTML button type attribute. Use "submit" for form submission.'
  },
  {
    name: 'style',
    type: 'React.CSSProperties',
    required: false,
    default: 'undefined',
    description: 'Inline styles to apply to the button. Can include CSS custom properties for theming.'
  }
];

const variants = [
  {
    name: 'solid',
    description: 'Filled button with solid background',
    usage: 'Primary actions, call-to-action buttons',
    appearance: 'Solid background with hover scale and ripple effect'
  },
  {
    name: 'outline',
    description: 'Button with border only, fills on hover',
    usage: 'Secondary actions, less prominent buttons',
    appearance: 'Transparent background with border, fills on hover'
  },
  {
    name: 'ghost',
    description: 'Minimal button with no background',
    usage: 'Tertiary actions, navigation buttons, subtle interactions',
    appearance: 'Transparent with subtle hover background'
  },
  {
    name: 'gradient',
    description: 'Eye-catching gradient background',
    usage: 'Hero sections, premium features, highlights',
    appearance: 'Gradient from primary to secondary color'
  }
];

const sizes = [
  {
    name: 'sm',
    description: 'Small button for compact interfaces',
    dimensions: 'px-3 py-1.5 text-sm',
    usage: 'Form controls, table actions, dense layouts'
  },
  {
    name: 'md',
    description: 'Standard medium size',
    dimensions: 'px-4 py-2 text-base',
    usage: 'Most common use case, general purpose buttons'
  },
  {
    name: 'lg',
    description: 'Large button for prominent actions',
    dimensions: 'px-6 py-3 text-lg',
    usage: 'Main actions, important buttons, mobile interfaces'
  },
  {
    name: 'xl',
    description: 'Extra large for hero sections',
    dimensions: 'px-8 py-4 text-xl',
    usage: 'Call-to-action, landing pages, hero buttons'
  }
];

export default function PropsTab() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[var(--base-content)]">API Reference</h2>
        <p className="text-[var(--base-content)]/70 mt-1">
          Complete props documentation and configuration options
        </p>
      </div>

      {/* Props Table */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-[var(--base-content)]">Props</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-[var(--base-300)] rounded-lg overflow-hidden">
            <thead className="bg-[var(--base-200)]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--base-content)]">
                  Property
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--base-content)]">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--base-content)]">
                  Default
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--base-content)]">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--base-300)]">
              {props.map((prop, index) => (
                <tr key={prop.name} className={clsx(
                  index % 2 === 0 ? 'bg-[var(--base-100)]' : 'bg-[var(--base-50)]'
                )}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-medium text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded">
                        {prop.name}
                      </code>
                      {prop.required && (
                        <span className="text-xs text-red-600 font-medium">*</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm text-[var(--base-content)]/80 bg-[var(--base-200)] px-2 py-1 rounded font-mono">
                      {prop.type}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm text-[var(--base-content)]/60 bg-[var(--base-200)] px-2 py-1 rounded">
                      {prop.default || 'undefined'}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--base-content)]/80">
                    {prop.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--base-content)]/60">
          * Required props
        </p>
      </section>

      {/* Variants Documentation */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-[var(--base-content)]">Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {variants.map((variant) => (
            <div key={variant.name} className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm font-medium text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded">
                  {variant.name}
                </code>
              </div>
              <p className="text-sm text-[var(--base-content)] mb-2">
                {variant.description}
              </p>
              <div className="space-y-1 text-xs text-[var(--base-content)]/70">
                <p><strong>Best for:</strong> {variant.usage}</p>
                <p><strong>Appearance:</strong> {variant.appearance}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sizes Documentation */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-[var(--base-content)]">Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sizes.map((size) => (
            <div key={size.name} className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm font-medium text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded">
                  {size.name}
                </code>
              </div>
              <p className="text-sm text-[var(--base-content)] mb-2">
                {size.description}
              </p>
              <div className="space-y-1 text-xs text-[var(--base-content)]/70">
                <p><strong>Dimensions:</strong> <code className="bg-[var(--base-200)] px-1 rounded">{size.dimensions}</code></p>
                <p><strong>Best for:</strong> {size.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CSS Variables */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-[var(--base-content)]">CSS Variables</h3>
        <p className="text-[var(--base-content)]/70">
          Customize the button appearance using CSS custom properties:
        </p>
        <div className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-4">
          <pre className="text-sm text-[var(--base-content)] overflow-x-auto">
            <code>{`/* Primary theme colors */
--primary: oklch(42% 0.095 57.708);
--primary-content: oklch(100% 0 0);
--secondary: oklch(55% 0.135 66.442);
--secondary-content: oklch(100% 0 0);

/* Border and spacing */
--radius: 1rem;
--border: 2px;

/* Custom styling example */
.custom-button {
  --primary: #8b5cf6;
  --secondary: #ec4899;
  --radius: 0.5rem;
}`}</code>
          </pre>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-[var(--base-content)]">Accessibility</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Built-in Accessibility Features</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Proper focus management with visible focus indicators</li>
            <li>• ARIA compliant button semantics</li>
            <li>• Keyboard navigation support (Enter and Space)</li>
            <li>• Screen reader friendly states (loading, disabled)</li>
            <li>• High contrast mode compatibility</li>
            <li>• Reduced motion respect for ripple animations</li>
          </ul>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-[var(--base-content)]">Best Practices</h3>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">✅ Do</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Use <code className="bg-green-100 px-1 rounded">variant="solid"</code> for primary actions</li>
              <li>• Provide meaningful button text or aria-label for icon buttons</li>
              <li>• Use loading state for async operations</li>
              <li>• Keep ripple duration between 400-800ms for best UX</li>
              <li>• Use appropriate sizes for your interface density</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">❌ Don't</h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Don't use multiple solid buttons in the same section</li>
              <li>• Avoid extremely fast ripple durations (&lt; 200ms)</li>
              <li>• Don't disable buttons without providing feedback</li>
              <li>• Avoid using gradient variant for multiple buttons</li>
              <li>• Don't ignore loading states for async actions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TypeScript */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-[var(--base-content)]">TypeScript Support</h3>
        <p className="text-[var(--base-content)]/70">
          Full TypeScript support with proper type definitions:
        </p>
        <div className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-4">
          <pre className="text-sm text-[var(--base-content)] overflow-x-auto">
            <code>{`import { ButtonLiquid, ButtonLiquidProps } from './ButtonLiquid';

// Type-safe props
const buttonProps: ButtonLiquidProps = {
  variant: 'solid',
  size: 'lg',
  rippleColor: 'rgba(255, 0, 0, 0.5)',
  onClick: (e: MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked:', e);
  }
};

// Usage with TypeScript
<ButtonLiquid {...buttonProps}>
  Click me
</ButtonLiquid>`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}