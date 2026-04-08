import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";

import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Solutions from "@/components/sections/Solutions";
import Showcase from "@/components/sections/Showcase";
import Projects from "@/components/sections/Projects";
import Team from "@/components/sections/Team";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        {/* 1. Hero — bg-deep */}
        <Hero />

        {/* Marquee — capabilities ticker */}
        <Marquee />

        {/* 2. Testimonials — bg-surface */}
        <Testimonials />
        <div className="section-divider" />

        {/* 3. Solutions (layered carousel) — bg-deep */}
        <Solutions />
        <div className="section-divider" />

        {/* 4. Showcase + Stats (merged) — bg-deep */}
        <Showcase />
        <div className="section-divider" />

        {/* 5. Projects — bg-surface */}
        <Projects />
        <div className="section-divider" />

        {/* 6. Team — bg-deep */}
        <Team />
        <div className="section-divider" />

        {/* 6. Blog — bg-surface */}
        <Blog />

        {/* 7. CTA — bg-surface */}
        <CTA />

        {/* 8. Contact — bg-deep */}
        <Contact />
      </main>

      {/* Footer — bg-surface */}
      <Footer />
    </>
  );
}
