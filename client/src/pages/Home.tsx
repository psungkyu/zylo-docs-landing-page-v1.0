import Navigation from '@/components/Navigation';
// 그래프 변환 기능 배포 홀드 - 껍데기만 배포. 재개 시 아래 주석 해제 후 HeroSectionFallback 제거.
// import { ClerkProvider } from '@clerk/react';
// import HeroSection from '@/components/HeroSection';
import HeroSectionFallback from '@/components/HeroSectionFallback';
import SolutionSection from '@/components/SolutionSection';
import FeaturesSection from '@/components/FeaturesSection';
import CustomersSection from '@/components/CustomersSection';
import CTASection from '@/components/CTASection';

// const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function Home() {
  // 그래프 기능 홀드: 항상 껍데기(Fallback)만 표시. 재개 시 hero를 아래처럼 변경.
  // const hero = clerkKey ? (
  //   <ClerkProvider publishableKey={clerkKey}><HeroSection /></ClerkProvider>
  // ) : (
  //   <HeroSectionFallback />
  // );
  const hero = <HeroSectionFallback />;

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
