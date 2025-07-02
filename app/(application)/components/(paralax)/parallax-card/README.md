# ParallaxCard Component

A beautiful, interactive card component with 3D parallax effects and multiple visual variants. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🎭 **3D Parallax Effect**: Smooth mouse-responsive 3D transformations
- 🎨 **Multiple Variants**: 5 different visual styles (default, glass, gradient, shadow, neon)
- ♿ **Accessible**: Full keyboard navigation and screen reader support
- 📱 **Responsive**: Works seamlessly across all device sizes
- ⚡ **Performance Optimized**: Uses transform-gpu and will-change for smooth animations
- 🎯 **Customizable**: Extensive props for customization

## Installation

```bash
# The component is already included in this project
# Dependencies: motion, clsx, tailwindcss
```

## Basic Usage

```tsx
import { ParallaxCard } from '../_components/parallax-card';

function MyComponent() {
  return (
    <ParallaxCard
      title="My Card"
      description="A beautiful parallax card"
      onClick={() => console.log('Card clicked!')}
    />
  );
}
```

## Props

| Prop | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| `title` | `string` | Card title displayed prominently | ✅ | - |
| `description` | `string` | Optional description text | ❌ | `""` |
| `image` | `string` | URL for card image | ❌ | - |
| `parallaxSpeed` | `number` | Intensity of parallax effect (1-30) | ❌ | `10` |
| `variant` | `'default' \| 'glass' \| 'gradient' \| 'shadow' \| 'neon'` | Visual style variant | ❌ | `'default'` |
| `onClick` | `() => void` | Click handler function | ❌ | - |
| `style` | `React.CSSProperties` | Custom CSS styles | ❌ | `{}` |
| `children` | `React.ReactNode` | Custom content inside card | ❌ | - |
| `className` | `string` | Additional CSS classes | ❌ | - |

## Variants

### Default
Clean and minimal design with subtle shadows.
```tsx
<ParallaxCard title="Default" variant="default" />
```

### Glass
Frosted glass effect with backdrop blur.
```tsx
<ParallaxCard title="Glass" variant="glass" />
```

### Gradient
Beautiful gradient background from primary to accent colors.
```tsx
<ParallaxCard title="Gradient" variant="gradient" />
```

### Shadow
Pronounced shadows for enhanced depth.
```tsx
<ParallaxCard title="Shadow" variant="shadow" />
```

### Neon
Glowing neon borders with enhanced shadow effects.
```tsx
<ParallaxCard title="Neon" variant="neon" />
```

## Advanced Examples

### Card with Image
```tsx
<ParallaxCard
  title="Beautiful Card"
  description="With a stunning image"
  image="https://example.com/image.jpg"
  variant="glass"
  parallaxSpeed={15}
/>
```

### Card with Custom Content
```tsx
<ParallaxCard
  title="Custom Content"
  description="With buttons and actions"
  variant="default"
>
  <div className="flex gap-2 mt-4">
    <button className="btn-primary">Action</button>
    <button className="btn-secondary">Cancel</button>
  </div>
</ParallaxCard>
```

### Interactive Card
```tsx
<ParallaxCard
  title="Interactive"
  description="Click me!"
  variant="neon"
  parallaxSpeed={20}
  onClick={() => alert('Card clicked!')}
  className="hover:scale-110"
/>
```

## Accessibility Features

- **Keyboard Navigation**: Tab to focus, Enter/Space to activate
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and structure

## Performance Considerations

- Uses `transform-gpu` for hardware acceleration
- Implements `will-change` for smooth animations
- Optimized event handlers with `useCallback`
- Lazy loading for images

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers with CSS 3D transform support

## Customization

The component follows the project's design system using CSS variables:
- `--base-100`, `--base-200`, `--base-300` for backgrounds
- `--primary`, `--accent` for brand colors
- `--radius` for border radius
- `--border` for border width

## Tips

1. **Parallax Speed**: Use 5-15 for subtle effects, 15-25 for dramatic effects
2. **Performance**: Avoid very high parallax speeds on mobile devices
3. **Accessibility**: Always provide meaningful titles and descriptions
4. **Responsive**: Test on various screen sizes for optimal experience

## License

This component is part of the Virtual UI library and follows the project's license. 