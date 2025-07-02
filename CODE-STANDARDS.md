# 🧩 Theme & Code Standards (Next.js + Tailwind) — **ALWAYS FOLLOW**

## 🌐 Language Rule — EVERYTHING IN ENGLISH

- ✅ All code must be written in **English**
- ✅ Variable names, function names, component names: **English only**
- ✅ Comments, documentation, commit messages: **in English**

> 🧠 This ensures consistency, collaboration with global developers, and long-term maintainability

---

## 🎨 Color Variables — MANDATORY USAGE

### ✅ How to Use Properly:
- **Always** use `var(--variable-name)` in CSS or Tailwind classes like `bg-[var(--name)]`
- **Never** use hardcoded colors (`#fff`, `rgb(...)`, etc)
- Always match `background` and its respective `content color`  
  (e.g., `bg-[var(--base-100)]` with `text-[var(--content-base-100)]`)
- For borders, **only** use the `--border` variable
- Use `--radius` variable for consistent border radius (e.g., `1rem`)

### 🌈 Background Hierarchy:
- `--base-100`: Primary background (page base color)
- `--base-200`: Secondary background (cards, modals, containers)
- `--base-300`: Tertiary background (borders, dividers, visual details)

---

## 🎯 General UI/UX Rules

- 🔁 **Always follow the `cupcake` theme** or your defined design system
- 🎯 **Use the 8pt grid design system** for spacing, padding, and margins
- 🎨 **Never use arbitrary values** like `gap-17`, `px-13`, etc.
- ✅ **Use 2px border** when needed for visual consistency
- 👁️ **Maintain contrast and readability** between background and content
- 📱 **Responsiveness is mandatory** — always design mobile-first

---

## 🧱 Componentization — Best Practices

### 🎯 When to Use Compound Components vs Simple Components

#### ✅ Use **Compound Components** when:
- Multiple sub-components need to **share complex state**
- Components have **tight coupling** and work together as a system
- You need **flexible composition** with multiple moving parts
- Examples: `Modal`, `Tabs`, `Accordion`, `Dropdown`, `Form`

#### ✅ Use **Simple Components** when:
- Component has a **single, clear responsibility**
- Configuration can be handled through **simple props**
- No complex internal state sharing is needed
- Examples: `Button`, `Card`, `Navbar`, `Avatar`, `Badge`

### 📦 Compound Components Pattern
Components should be built using the **Compound Component Pattern** when multiple parts interact with each other and need to share complex state.

#### Benefits:
- More flexibility for the dev
- Better reuse and intuitive organization
- More declarative components

#### Example:
```tsx
<Modal>
  <Modal.Trigger />
  <Modal.Content>
    <Modal.Title />
    <Modal.Description />
    <Modal.Footer />
  </Modal.Content>
</Modal>
```

#### Simple Component Example:
```tsx
<Navbar 
  brand={{ text: "Virtual UI", href: "/" }}
  menuItems={[
    { text: "Home", href: "/", isActive: true },
    { text: "Components", href: "/components" }
  ]}
  actions={[
    { text: "GitHub", variant: "ghost", href: "/github" },
    { text: "Get Started", variant: "primary", href: "/get-started" }
  ]}
/>
```

### 🎞️ Animations — Using Framer Motion

✅ All animations must be implemented using framer-motion

✅ Always use motion.div, motion.button, etc. to wrap elements with animations

✅ Keep animations smooth, purposeful, and subtle — avoid overwhelming effects

🔁 Use animate, initial, exit, transition to control entrance/exit animations

📱 Ensure animations perform well on all screen sizes and devices

Example:
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
>
  <Card />
</motion.div>
```
🧠 Consistent use of motion improves user experience and visual feedback.

### 🔧 Using clsx
Always use clsx() to dynamically combine classes in a clean and safe way

Instead of this:

```tsx
className={someCondition ? 'bg-red' : 'bg-blue'}
```
Use:

```tsx
className={clsx(someCondition && 'bg-red', !someCondition && 'bg-blue')}
```

## 🧼 Code Cleanliness
📚 Code should be easy to read, understand, and maintain

❌ Avoid unclear abbreviations or generic names like a, temp, data1

✅ Prioritize semantic, clear, and well-structured code

🔁 Remove dead code, console.log, and temporary snippets before committing

## 🧠 UI/UX Philosophy
🪄 Keep the user experience intuitive

🚫 Avoid unnecessary elements or confusing interactions

🧭 Follow well-known patterns (buttons, feedback, navigation)

🎯 Always provide visual feedback for user actions (hover, click, success, error)

