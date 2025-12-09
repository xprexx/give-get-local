import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle2, XCircle, MapPin, Package } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  description: string;
  logo: string;
  location: string;
  accepting: string[];
  notAccepting: string[];
  itemsNeeded: number;
}

const organizations: Organization[] = [
  {
    id: "1",
    name: "The Salvation Army Singapore",
    description: "Serving the needy and marginalized in Singapore since 1935. We accept quality used goods for our Family Stores.",
    logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=120&h=120&fit=crop",
    location: "Multiple Locations",
    accepting: ["Clothing", "Household items", "Books", "Toys", "Small appliances"],
    notAccepting: ["Mattresses", "Large furniture", "Expired items"],
    itemsNeeded: 320,
  },
  {
    id: "2",
    name: "Willing Hearts",
    description: "A secular, non-affiliated charity that operates a soup kitchen to prepare and distribute meals to the underprivileged.",
    logo: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=120&h=120&fit=crop",
    location: "Chai Chee",
    accepting: ["Non-perishable food", "Kitchen equipment", "Cleaning supplies"],
    notAccepting: ["Clothing", "Electronics", "Furniture"],
    itemsNeeded: 156,
  },
  {
    id: "3",
    name: "Blessings in a Bag",
    description: "Empowering underprivileged children with school supplies and enrichment programs across Singapore.",
    logo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=120&h=120&fit=crop",
    location: "Islandwide",
    accepting: ["School supplies", "Stationery", "Books", "Backpacks"],
    notAccepting: ["Adult items", "Electronics", "Used textbooks"],
    itemsNeeded: 234,
  },
];

const OrganizationsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wide">Partner Organizations</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Bulk Donate to Singapore Charities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Have many items to donate? Connect directly with local organizations that need them most.
            </p>
          </div>
          <Link to="/organizations">
            <Button variant="outline">View All Organizations</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org, index) => (
            <Card
              key={org.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {org.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{org.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {org.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Currently Accepting
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {org.accepting.map((item) => (
                        <Badge key={item} variant="success" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <XCircle className="w-4 h-4 text-destructive" />
                      Not Accepting
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {org.notAccepting.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{org.itemsNeeded} items needed</span>
                  </div>
                  <Button size="sm">Donate</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrganizationsSection;
