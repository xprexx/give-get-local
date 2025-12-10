import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DonationCard, { DonationItem } from "@/components/DonationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, MapPin, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
    description: "Around 30 books suitable for ages 4-10. Mix of picture books and early readers. Great for homeschooling.",
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
  {
    id: "7",
    title: "Baby Stroller - Like New",
    description: "Graco stroller in excellent condition. Folds easily, has cup holders and storage. Perfect for newborns to toddlers.",
    image: "https://images.unsplash.com/photo-1586048018635-12e0506e69aa?w=600&h=450&fit=crop",
    category: "Baby",
    durability: "Used 6 months",
    location: "Clementi",
    distance: "4.8 km",
    postedAt: "4h ago",
    views: 156,
  },
  {
    id: "8",
    title: "Kitchen Appliances Set",
    description: "Includes toaster, blender, and coffee maker. All working perfectly. Moving abroad so can't take them.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=450&fit=crop",
    category: "Kitchen",
    durability: "Used 2 years",
    location: "Bedok",
    distance: "6.2 km",
    postedAt: "8h ago",
    views: 93,
  },
  {
    id: "9",
    title: "Exercise Bike",
    description: "Stationary bike with digital display. Great for home workouts. Some cosmetic scratches but works great.",
    image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&h=450&fit=crop",
    category: "Sports",
    durability: "Used 3 years",
    location: "Yishun",
    distance: "8.5 km",
    postedAt: "1d ago",
    views: 187,
  },
];

const categories = ["All", "Furniture", "Clothing", "Electronics", "Books", "Music", "Baby", "Kitchen", "Sports", "Toys"];

const getConditionLabel = (condition: string) => {
  switch (condition) {
    case 'new': return 'Brand New';
    case 'like-new': return 'Like New';
    case 'good': return 'Good Condition';
    case 'fair': return 'Fair Condition';
    default: return condition;
  }
};

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return 'Just now';
};

const Browse = () => {
  const { donationListings, users } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Convert user donation listings to DonationItem format
  const userListings: DonationItem[] = donationListings
    .filter(listing => listing.status === 'available')
    .map(listing => {
      const donor = users.find(u => u.id === (listing.user_id || listing.userId));
      return {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        image: listing.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=450&fit=crop",
        category: listing.category,
        subcategory: listing.subcategory,
        durability: getConditionLabel(listing.condition),
        location: listing.pickup_location || listing.pickupLocation || '',
        distance: "Nearby",
        postedAt: getTimeAgo(listing.created_at || listing.createdAt || ''),
        views: Math.floor(Math.random() * 50) + 1,
      };
    });

  // Combine sample items with user-created listings (user listings first)
  const allItems = [...userListings, ...sampleItems];

  const filteredItems = allItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Browse Donations in Singapore
              </h1>
              <p className="text-lg text-muted-foreground">
                Find items available for pickup near you
              </p>
            </div>
            <Link to="/donate">
              <Button variant="hero" size="lg" className="gap-2 whitespace-nowrap">
                <PlusCircle className="h-5 w-5" />
                Donate an Item
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
            <div className="relative flex-1 lg:max-w-xs">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="MRT Station or Area..."
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
                    : "bg-card text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            {filteredItems.length} items available
          </p>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <DonationCard item={item} />
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">No items found matching your criteria.</p>
              <Button onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}>
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

export default Browse;