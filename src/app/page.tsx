import Navigation from "@/components/Navigation";
import HeroSectionFallback from "@/components/HeroSectionFallback";
import SolutionSection from "@/components/SolutionSection";
import FeaturesSection from "@/components/FeaturesSection";
import CustomersSection from "@/components/CustomersSection";
import CTASection from "@/components/CTASection";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ openDocScore?: string }>;
}) {
  const params = await searchParams;
  const openDocScore =
    params.openDocScore === "1" || params.openDocScore === "true";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSectionFallback defaultOpenDocScore={openDocScore} />
        <CustomersSection />
        <SolutionSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}
