import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedItems from "@/components/FeaturedItems";
import OrganizationsSection from "@/components/OrganizationsSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <FeaturedItems />
        <HowItWorks />
        <OrganizationsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
