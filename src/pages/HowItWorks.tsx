import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Camera, FileText, MapPin, Send, Package, Users, Heart, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Snap Photos",
    description: "Take clear photos of items you want to donate. Show their condition from multiple angles.",
  },
  {
    icon: FileText,
    title: "Add Details",
    description: "Describe your item, its condition, how long you've used it, and set pickup availability.",
  },
  {
    icon: MapPin,
    title: "Set Location",
    description: "Choose a convenient pickup spot. Your exact address stays private until you confirm a pickup.",
  },
  {
    icon: Send,
    title: "List & Connect",
    description: "Publish your listing and connect with neighbors or organizations interested in your items.",
  },
];

const benefits = [
  "Reduce waste by giving items a second life",
  "Help neighbors and local charities",
  "Declutter your home responsibly",
  "Connect with your community",
  "Get tax receipts from verified organizations",
  "Track your donation impact",
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How <span className="text-gradient-hero">GiveLocal</span> Works
            </h1>
            <p className="text-lg text-muted-foreground">
              Donating has never been easier. List your items in minutes and make a real difference in your community.
            </p>
          </div>

          {/* Steps Section */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">
              Four Simple Steps to Donate
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 relative z-10">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <div className="text-sm font-bold text-primary mb-2">Step {index + 1}</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* For Individuals */}
            <div className="p-8 rounded-3xl bg-card border border-border">
              <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6">
                <Package className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                For Individual Donors
              </h3>
              <p className="text-muted-foreground mb-6">
                Have a few items to give away? List them individually and let your neighbors pick them up directly.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  Free to list unlimited items
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  Chat directly with interested neighbors
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  Schedule pickups at your convenience
                </li>
              </ul>
              <Button variant="hero">List an Item</Button>
            </div>

            {/* For Bulk Donations */}
            <div className="p-8 rounded-3xl bg-card border border-border">
              <div className="w-14 h-14 rounded-2xl bg-gradient-warm flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                For Bulk Donations
              </h3>
              <p className="text-muted-foreground mb-6">
                Have 50+ items? Connect directly with organizations who can pick up large donations.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  One-click connect with charities
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  Organizations arrange pickup
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  Receive tax-deductible receipts
                </li>
              </ul>
              <Button variant="warm">Bulk Donate</Button>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Why Donate with GiveLocal?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Heart className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button variant="hero" size="lg">
              Start Donating Today
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
