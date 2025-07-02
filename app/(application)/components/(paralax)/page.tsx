'use client';

import { ParallaxCard } from './parallax-card';

export default function ComponentsPage() {
  const handleCardClick = (variant: string) => {
    console.log(`Clicked on ${variant} card`);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--base-content)] mb-4">
            ParallaxCard Components
          </h1>
          <p className="text-lg text-[var(--base-content)]/80">
            Interactive cards with 3D parallax effects and multiple visual variants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ParallaxCard
            title="Default Card"
            description="A clean and minimal card design with subtle shadows and smooth parallax effects."
            variant="default"
            parallaxSpeed={8}
            onClick={() => handleCardClick('default')}
          />

          <ParallaxCard
            title="Glass Morphism"
            description="Frosted glass effect with backdrop blur and transparent borders for a modern look."
            variant="glass"
            parallaxSpeed={12}
            onClick={() => handleCardClick('glass')}
          />

          <ParallaxCard
            title="Gradient Card"
            description="Beautiful gradient background from primary to accent colors with enhanced contrast."
            variant="gradient"
            parallaxSpeed={10}
            onClick={() => handleCardClick('gradient')}
          />

          <ParallaxCard
            title="Deep Shadow"
            description="Pronounced shadows create depth and make the card appear to float above the surface."
            variant="shadow"
            parallaxSpeed={15}
            onClick={() => handleCardClick('shadow')}
          />

          <ParallaxCard
            title="Neon Glow"
            description="Glowing neon borders with enhanced shadow effects, perfect for dark themes."
            variant="neon"
            parallaxSpeed={10}
            onClick={() => handleCardClick('neon')}
          />

          <ParallaxCard
            title="With Image"
            description="Cards can include images that also participate in the 3D parallax effect."
            image="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
            variant="default"
            parallaxSpeed={8}
            onClick={() => handleCardClick('image')}
          />

          <ParallaxCard
            title="Custom Content"
            description="Use the children prop to add any custom content to your cards."
            variant="glass"
            parallaxSpeed={10}
            onClick={() => handleCardClick('custom')}
          >
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1 bg-[var(--primary)] text-[var(--primary-content)] rounded-[var(--radius-sm)] text-sm hover:opacity-90 transition-opacity">
                Action
              </button>
              <button className="px-3 py-1 bg-[var(--base-300)] text-[var(--base-content)] rounded-[var(--radius-sm)] text-sm hover:opacity-90 transition-opacity">
                Cancel
              </button>
            </div>
          </ParallaxCard>

          <ParallaxCard
            title="High Speed"
            description="Increased parallax speed for more dramatic 3D effects and enhanced interactivity."
            variant="shadow"
            parallaxSpeed={20}
            onClick={() => handleCardClick('high-speed')}
          />

          <ParallaxCard
            title="Subtle Effect"
            description="Reduced parallax speed for a more subtle and professional appearance."
            variant="default"
            parallaxSpeed={5}
            onClick={() => handleCardClick('subtle')}
          />
        </div>

        <div className="mt-16 text-center">
          <div className="bg-[var(--base-200)] rounded-[var(--radius)] p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--base-content)] mb-4">
              Usage Instructions
            </h2>
            <div className="text-left space-y-4 text-[var(--base-content)]/80">
              <p>
                <strong>Mouse Interaction:</strong> Move your mouse over any card to see the 3D parallax effect in action.
              </p>
              <p>
                <strong>Keyboard Navigation:</strong> Use Tab to focus on cards and Enter/Space to activate them.
              </p>
              <p>
                <strong>Responsive Design:</strong> All cards automatically adapt to different screen sizes.
              </p>
              <p>
                <strong>Accessibility:</strong> Full screen reader support with proper ARIA labels and keyboard navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 