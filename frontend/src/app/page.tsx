"use client";
import { useState, useEffect } from "react";
import {
  TopBar,
  Navbar,
  MobileMenu,
  HeroSection,
  VideoModal,
  BannerCarousel,
  AboutSection,
  SolutionsSection,
  TestimonialsSection,
  CaseStudiesSection,
  PricingSection,
  CTASection,
  Footer,
} from "@/components/landing";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ overflow: "hidden" }}>
      {/* ══════ FULL HEADER WRAPPER ══════ */}
      <div style={{
        background: "#fafbfc",
        position: "relative",
        display: "flex",
        flexDirection: "column" as const,
      }}>
        <TopBar />
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <HeroSection />
      </div>

      {/* ══════ MOBILE MENU ══════ */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* ══════ VIDEO MODAL ══════ */}
      <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />

      {/* ══════ SECTIONS ══════ */}
      <BannerCarousel />
      <AboutSection />
      <SolutionsSection />
      <TestimonialsSection />
      <CaseStudiesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
