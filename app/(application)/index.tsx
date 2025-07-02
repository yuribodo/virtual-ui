'use client';

import { Hero, HeroActions } from "./_components/hero";

export default function Home() {
  return (
    <Hero>
      <Hero.Content>
        <Hero.Title>
          <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
            Virtual UI
          </span>
        </Hero.Title>
        
        <Hero.Description>
          Beautiful UI components focused on micro interactions and smooth animations.
        </Hero.Description>
        
        <Hero.Actions>
          <HeroActions.Button variant="primary" href="/components">
            Explore Components
          </HeroActions.Button>
        </Hero.Actions>
      </Hero.Content>
    </Hero>
  );
}
