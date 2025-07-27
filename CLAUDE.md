# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Virtual UI is a React component library built with Next.js, Tailwind CSS, and TypeScript. It consists of two main parts:
1. **Main Website/Documentation** (`/app`) - Next.js 15 application showcasing components with live previews
2. **CLI Tool** (`/cli`) - NPM package for adding components to user projects

## Key Development Commands

### Main Application
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application  
- `npm run lint` - Run ESLint for code quality
- `npm run start` - Start production server
- `npm run preview` - Build and preview with OpenNext for Cloudflare
- `npm run deploy` - Deploy to Cloudflare Pages
- `npm run cf-typegen` - Generate Cloudflare environment types

### CLI Tool (in `/cli` directory)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm run publish:patch` - Version bump patch and publish
- `npm run publish:minor` - Version bump minor and publish

## Architecture & Code Structure

### Application Structure
- `app/(application)/` - Main application routes using Next.js App Router
- `app/(application)/_components/` - Shared components (hero, navbar, icons)
- `app/(application)/components/` - Component documentation pages with Preview/Code/Props tabs
- `app/globals.css` - CSS custom properties defining the cupcake theme color system
- `cli/` - Standalone CLI package for component installation

### Component Architecture
The project follows a **dual component pattern**:

1. **Compound Components** - For complex, stateful components that need flexible composition (Modal, Tabs, etc.)
   ```tsx
   <Modal>
     <Modal.Trigger />
     <Modal.Content>
       <Modal.Title />
       <Modal.Description />
     </Modal.Content>
   </Modal>
   ```

2. **Simple Components** - For single-responsibility components configured via props (Button, Navbar, etc.)
   ```tsx
   <Navbar 
     brand={{ text: "Virtual UI", href: "/" }}
     menuItems={[{ text: "Home", href: "/" }]}
   />
   ```

### Theme System
- Uses CSS custom properties with `var(--variable-name)` syntax
- **MANDATORY**: Always use color variables, never hardcoded colors
- Background hierarchy: `--base-100` (primary) → `--base-200` (secondary) → `--base-300` (tertiary)
- Border radius: `--radius` variable (1rem)
- Border width: `--border` variable (2px)

### Code Standards (from CODE-STANDARDS.md)
- **Language**: All code, comments, and documentation in English
- **Styling**: Use `clsx()` for conditional classes
- **Animations**: All animations via Framer Motion (`motion.*` components)
- **Spacing**: 8pt grid system (avoid arbitrary values like `gap-17`)
- **Mobile-first**: Responsive design is mandatory

### Key Files
- `app/layout.tsx:31-49` - Global Navbar configuration
- `app/globals.css:3-50` - Color system and theme variables  
- `app/(application)/components/page.tsx` - Components documentation landing page
- `cli/src/commands/` - CLI command implementations (add, init, list)

## CLI Tool Integration
The CLI (`virtual-ui-cli`) allows users to add components to their projects:
- `virtual-ui init` - Initialize project configuration
- `virtual-ui add [component]` - Add specific component
- `virtual-ui list` - List available components

Components are fetched from GitHub registry and automatically configured for the user's project setup.

## Development Workflow
1. Create components in `app/(application)/components/`
2. Follow compound vs simple component patterns based on complexity
3. Use CSS variables for all styling
4. Add documentation with Preview/Code/Props tabs
5. Test with `npm run dev` and `npm run lint`
6. CLI components should be added to the registry for distribution