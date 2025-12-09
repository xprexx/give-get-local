import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Heart, Search, Filter } from "lucide-react";
import { useAuth, ItemRequest } from "@/contexts/AuthContext";
import { useState } from "react";
import { format } from "date-fns";

const ItemRequests = () => {
  const { itemRequests, categories, users } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const activeRequests = itemRequests.filter(req => req.status === 'active');

  const filteredRequests = activeRequests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || req.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getRequesterName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || "Anonymous";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive' as const;
      case 'medium': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Heart className="w-3 h-3 mr-1" />
              Community Requests
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Items Needed
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help our verified beneficiaries by donating items they need. Every contribution makes a difference.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Requests Grid */}
          {filteredRequests.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Requests</h3>
                <p className="text-muted-foreground">
                  There are no item requests at the moment. Check back later!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover:-translate-y-1 transition-transform duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
                      <Badge variant={getUrgencyColor(request.urgency)}>
                        {request.urgency === 'high' ? 'Urgent' : request.urgency === 'medium' ? 'Moderate' : 'Low'}
                      </Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{request.category}</Badge>
                      <Badge variant="success" className="gap-1">
                        <Heart className="w-3 h-3" />
                        Verified Beneficiary
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {request.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(request.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Requested by: <span className="font-medium text-foreground">{getRequesterName(request.userId)}</span>
                      </p>
                    </div>

                    <Button className="w-full" variant="default">
                      Offer to Donate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ItemRequests;