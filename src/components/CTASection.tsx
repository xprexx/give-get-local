import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-16">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/20 mb-6">
              <Heart className="w-8 h-8 text-primary-foreground" fill="currentColor" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Make a Difference?
            </h2>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
              Join thousands of neighbors who are decluttering responsibly and helping their community thrive.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Start Donating Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/10"
                >
                  Register as Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
