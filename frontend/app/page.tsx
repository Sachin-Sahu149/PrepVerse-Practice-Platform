'use client'

import AnalyticsSection from "@/components/landing/AnalyticsSection";
import CTASection from "@/components/landing/CTASection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import Navbar from "@/components/landing/Navbar";
import PracticeAreasSection from "@/components/landing/PracticeAreasSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import WhySkillVerseSection from "@/components/landing/WhySkillVerseSection";

export default function Home() {

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <div id="practice">
          <PracticeAreasSection />
        </div>
        <AnalyticsSection />
        <WhySkillVerseSection />
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
