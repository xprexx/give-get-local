import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth, ItemRequest } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Heart, Plus, ArrowLeft, MapPin, Calendar, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

const MyRequests = () => {
  const { user, itemRequests, categories, submitItemRequest, updateItemRequest, deleteItemRequest } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ItemRequest | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    urgency: "medium" as "low" | "medium" | "high",
  });

  const myRequests = itemRequests.filter(req => req.userId === user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingRequest) {
      updateItemRequest(editingRequest.id, formData);
      toast({
        title: "Request Updated",
        description: "Your item request has been updated successfully.",
      });
    } else {
      submitItemRequest(formData);
      toast({
        title: "Request Submitted",
        description: "Your item request has been posted. Donors will be able to see it.",
      });
    }

    setFormData({ title: "", description: "", category: "", location: "", urgency: "medium" });
    setEditingRequest(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (request: ItemRequest) => {
    setEditingRequest(request);
    setFormData({
      title: request.title,
      description: request.description,
      category: request.category,
      location: request.location,
      urgency: request.urgency,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (requestId: string) => {
    deleteItemRequest(requestId);
    toast({
      title: "Request Deleted",
      description: "Your item request has been removed.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'fulfilled': return 'default';
      case 'cancelled': return 'secondary';
      default: return 'outline';
    }
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
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
                </div>
                <span className="text-xl font-bold">My Requests</span>
              </div>
            </div>
            <Badge variant="success" className="gap-1">
              <Heart className="w-3 h-3" />
              Verified Beneficiary
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">My Item Requests</h1>
            <p className="text-muted-foreground">
              Request items you need from the community
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingRequest(null);
              setFormData({ title: "", description: "", category: "", location: "", urgency: "medium" });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingRequest ? "Edit Request" : "Create Item Request"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Winter Jacket for Child"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you need and why..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, urgency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Preferred Pickup Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Tampines, Bedok, etc."
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingRequest ? "Update Request" : "Submit Request"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {myRequests.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Requests Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't created any item requests. Click the button above to request items you need.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(request)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(request.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={getStatusColor(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                    <Badge variant={getUrgencyColor(request.urgency)}>
                      {request.urgency === 'high' ? 'Urgent' : request.urgency === 'medium' ? 'Moderate' : 'Low'}
                    </Badge>
                    <Badge variant="outline">{request.category}</Badge>
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRequests;