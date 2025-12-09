import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, CheckCircle2, XCircle, Package, Building2 } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  description: string;
  logo: string;
  location: string;
  type: string;
  accepting: string[];
  notAccepting: string[];
  itemsNeeded: number;
  verified: boolean;
}

const organizations: Organization[] = [
  {
    id: "1",
    name: "Hope Community Center",
    description: "Supporting families in need with essential items for daily living. We distribute to over 500 families monthly.",
    logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=120&h=120&fit=crop",
    location: "Downtown",
    type: "Community Center",
    accepting: ["Clothing", "Kitchen items", "Bedding", "Toys"],
    notAccepting: ["Electronics", "Large furniture"],
    itemsNeeded: 156,
    verified: true,
  },
  {
    id: "2",
    name: "Second Chance Shelter",
    description: "Providing resources and support for individuals transitioning out of homelessness.",
    logo: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=120&h=120&fit=crop",
    location: "Eastside",
    type: "Shelter",
    accepting: ["Clothing", "Hygiene products", "Blankets", "Books"],
    notAccepting: ["Textbooks", "Large furniture"],
    itemsNeeded: 89,
    verified: true,
  },
  {
    id: "3",
    name: "Kids First Foundation",
    description: "Ensuring every child has access to educational materials and basic necessities.",
    logo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=120&h=120&fit=crop",
    location: "Westside",
    type: "Non-Profit",
    accepting: ["Kids clothing", "Toys", "School supplies", "Books"],
    notAccepting: ["Adult clothing", "Electronics"],
    itemsNeeded: 234,
    verified: true,
  },
  {
    id: "4",
    name: "Green Earth Recycling",
    description: "Electronics recycling and refurbishment program. We repair and donate working electronics to schools.",
    logo: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=120&h=120&fit=crop",
    location: "Industrial District",
    type: "Recycling Center",
    accepting: ["Electronics", "Computers", "Phones", "Tablets"],
    notAccepting: ["Clothing", "Food", "Furniture"],
    itemsNeeded: 78,
    verified: true,
  },
  {
    id: "5",
    name: "Senior Care Alliance",
    description: "Supporting elderly community members with essential items and household goods.",
    logo: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=120&h=120&fit=crop",
    location: "Riverside",
    type: "Senior Services",
    accepting: ["Furniture", "Kitchen items", "Medical equipment", "Books"],
    notAccepting: ["Kids items", "Sports equipment"],
    itemsNeeded: 112,
    verified: true,
  },
  {
    id: "6",
    name: "Pet Rescue Network",
    description: "Rescuing and rehoming pets in need. We accept pet supplies for our foster network.",
    logo: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=120&h=120&fit=crop",
    location: "Northside",
    type: "Animal Rescue",
    accepting: ["Pet food", "Pet beds", "Carriers", "Toys"],
    notAccepting: ["Human clothing", "Electronics", "Furniture"],
    itemsNeeded: 67,
    verified: false,
  },
];

const orgTypes = ["All", "Community Center", "Shelter", "Non-Profit", "Recycling Center", "Senior Services", "Animal Rescue"];

const Organizations = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrgs = organizations.filter((org) => {
    const matchesType = selectedType === "All" || org.type === selectedType;
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wide">Partner Organizations</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Donate to Organizations
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Connect with verified charities and non-profits. Perfect for bulk donations or specific item requests.
            </p>
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
            <div className="relative flex-1 md:max-w-xs">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Location..."
                className="pl-12"
              />
            </div>
          </div>

          {/* Type Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {orgTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            {filteredOrgs.length} organizations found
          </p>

          {/* Organizations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org, index) => (
              <Card
                key={org.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-foreground">
                          {org.name}
                        </h3>
                        {org.verified && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{org.location}</span>
                        <span>•</span>
                        <span>{org.type}</span>
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
                    <Button size="sm">Contact</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrgs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">No organizations found.</p>
              <Button onClick={() => { setSelectedType("All"); setSearchQuery(""); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Organizations;
