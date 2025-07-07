# Virtual UI CLI

A powerful CLI to add beautiful and interactive components to your React project, inspired by shadcn.

## 🚀 Installation

```bash
# Install globally
npm install -g virtual-ui-cli

# Or use with npx (recommended)
npx virtual-ui@latest init
```

## 📋 Commands

### `init`

Initializes Virtual UI in your project.

```bash
npx virtual-ui init
```

**Options:**
- `-y, --yes` - Skips confirmations and uses default configuration

**What it does:**
- ✅ Automatically detects your framework (Next.js, React, etc.)
- ✅ Sets up Tailwind CSS if needed
- ✅ Installs required dependencies
- ✅ Creates configuration file
- ✅ Sets up import aliases
- ✅ Creates component directories

### `add`

Adds components to your project.

```bash
# Add a specific component
npx virtual-ui add parallax-card

# Add multiple components
npx virtual-ui add parallax-card button-glow

# Interactive mode (choose from list)
npx virtual-ui add
```

**Options:**
- `-y, --yes` - Skips confirmations
- `-o, --overwrite` - Overwrites existing files
- `-c, --cwd <path>` - Working directory
- `-p, --path <path>` - Custom path for components

**What it does:**
- ✅ Installs dependencies automatically
- ✅ Creates component files
- ✅ Updates Tailwind configuration if needed
- ✅ Adds global CSS if needed
- ✅ Keeps project structure organized

### `list`

Lists all available components.

```bash
npx virtual-ui list
```

## 🎨 Available Components

### ParallaxCard
Interactive card with 3D parallax effects and multiple visual variants.

**Dependencies:** `motion`, `clsx`

**Variants:**
- `default` - Clean and minimal design
- `glass` - Frosted glass effect
- `gradient` - Gradient background
- `shadow` - Pronounced shadows
- `neon` - Bright neon borders

**Usage example:**
```tsx
import { ParallaxCard } from '@/components/ui/parallax-card';

function MyComponent() {
  return (
    <ParallaxCard
      title="My Card"
      description="An amazing parallax effect card"
      variant="glass"
      parallaxSpeed={15}
      onClick={() => console.log('Clicked!')}
    />
  );
}
```

## ⚙️ Configuration

The CLI creates a `virtual-ui.json` file at your project root:

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "cssVariables": true,
    "baseColor": "slate"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

### Configuration Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `style` | `string` | Visual style (`default` \| `new-york`) | `"default"` |
| `rsc` | `boolean` | Use React Server Components | `true` |
| `tsx` | `boolean` | Use TypeScript | `true` |
| `tailwind.config` | `string` | Tailwind config path | `"tailwind.config.js"` |
| `tailwind.css` | `string` | Global CSS path | `"app/globals.css"` |
| `tailwind.cssVariables` | `boolean` | Use CSS variables | `true` |
| `aliases.components` | `string` | Components alias | `"@/components"` |
| `aliases.utils` | `string` | Utils alias | `"@/lib/utils"` |
| `aliases.ui` | `string` | UI components alias | `"@/components/ui"` |

## 🛠️ Supported Frameworks

- ✅ **Next.js** (App Router & Pages Router)
- ✅ **React** (Create React App, Vite)
- ✅ **Remix**
- ✅ **Astro**
- ✅ **Gatsby**

## 📦 Technologies

- **React** - UI Framework
- **TypeScript** - Static typing
- **Tailwind CSS** - CSS utilities
- **Framer Motion** - Smooth animations
- **Clsx** - Conditional classes

## 🎯 Why use Virtual UI?

### 🚀 **Productivity**
- Add components in seconds
- Zero manual configuration
- Automatic project detection

### 🎨 **Quality**
- Tested and accessible components
- Smooth and performant animations
- Modern and responsive design

### 🔧 **Flexibility**
- Fully customizable
- TypeScript out-of-the-box
- Multiple visual variants

### 📈 **Scalability**
- Clear organizational structure
- Smart import aliases
- Automatic dependency management

## 📚 Complete Examples

### Next.js Project

```bash
# 1. Create a Next.js project
npx create-next-app@latest my-app --typescript --tailwind --eslint

# 2. Navigate to the project
cd my-app

# 3. Initialize Virtual UI
npx virtual-ui init

# 4. Add components
npx virtual-ui add parallax-card
```

### Using components

```tsx
// app/page.tsx
import { ParallaxCard } from '@/components/ui/parallax-card';

export default function Home() {
  return (
    <main className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ParallaxCardimport { ParallaxCard } from '@/components/ui/parallax-card';

export default function Home() {
  return (
    <main className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ParallaxCard

          title="Product 1"
          description="Product description with parallax effect"
          image="https://example.com/image1.jpg"
          variant="glass"
          onClick={() => console.log('Product 1 clicked')}
        />
        
        <ParallaxCard
          title="Product 2"
          description="Another amazing product"
          variant="gradient"
          parallaxSpeed={20}
        >
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Buy
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded">
              See More
            </button>
          </div>
        </ParallaxCard>
      </div>
    </main>
  );
}
```

## 🔄 Migration

### From shadcn

If you already use shadcn, you can easily migrate:

```bash
# Your shadcn components keep working
# Just add Virtual UI components
npx virtual-ui add parallax-card
```

### From traditional libraries

```bash
# Remove old dependencies
npm uninstall old-ui-library

# Initialize Virtual UI
npx virtual-ui init

# Add components as needed
npx virtual-ui add parallax-card
```

## 🤝 Contributing

Contributions are welcome! To add new components:

1. Fork the repository
2. Create a feature branch
3. Add the component to the registry
4. Create tests and documentation
5. Open a Pull Request

## 📄 License

MIT © yuribodo

## 🆘 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yuribodo/virtual-ui/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yuribodo/virtual-ui/discussions)
- 📧 **Email**: support@virtual-ui.dev

---

**Made with ❤️ for the React community** 