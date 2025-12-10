import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useDonationListings, DonationListing } from "@/hooks/useDonationListings";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Package, Plus, MapPin, Clock, Trash2, Edit
} from "lucide-react";
import { format } from "date-fns";

const MyListings = () => {
  const { user } = useAuth();
  const { listings, loading, deleteListing, updateListing } = useDonationListings();
  const { categories } = useCategories();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editListing, setEditListing] = useState<DonationListing | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    condition: '',
    pickup_location: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter to only show current user's listings
  const myListings = listings.filter(l => l.user_id === user?.id);
  // Combine available and claimed in the same tab
  const activeListings = myListings.filter(l => l.status === 'available' || l.status === 'claimed');
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

  const handleToggleClaimed = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'claimed' ? 'available' : 'claimed';
    const { error } = await updateListing(id, { status: newStatus });
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive",
      });
    } else {
      toast({
        title: newStatus === 'claimed' ? "Listing marked as claimed" : "Listing unmarked",
        description: newStatus === 'claimed' ? "The item has been marked as claimed" : "The item is now available again",
      });
    }
  };

  const openEditDialog = (listing: DonationListing) => {
    setEditListing(listing);
    setEditForm({
      title: listing.title,
      description: listing.description,
      category: listing.category,
      subcategory: listing.subcategory || '',
      condition: listing.condition,
      pickup_location: listing.pickup_location,
    });
  };

  const handleUpdate = async () => {
    if (!editListing) return;
    setIsUpdating(true);
    
    const { error } = await updateListing(editListing.id, {
      title: editForm.title,
      description: editForm.description,
      category: editForm.category,
      subcategory: editForm.subcategory || undefined,
      condition: editForm.condition as 'new' | 'like_new' | 'good' | 'fair',
      pickup_location: editForm.pickup_location,
    });
    
    setIsUpdating(false);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Listing updated",
        description: "Your changes have been saved",
      });
      setEditListing(null);
    }
  };

  const selectedCategory = categories.find(c => c.name === editForm.category);

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
      case "claimed": return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Claimed</Badge>;
      case "removed": return <Badge variant="outline">Removed</Badge>;
      default: return null;
    }
  };

  const isClaimed = (listing: DonationListing) => listing.status === 'claimed';

  const renderListingCard = (listing: typeof myListings[0]) => (
    <Card key={listing.id} className={`overflow-hidden transition-all ${isClaimed(listing) ? 'border-amber-500/50 bg-amber-50/30 dark:bg-amber-950/10' : ''}`}>
      <div className="flex gap-4 p-4">
        <img 
          src={listing.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"} 
          alt={listing.title}
          className={`w-24 h-24 rounded-lg object-cover flex-shrink-0 ${isClaimed(listing) ? 'opacity-75 grayscale-[30%]' : ''}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold truncate ${isClaimed(listing) ? 'text-muted-foreground' : ''}`}>{listing.title}</h3>
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
                onClick={() => openEditDialog(listing)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleToggleClaimed(listing.id, listing.status)}
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
          {listing.status === 'claimed' && (
            <Button 
              size="sm" 
              variant="outline"
              className="border-amber-500 text-amber-600 hover:bg-amber-50"
              onClick={() => handleToggleClaimed(listing.id, listing.status)}
            >
              Unclaim
            </Button>
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
              My Listings ({activeListings.length})
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

      {/* Edit Dialog */}
      <Dialog open={!!editListing} onOpenChange={() => setEditListing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
            <DialogDescription>
              Update your donation listing details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={editForm.category} 
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value, subcategory: '' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Subcategory</Label>
                <Select 
                  value={editForm.subcategory} 
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, subcategory: value }))}
                  disabled={!selectedCategory?.subcategories?.length}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory?.subcategories?.map(sub => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select 
                value={editForm.condition} 
                onValueChange={(value) => setEditForm(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like_new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Pickup Location</Label>
              <Input
                id="location"
                value={editForm.pickup_location}
                onChange={(e) => setEditForm(prev => ({ ...prev, pickup_location: e.target.value }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditListing(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyListings;
