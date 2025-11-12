import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import ExpertiseSection from "@/components/home/ExpertiseSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import MapSection from "@/components/home/MapSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <ExpertiseSection />
        <TestimonialsSection />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
