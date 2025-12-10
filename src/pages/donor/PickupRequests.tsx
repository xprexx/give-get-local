import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { usePickupRequests, PickupRequest } from "@/hooks/usePickupRequests";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, ArrowLeft, MapPin, Calendar, Clock, MessageSquare, 
  CheckCircle, XCircle, Package, User
} from "lucide-react";
import { format } from "date-fns";

const DonorPickupRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { requests, loading, acceptRequest, rejectRequest, completeRequest, refresh } = usePickupRequests();
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);

  // Filter requests where current user is the listing owner (donor)
  const myRequests = requests.filter(r => r.donation_listings?.user_id === user?.id);
  
  const pendingRequests = myRequests.filter(r => r.status === "pending");
  const activeRequests = myRequests.filter(r => r.status === "accepted");
  const completedRequests = myRequests.filter(r => r.status === "completed" || r.status === "rejected");

  const handleAcceptRequest = async (requestId: string) => {
    const { error } = await acceptRequest(requestId, "Your pickup request has been accepted!");
    if (error) {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Request Accepted",
        description: "The requester has been notified.",
      });
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(prev => prev ? { ...prev, status: "accepted" } : null);
      }
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const { error } = await rejectRequest(requestId, "Sorry, this item is no longer available.");
    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Request Declined",
        description: "The requester has been notified.",
      });
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(prev => prev ? { ...prev, status: "rejected" } : null);
      }
    }
  };

  const handleCompletePickup = async (requestId: string) => {
    const { error } = await completeRequest(requestId);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to complete pickup",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Pickup Completed!",
        description: "Thank you for your donation. You've made a difference!",
      });
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(prev => prev ? { ...prev, status: "completed" } : null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary">Pending</Badge>;
      case "accepted": return <Badge variant="default">Accepted</Badge>;
      case "completed": return <Badge className="bg-green-500">Completed</Badge>;
      case "rejected": return <Badge variant="outline">Declined</Badge>;
      default: return null;
    }
  };

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
              <h1 className="text-2xl font-bold">Pickup Requests</h1>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Heart className="w-3 h-3" />
            {pendingRequests.length} pending
          </Badge>
        </div>

        {myRequests.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-2">No pickup requests yet</h3>
              <p className="text-muted-foreground mb-4">
                When someone requests to pick up one of your donated items, it will appear here.
              </p>
              <Link to="/donor/my-listings">
                <Button variant="outline">View My Listings</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Request List */}
            <div className="lg:col-span-1">
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="pending">
                    Pending ({pendingRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="active">
                    Active ({activeRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    History ({completedRequests.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                  <div className="space-y-3">
                    {pendingRequests.length === 0 ? (
                      <Card className="text-center py-8">
                        <CardContent>
                          <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                          <p className="text-muted-foreground">No pending requests</p>
                        </CardContent>
                      </Card>
                    ) : (
                      pendingRequests.map(request => (
                        <Card 
                          key={request.id}
                          className={`cursor-pointer transition-all ${selectedRequest?.id === request.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                          onClick={() => setSelectedRequest(request)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <img 
                                src={request.donation_listings?.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"} 
                                alt={request.donation_listings?.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">{request.donation_listings?.title}</h4>
                                <p className="text-xs text-muted-foreground">by {request.profiles?.name}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{format(new Date(request.created_at), 'MMM d, h:mm a')}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="active">
                  <div className="space-y-3">
                    {activeRequests.length === 0 ? (
                      <Card className="text-center py-8">
                        <CardContent>
                          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                          <p className="text-muted-foreground">No active pickups</p>
                        </CardContent>
                      </Card>
                    ) : (
                      activeRequests.map(request => (
                        <Card 
                          key={request.id}
                          className={`cursor-pointer transition-all ${selectedRequest?.id === request.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                          onClick={() => setSelectedRequest(request)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <img 
                                src={request.donation_listings?.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"} 
                                alt={request.donation_listings?.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm truncate">{request.donation_listings?.title}</h4>
                                  {getStatusBadge(request.status)}
                                </div>
                                <p className="text-xs text-muted-foreground">with {request.profiles?.name}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <div className="space-y-3">
                    {completedRequests.length === 0 ? (
                      <Card className="text-center py-8">
                        <CardContent>
                          <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                          <p className="text-muted-foreground">No history yet</p>
                        </CardContent>
                      </Card>
                    ) : (
                      completedRequests.map(request => (
                        <Card 
                          key={request.id}
                          className={`cursor-pointer transition-all opacity-75 ${selectedRequest?.id === request.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                          onClick={() => setSelectedRequest(request)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <img 
                                src={request.donation_listings?.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"} 
                                alt={request.donation_listings?.title}
                                className="w-16 h-16 rounded-lg object-cover grayscale-[30%]"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm truncate">{request.donation_listings?.title}</h4>
                                  {getStatusBadge(request.status)}
                                </div>
                                <p className="text-xs text-muted-foreground">with {request.profiles?.name}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-2">
              {selectedRequest ? (
                <Card className="h-fit">
                  <CardHeader className="border-b">
                    <div className="flex items-start gap-4">
                      <img 
                        src={selectedRequest.donation_listings?.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"} 
                        alt={selectedRequest.donation_listings?.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{selectedRequest.donation_listings?.title}</CardTitle>
                          {getStatusBadge(selectedRequest.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{selectedRequest.profiles?.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{selectedRequest.donation_listings?.pickup_location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Preferred: {selectedRequest.preferred_date} at {selectedRequest.preferred_time}</span>
                          </div>
                        </div>
                        {selectedRequest.alternative_date && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Alternative: {selectedRequest.alternative_date} at {selectedRequest.alternative_time}
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedRequest.message && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Message from requester:</p>
                        <p className="text-sm text-muted-foreground">{selectedRequest.message}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {selectedRequest.status === "pending" && (
                      <div className="flex gap-2 mt-4">
                        <Button 
                          className="flex-1 gap-2" 
                          onClick={() => handleAcceptRequest(selectedRequest.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept Request
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 gap-2"
                          onClick={() => handleRejectRequest(selectedRequest.id)}
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </Button>
                      </div>
                    )}

                    {selectedRequest.status === "accepted" && (
                      <div className="mt-4">
                        <Button 
                          className="w-full gap-2 bg-green-600 hover:bg-green-700" 
                          onClick={() => handleCompletePickup(selectedRequest.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Picked Up
                        </Button>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Contact Information</h4>
                      <p className="text-sm text-muted-foreground">
                        <strong>Name:</strong> {selectedRequest.profiles?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Email:</strong> {selectedRequest.profiles?.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-[400px] flex items-center justify-center">
                  <CardContent className="text-center">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Select a Request</h3>
                    <p className="text-muted-foreground">
                      Click on a pickup request to view details and take action
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DonorPickupRequests;
