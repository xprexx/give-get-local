import { useState, useEffect, useMemo } from "react";
import DonationCard, { DonationItem } from "@/components/DonationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { useDonationListings } from "@/hooks/useDonationListings";
import { useCategories } from "@/hooks/useCategories";
import { Link } from "react-router-dom";

const getConditionLabel = (condition: string): string => {
  const labels: Record<string, string> = {
    new: "Brand New",
    like_new: "Like New",
    good: "Good Condition",
    fair: "Fair Condition",
  };
  return labels[condition] || condition;
};

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1d ago";
  return `${diffInDays}d ago`;
};

const FeaturedItems = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { listings, loading, refresh } = useDonationListings();
  const { categories: dbCategories } = useCategories();

  useEffect(() => {
    refresh();
  }, []);

  const categories = useMemo(() => {
    const cats = ["All", ...dbCategories.map(c => c.name)];
    return cats;
  }, [dbCategories]);

  const items: DonationItem[] = useMemo(() => {
    return listings
      .filter(listing => listing.status === 'available')
      .map(listing => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        image: listing.images?.[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=450&fit=crop",
        category: listing.category,
        durability: getConditionLabel(listing.condition),
        location: listing.pickup_location,
        distance: "Nearby",
        postedAt: getTimeAgo(listing.created_at),
        views: 0,
        userId: listing.user_id,
      }));
  }, [listings]);

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Available Near You
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover items Singaporeans are giving away. Find something you need or be inspired to donate!
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <DonationCard item={item} />
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found matching your criteria.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/browse">
            <Button variant="outline" size="lg">
              View All Items
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
