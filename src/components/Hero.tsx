import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, Package } from "lucide-react";
import heroImage from "@/assets/hero-donation.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Community members sharing donated items"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Join 5,000+ Singaporeans sharing locally
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Give What You Don't Need,
            <span className="text-gradient-hero block mt-2">Find What You Do</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Connect with your Singapore community to donate items, support local charities, and reduce waste. One person's unused becomes another's treasure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/donate">
              <Button variant="hero" size="lg">
                Start Donating
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" size="lg">
                Browse Items
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Package className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">25K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Items Donated</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Users className="w-5 h-5 text-secondary" />
                <span className="text-2xl font-bold text-foreground">50+</span>
              </div>
              <p className="text-sm text-muted-foreground">Organizations</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">26</span>
              </div>
              <p className="text-sm text-muted-foreground">Districts</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
