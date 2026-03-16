import Navigation from "@/components/Navigation";
import HeroSectionFallback from "@/components/HeroSectionFallback";
import SolutionSection from "@/components/SolutionSection";
import FeaturesSection from "@/components/FeaturesSection";
import CustomersSection from "@/components/CustomersSection";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSectionFallback />
        <CustomersSection />
        <SolutionSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}
