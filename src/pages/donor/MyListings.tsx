import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useDonationListings } from "@/hooks/useDonationListings";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Package, Plus, MapPin, Clock, Trash2, Edit, Eye
} from "lucide-react";
import { format } from "date-fns";

const MyListings = () => {
  const { user } = useAuth();
  const { listings, loading, deleteListing, updateListing } = useDonationListings();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter to only show current user's listings
  const myListings = listings.filter(l => l.user_id === user?.id);
  const activeListings = myListings.filter(l => l.status === 'available');
  const claimedListings = myListings.filter(l => l.status === 'claimed');
  const removedListings = myListings.filter(l => l.status === 'removed');

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await deleteListing(deleteId);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Listing deleted",
        description: "Your listing has been removed",
      });
    }
    setDeleteId(null);
  };

  const handleMarkClaimed = async (id: string) => {
    const { error } = await updateListing(id, { status: 'claimed' });
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Listing marked as claimed",
        description: "The item has been marked as claimed",
      });
    }
  };

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
      'new': 'New',
      'like_new': 'Like New',
      'good': 'Good',
      'fair': 'Fair',
    };
    return labels[condition] || condition;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available": return <Badge variant="default">Available</Badge>;
      case "claimed": return <Badge variant="secondary">Claimed</Badge>;
      case "removed": return <Badge variant="outline">Removed</Badge>;
      default: return null;
    }
  };

  const renderListingCard = (listing: typeof myListings[0]) => (
    <Card key={listing.id} className="overflow-hidden">
      <div className="flex gap-4 p-4">
        <img 
          src={listing.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"} 
          alt={listing.title}
          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{listing.title}</h3>
            {getStatusBadge(listing.status)}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{listing.description}</p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {listing.pickup_location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(listing.created_at), 'MMM d, yyyy')}
            </span>
            <Badge variant="outline" className="text-xs">
              {getConditionLabel(listing.condition)}
            </Badge>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {listing.status === 'available' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleMarkClaimed(listing.id)}
              >
                Mark Claimed
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteId(listing.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">My Listings</h1>
            </div>
          </div>
          <Link to="/donate">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Listing
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active">
              Available ({activeListings.length})
            </TabsTrigger>
            <TabsTrigger value="claimed">
              Claimed ({claimedListings.length})
            </TabsTrigger>
            <TabsTrigger value="removed">
              Removed ({removedListings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeListings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold mb-2">No active listings</h3>
                  <p className="text-muted-foreground mb-4">Start donating by creating your first listing</p>
                  <Link to="/donate">
                    <Button>Create Listing</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeListings.map(renderListingCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="claimed">
            {claimedListings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No claimed listings yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {claimedListings.map(renderListingCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="removed">
            {removedListings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No removed listings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {removedListings.map(renderListingCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyListings;
