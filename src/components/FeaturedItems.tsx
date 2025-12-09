import { useState } from "react";
import DonationCard, { DonationItem } from "@/components/DonationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

const sampleItems: DonationItem[] = [
  {
    id: "1",
    title: "Vintage Wooden Bookshelf",
    description: "Beautiful teak bookshelf in great condition. Has 5 shelves and can hold many books. Minor scratches on the back.",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=450&fit=crop",
    category: "Furniture",
    durability: "Used 2 years",
    location: "Toa Payoh",
    distance: "1.2 km",
    postedAt: "2h ago",
    views: 45,
  },
  {
    id: "2",
    title: "Kids' Winter Clothing Bundle",
    description: "Collection of jackets, sweaters, and pants for kids aged 5-7. All in good condition, some barely worn.",
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&h=450&fit=crop",
    category: "Clothing",
    durability: "Gently used",
    location: "Tampines",
    distance: "3.5 km",
    postedAt: "5h ago",
    views: 89,
  },
  {
    id: "3",
    title: "Samsung 32\" LED TV",
    description: "Working perfectly, comes with remote and power cable. Upgrading to a bigger size so giving this away.",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=450&fit=crop",
    category: "Electronics",
    durability: "Used 3 years",
    location: "Jurong East",
    distance: "5.0 km",
    postedAt: "1d ago",
    views: 234,
  },
  {
    id: "4",
    title: "Beginner Guitar with Case",
    description: "Acoustic guitar perfect for beginners. Includes carrying case and a pick. Some light wear but plays great.",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=450&fit=crop",
    category: "Music",
    durability: "Used 1 year",
    location: "Bishan",
    distance: "2.1 km",
    postedAt: "3h ago",
    views: 67,
  },
  {
    id: "5",
    title: "Box of Children's Books",
    description: "Around 30 books suitable for ages 4-10. Mix of picture books and early readers. Great for homeschooling or classroom.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=450&fit=crop",
    category: "Books",
    durability: "Good condition",
    location: "Ang Mo Kio",
    distance: "2.8 km",
    postedAt: "6h ago",
    views: 112,
  },
  {
    id: "6",
    title: "Office Desk with Drawers",
    description: "Sturdy wooden desk with 3 drawers. Perfect for home office. Some minor wear on the surface.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=450&fit=crop",
    category: "Furniture",
    durability: "Used 4 years",
    location: "Raffles Place",
    distance: "4.2 km",
    postedAt: "12h ago",
    views: 78,
  },
];

const categories = ["All", "Furniture", "Clothing", "Electronics", "Books", "Music", "Toys", "Kitchen"];

const FeaturedItems = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = sampleItems.filter((item) => {
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
          <Button variant="outline" size="lg">
            View All Items
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
