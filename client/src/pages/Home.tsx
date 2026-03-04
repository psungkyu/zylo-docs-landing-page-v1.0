import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import SolutionSection from '@/components/SolutionSection';
import FeaturesSection from '@/components/FeaturesSection';
import CustomersSection from '@/components/CustomersSection';
import CTASection from '@/components/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <CustomersSection />
        <SolutionSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}
