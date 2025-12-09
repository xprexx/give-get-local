import { Camera, FileText, MapPin, Send, Package, Users } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Snap Photos",
    description: "Take a few photos of items you want to donate. Show their condition clearly.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FileText,
    title: "Add Details",
    description: "Describe your item, its condition, how long you've used it, and when it can be picked up.",
    color: "bg-secondary/20 text-secondary-foreground",
  },
  {
    icon: MapPin,
    title: "Set Location",
    description: "Choose a convenient pickup spot. Your exact address stays private until you confirm.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Send,
    title: "List & Connect",
    description: "Publish your listing and connect with neighbors or organizations interested in your items.",
    color: "bg-secondary/20 text-secondary-foreground",
  },
];

const features = [
  {
    icon: Package,
    title: "Bulk Donations",
    description: "Have 50+ items? Connect directly with charities who need large donations.",
  },
  {
    icon: Users,
    title: "Organization Requests",
    description: "See what local charities need most and donate directly to their wishlist.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sharing is simple. List your items in minutes and make a difference in your community.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-4 relative z-10`}>
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

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border animate-fade-up"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
