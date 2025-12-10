import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useItemRequests, ItemRequest } from "@/hooks/useItemRequests";
import { useToast } from "@/hooks/use-toast";
import { Heart, Plus, ArrowLeft, MapPin, Calendar, Trash2, Edit, AlertTriangle, Clock, CheckCircle, XCircle, Info, Search, Filter } from "lucide-react";
import { format } from "date-fns";

const BeneficiaryItemRequests = () => {
  const { user, categories, users } = useAuth();
  const { requests: itemRequests, loading, createRequest, updateRequest, deleteRequest, refresh } = useItemRequests();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ItemRequest | null>(null);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Refresh data on mount
  useEffect(() => {
    refresh();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    customCategory: "",
    location: "",
    urgency: "medium" as "low" | "medium" | "high",
  });

  const myRequests = itemRequests.filter(req => req.user_id === user?.id);
  
  // Community requests - only approved and active from other beneficiaries
  const communityRequests = itemRequests.filter(req => 
    req.status === 'active' && req.moderation_status === 'approved' && req.user_id !== user?.id
  );

  const filteredCommunityRequests = communityRequests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || req.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getRequesterName = (userId: string) => {
    const reqUser = users.find(u => u.id === userId);
    return reqUser?.name || "Anonymous";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryValue = useCustomCategory ? formData.customCategory : formData.category;

    if (!formData.title || !formData.description || !categoryValue || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const requestData = {
      title: formData.title,
      description: formData.description,
      category: categoryValue,
      is_custom_category: useCustomCategory,
      location: formData.location,
      urgency: formData.urgency,
    };

    if (editingRequest) {
      const { error } = await updateRequest(editingRequest.id, requestData);
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update request",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Request Updated",
        description: "Your item request has been updated successfully.",
      });
    } else {
      const { error } = await createRequest(requestData);
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to create request",
          variant: "destructive",
        });
        return;
      }
      const message = useCustomCategory
        ? "Your request has been submitted and is pending admin approval since it uses a custom category."
        : "Your item request has been posted. Donors will be able to see it.";
      toast({
        title: "Request Submitted",
        description: message,
      });
    }

    setFormData({ title: "", description: "", category: "", customCategory: "", location: "", urgency: "medium" });
    setUseCustomCategory(false);
    setEditingRequest(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (request: any) => {
    setEditingRequest(request);
    setUseCustomCategory(request.is_custom_category);
    setFormData({
      title: request.title,
      description: request.description,
      category: request.is_custom_category ? "" : request.category,
      customCategory: request.is_custom_category ? request.category : "",
      location: request.location,
      urgency: request.urgency,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (requestId: string) => {
    await deleteRequest(requestId);
    toast({
      title: "Request Deleted",
      description: "Your item request has been removed.",
    });
  };

  const getModerationBadge = (request: any) => {
    switch (request.moderation_status) {
      case 'pending': return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Pending Review</Badge>;
      case 'approved': return <Badge variant="success" className="gap-1"><CheckCircle className="w-3 h-3" />Approved</Badge>;
      case 'rejected': return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Rejected</Badge>;
      default: return null;
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
                <span className="text-xl font-bold">Item Requests</span>
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
        <Tabs defaultValue="community" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="community">Community Requests</TabsTrigger>
              <TabsTrigger value="my-requests">My Requests ({myRequests.length})</TabsTrigger>
            </TabsList>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingRequest(null);
                setUseCustomCategory(false);
                setFormData({ title: "", description: "", category: "", customCategory: "", location: "", urgency: "medium" });
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
                      {useCustomCategory ? (
                        <Input
                          id="customCategory"
                          placeholder="Enter custom category"
                          value={formData.customCategory}
                          onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                        />
                      ) : (
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
                      )}
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-xs"
                        onClick={() => {
                          setUseCustomCategory(!useCustomCategory);
                          setFormData({ ...formData, category: "", customCategory: "" });
                        }}
                      >
                        {useCustomCategory ? "Use existing category" : "Item not in list? Add custom category"}
                      </Button>
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

                  {useCustomCategory && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Custom category requests require admin approval before they become visible to donors.
                      </AlertDescription>
                    </Alert>
                  )}

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

          <Alert className="border-primary/20">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Moderation Policy:</strong> Requests using approved categories are visible immediately. 
              Custom categories require admin approval. Admins may remove inappropriate requests at any time.
            </AlertDescription>
          </Alert>

          {/* Community Requests Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
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

            {filteredCommunityRequests.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Active Requests</h3>
                  <p className="text-muted-foreground">
                    There are no item requests from other beneficiaries at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunityRequests.map((request) => (
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
                          <span>{format(new Date(request.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          Requested by: <span className="font-medium text-foreground">{getRequesterName(request.user_id)}</span>
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
          </TabsContent>

          {/* My Requests Tab */}
          <TabsContent value="my-requests" className="space-y-6">
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
                        {getModerationBadge(request)}
                        <Badge variant={getUrgencyColor(request.urgency)}>
                          {request.urgency === 'high' ? 'Urgent' : request.urgency === 'medium' ? 'Moderate' : 'Low'}
                        </Badge>
                        <Badge variant="outline">{request.category}</Badge>
                        {request.is_custom_category && (
                          <Badge variant="secondary">Custom</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {request.description}
                      </p>

                      {request.moderation_status === 'rejected' && request.moderation_note && (
                        <Alert variant="destructive">
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Rejection reason:</strong> {request.moderation_note}
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{request.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(request.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BeneficiaryItemRequests;
