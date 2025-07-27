'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

interface ComponentItem {
  id: string;
  name: string;
  description: string;
  href: string;
  category: string;
}

interface Category {
  name: string;
  components: ComponentItem[];
}

const componentsData: Category[] = [
  {
    name: 'Buttons',
    components: [
      { 
        id: 'button-liquid', 
        name: 'Button Liquid', 
        description: 'Button with liquid ripple effect', 
        href: '/components/button-liquid',
        category: 'buttons' 
      },
    ]
  },
  {
    name: 'Interactive',
    components: [
      { 
        id: 'parallax-card', 
        name: 'Parallax Card', 
        description: 'Interactive 3D parallax card', 
        href: '/components/parallax-card',
        category: 'interactive' 
      },
    ]
  }
];

export function ComponentsSidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Buttons', 'Interactive']);
  const pathname = usePathname();

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="sticky top-24">
      <div className="space-y-1">
        <div className="px-3 py-2 mb-4">
          <h2 className="text-lg font-semibold text-[var(--base-content)]">Components</h2>
          <p className="text-sm text-[var(--base-content)]/70 mt-1">
            Reusable UI components for your projects
          </p>
        </div>

        {componentsData.map((category) => {
          const isExpanded = expandedCategories.includes(category.name);
          
          return (
            <div key={category.name} className="space-y-1">
              <button
                onClick={() => toggleCategory(category.name)}
                className={clsx(
                  'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-sm cursor-pointer',
                  'text-[var(--base-content)] hover:bg-[var(--base-200)]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2',
                  'transition-colors duration-200'
                )}
              >
                <span>{category.name}</span>
                <svg
                  className={clsx(
                    'w-4 h-4 transition-transform duration-200',
                    isExpanded ? 'rotate-90' : 'rotate-0'
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="ml-4 mt-2 space-y-2">
                  {category.components.map((component) => (
                    <Link
                      key={component.id}
                      href={component.href}
                      className={clsx(
                        'block w-full text-left px-3 py-2 text-sm rounded-md cursor-pointer',
                        'transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2',
                        pathname === component.href
                          ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                          : 'text-[var(--base-content)]/80 hover:bg-[var(--base-200)] hover:text-[var(--base-content)]'
                      )}
                    >
                      <div className="font-medium">{component.name}</div>
                      <div className="text-xs opacity-70 mt-0.5">{component.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 