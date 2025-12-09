import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, CheckCircle2, XCircle, Package, Building2, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DisplayOrganization {
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

// Seed organizations - verified Singapore charities
const seedOrganizations: DisplayOrganization[] = [
  {
    id: "seed-1",
    name: "The Salvation Army Singapore",
    description: "Serving the needy and marginalized in Singapore since 1935. We accept quality used goods for our Family Stores.",
    logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=120&h=120&fit=crop",
    location: "Multiple Locations",
    type: "Charity",
    accepting: ["Clothing", "Household items", "Books", "Toys", "Small appliances"],
    notAccepting: ["Mattresses", "Large furniture", "Expired items"],
    itemsNeeded: 320,
    verified: true,
  },
  {
    id: "seed-2",
    name: "Willing Hearts",
    description: "A secular, non-affiliated charity that operates a soup kitchen to prepare and distribute meals to the underprivileged.",
    logo: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=120&h=120&fit=crop",
    location: "Chai Chee",
    type: "Soup Kitchen",
    accepting: ["Non-perishable food", "Kitchen equipment", "Cleaning supplies"],
    notAccepting: ["Clothing", "Electronics", "Furniture"],
    itemsNeeded: 156,
    verified: true,
  },
  {
    id: "seed-3",
    name: "Blessings in a Bag",
    description: "Empowering underprivileged children with school supplies and enrichment programs across Singapore.",
    logo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=120&h=120&fit=crop",
    location: "Islandwide",
    type: "Youth Charity",
    accepting: ["School supplies", "Stationery", "Books", "Backpacks"],
    notAccepting: ["Adult items", "Electronics", "Used textbooks"],
    itemsNeeded: 234,
    verified: true,
  },
  {
    id: "seed-4",
    name: "New2U Thrift Shop (SCWO)",
    description: "Singapore Council of Women's Organisations thrift shop. Proceeds support women and family programmes.",
    logo: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=120&h=120&fit=crop",
    location: "Waterloo Street",
    type: "Thrift Shop",
    accepting: ["Clothing", "Accessories", "Bags", "Shoes", "Jewellery"],
    notAccepting: ["Electronics", "Furniture", "Books"],
    itemsNeeded: 189,
    verified: true,
  },
  {
    id: "seed-5",
    name: "MINDS",
    description: "Movement for the Intellectually Disabled of Singapore. Operating training and development centres.",
    logo: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=120&h=120&fit=crop",
    location: "Various Locations",
    type: "Social Service",
    accepting: ["Art supplies", "Sports equipment", "Books", "Board games"],
    notAccepting: ["Clothing", "Food items", "Electronics"],
    itemsNeeded: 112,
    verified: true,
  },
  {
    id: "seed-6",
    name: "SPCA Singapore",
    description: "Society for the Prevention of Cruelty to Animals. Caring for and rehoming animals in need.",
    logo: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=120&h=120&fit=crop",
    location: "Mount Vernon",
    type: "Animal Welfare",
    accepting: ["Pet food", "Pet beds", "Carriers", "Towels", "Blankets"],
    notAccepting: ["Human clothing", "Electronics", "Furniture"],
    itemsNeeded: 78,
    verified: true,
  },
];

const Organizations = () => {
  const { organizations: authOrganizations, categories } = useAuth();
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Transform approved AuthContext organizations to display format
  const registeredOrganizations = useMemo((): DisplayOrganization[] => {
    return authOrganizations
      .filter((org) => org.status === "approved")
      .map((org) => {
        // Categories are stored by name directly
        const acceptingNames = org.acceptedCategories.filter(
          (catName) => categories.some((c) => c.name === catName)
        );

        const notAcceptingNames = org.rejectedCategories.filter(
          (catName) => categories.some((c) => c.name === catName)
        );

        return {
          id: org.id,
          name: org.name,
          description: org.description || "A registered organization on GiveLocal.",
          logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&h=120&fit=crop",
          location: "Singapore",
          type: "Community",
          accepting: acceptingNames.length > 0 ? acceptingNames : ["Setting up categories..."],
          notAccepting: notAcceptingNames,
          itemsNeeded: Math.floor(Math.random() * 100) + 20,
          verified: false,
        };
      });
  }, [authOrganizations, categories]);

  // Combine seed and registered organizations
  const allOrganizations = useMemo(() => {
    return [...seedOrganizations, ...registeredOrganizations];
  }, [registeredOrganizations]);

  // Get unique org types for filter pills
  const orgTypes = useMemo(() => {
    const types = new Set(allOrganizations.map((org) => org.type));
    return ["All", ...Array.from(types)];
  }, [allOrganizations]);

  const filteredOrgs = allOrganizations.filter((org) => {
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
              <span className="text-sm font-medium text-primary uppercase tracking-wide">Singapore Charities</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Donate to Local Organizations
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Connect with verified Singapore charities and non-profits. Perfect for bulk donations or specific item requests.
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
                placeholder="Area or MRT..."
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
                className="animate-fade-up flex flex-col h-full"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="pt-6 flex flex-col flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-foreground truncate">
                          {org.name}
                        </h3>
                        {org.verified ? (
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{org.location}</span>
                        <span>•</span>
                        <span>{org.type}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                    {org.description}
                  </p>

                  <div className="space-y-3 mb-4 flex-1">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Currently Accepting
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {org.accepting.slice(0, 3).map((item) => (
                          <Badge key={item} variant="success" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                        {org.accepting.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{org.accepting.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {org.notAccepting.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                          <XCircle className="w-4 h-4 text-destructive" />
                          Not Accepting
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {org.notAccepting.slice(0, 2).map((item) => (
                            <Badge key={item} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                          {org.notAccepting.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{org.notAccepting.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span>{org.itemsNeeded} items needed</span>
                    </div>
                    <Button size="sm" variant="default">Contact</Button>
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