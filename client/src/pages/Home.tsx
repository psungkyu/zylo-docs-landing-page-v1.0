import { ClerkProvider } from '@clerk/react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import HeroSectionFallback from '@/components/HeroSectionFallback';
import SolutionSection from '@/components/SolutionSection';
import FeaturesSection from '@/components/FeaturesSection';
import CustomersSection from '@/components/CustomersSection';
import CTASection from '@/components/CTASection';

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function Home() {
  const hero = clerkKey ? (
    <ClerkProvider publishableKey={clerkKey}>
      <HeroSection />
    </ClerkProvider>
  ) : (
    <HeroSectionFallback />
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        {hero}
        <CustomersSection />
        <SolutionSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}
