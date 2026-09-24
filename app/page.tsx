import HomeHero from '@/components/HomeHero';
import InitiativeAxes from '@/components/InitiativeAxes';
import HomeActionCards from '@/components/HomeActionCards';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHero />
      <InitiativeAxes />
      <HomeActionCards />
    </div>
  );
}
