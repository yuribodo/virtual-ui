'use client';

import React, { useState } from 'react';

export default function ComponentsPage() {
  const [selectedComponent, setSelectedComponent] = useState('navbar');

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--base-300)] pb-6">
        <h1 className="text-3xl font-bold text-[var(--base-content)]">Components</h1>
        <p className="text-[var(--base-content)]/70 mt-2">
          Discover our collection of reusable UI components with live previews, code examples, and complete documentation.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--base-content)]">Getting Started</h2>
        <div className="bg-[var(--base-200)] rounded-lg p-6 space-y-4">
          <p className="text-[var(--base-content)]/80">
            Welcome to the Virtual UI component library! Each component includes:
          </p>
          <ul className="space-y-2 text-[var(--base-content)]/80">
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[var(--primary)] rounded-full"></span>
              <span><strong>Live Preview:</strong> Interactive demonstrations of each component</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[var(--primary)] rounded-full"></span>
              <span><strong>Code Examples:</strong> Copy-paste ready code snippets</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[var(--primary)] rounded-full"></span>
              <span><strong>Props Documentation:</strong> Complete API reference</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-[var(--primary)] rounded-full"></span>
              <span><strong>Responsive Design:</strong> Built with mobile-first approach</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--base-content)]">Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-4">
            <h3 className="font-medium text-[var(--base-content)] mb-2">Browse Components</h3>
            <p className="text-sm text-[var(--base-content)]/70">
              Use the sidebar on the left to browse through different component categories. 
              Click on any component to view its documentation.
            </p>
          </div>
          <div className="bg-[var(--base-100)] border border-[var(--base-300)] rounded-lg p-4">
            <h3 className="font-medium text-[var(--base-content)] mb-2">Search & Filter</h3>
            <p className="text-sm text-[var(--base-content)]/70">
              Components are organized by categories like Interactive, Layout, Forms, and more. 
              Each category can be expanded to reveal available components.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--base-content)]">Quick Start</h2>
        <div className="bg-[var(--base-200)] rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--primary-content)] text-sm font-medium">
              1
            </div>
            <div>
              <h4 className="font-medium text-[var(--base-content)]">Choose a Component</h4>
              <p className="text-sm text-[var(--base-content)]/70 mt-1">
                Browse the sidebar and click on any component that interests you.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--base-200)] rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--primary-content)] text-sm font-medium">
              2
            </div>
            <div>
              <h4 className="font-medium text-[var(--base-content)]">Explore the Tabs</h4>
              <p className="text-sm text-[var(--base-content)]/70 mt-1">
                Each component page has Preview, Code, and Props tabs for complete documentation.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--base-200)] rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--primary-content)] text-sm font-medium">
              3
            </div>
            <div>
              <h4 className="font-medium text-[var(--base-content)]">Copy and Implement</h4>
              <p className="text-sm text-[var(--base-content)]/70 mt-1">
                Use the copy button in the Code tab to grab the component code and start using it in your project.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-[var(--base-content)] mb-2">Ready to Get Started?</h3>
        <p className="text-[var(--base-content)]/70 mb-4">
          Start exploring our components by selecting one from the sidebar.
        </p>
        <div className="text-sm text-[var(--primary)] font-medium">
          ← Select a component from the sidebar to begin
        </div>
      </div>
    </div>
  );
}
