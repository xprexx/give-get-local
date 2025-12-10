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

// Helper component for request cards
const RequestCard = ({ request, selectedId, onClick, showStatus, dimmed, showDonor }: {
  request: PickupRequest;
  selectedId?: string;
  onClick: () => void;
  showStatus?: boolean;
  dimmed?: boolean;
  showDonor?: boolean;
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary">Pending</Badge>;
      case "accepted": return <Badge variant="default">Accepted</Badge>;
      case "completed": return <Badge className="bg-green-500">Completed</Badge>;
      case "rejected": return <Badge variant="outline">Declined</Badge>;
      case "cancelled": return <Badge variant="outline">Cancelled</Badge>;
      default: return null;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all ${selectedId === request.id ? 'ring-2 ring-primary' : 'hover:shadow-md'} ${dimmed ? 'opacity-75' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <img 
            src={request.donation_listings?.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"} 
            alt={request.donation_listings?.title}
            className={`w-16 h-16 rounded-lg object-cover ${dimmed ? 'grayscale-[30%]' : ''}`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm truncate">{request.donation_listings?.title}</h4>
              {showStatus && getStatusBadge(request.status)}
            </div>
            <p className="text-xs text-muted-foreground">
              {showDonor ? `Item location: ${request.donation_listings?.pickup_location}` : `by ${request.profiles?.name}`}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="w-3 h-3" />
              <span>{format(new Date(request.created_at), 'MMM d, h:mm a')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper component for request detail panel
const RequestDetailPanel = ({ request, mode, onAccept, onReject, onComplete }: {
  request: PickupRequest | null;
  mode: "incoming" | "outgoing";
  onAccept?: () => void;
  onReject?: () => void;
  onComplete?: () => void;
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary">Pending</Badge>;
      case "accepted": return <Badge variant="default">Accepted</Badge>;
      case "completed": return <Badge className="bg-green-500">Completed</Badge>;
      case "rejected": return <Badge variant="outline">Declined</Badge>;
      case "cancelled": return <Badge variant="outline">Cancelled</Badge>;
      default: return null;
    }
  };

  if (!request) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <CardContent className="text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Select a Request</h3>
          <p className="text-muted-foreground">Click on a pickup request to view details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="border-b">
        <div className="flex items-start gap-4">
          <img 
            src={request.donation_listings?.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"} 
            alt={request.donation_listings?.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{request.donation_listings?.title}</CardTitle>
              {getStatusBadge(request.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{mode === "incoming" ? request.profiles?.name : "Your Request"}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{request.donation_listings?.pickup_location}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Preferred: {request.preferred_date} at {request.preferred_time}</span>
              </div>
            </div>
            {request.alternative_date && (
              <div className="text-xs text-muted-foreground mt-1">
                Alternative: {request.alternative_date} at {request.alternative_time}
              </div>
            )}
          </div>
        </div>

        {request.message && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">{mode === "incoming" ? "Message from requester:" : "Your message:"}</p>
            <p className="text-sm text-muted-foreground">{request.message}</p>
          </div>
        )}

        {request.response_message && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Response from donor:</p>
            <p className="text-sm text-muted-foreground">{request.response_message}</p>
          </div>
        )}

        {/* Action Buttons - only for incoming (donor) */}
        {mode === "incoming" && request.status === "pending" && (
          <div className="flex gap-2 mt-4">
            <Button className="flex-1 gap-2" onClick={onAccept}>
              <CheckCircle className="w-4 h-4" />Accept Request
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={onReject}>
              <XCircle className="w-4 h-4" />Decline
            </Button>
          </div>
        )}

        {mode === "incoming" && request.status === "accepted" && (
          <div className="mt-4">
            <Button className="w-full gap-2 bg-green-600 hover:bg-green-700" onClick={onComplete}>
              <CheckCircle className="w-4 h-4" />Mark as Picked Up
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h4 className="font-medium">{mode === "incoming" ? "Contact Information" : "Pickup Location"}</h4>
          {mode === "incoming" ? (
            <>
              <p className="text-sm text-muted-foreground"><strong>Name:</strong> {request.profiles?.name}</p>
              <p className="text-sm text-muted-foreground"><strong>Email:</strong> {request.profiles?.email}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground"><strong>Location:</strong> {request.donation_listings?.pickup_location}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const DonorPickupRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { requests, loading, acceptRequest, rejectRequest, completeRequest, refresh } = usePickupRequests();
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);

  // Refresh data on mount
  useEffect(() => {
    refresh();
  }, []);

  // Filter requests where current user is the listing owner (donor) - INCOMING
  const incomingRequests = requests.filter(r => r.donation_listings?.user_id === user?.id);
  
  // Filter requests where current user is the requester - OUTGOING
  const outgoingRequests = requests.filter(r => r.requester_id === user?.id);
  
  console.log('PickupRequests - user:', user?.id);
  console.log('PickupRequests - all requests:', requests);
  console.log('PickupRequests - incomingRequests:', incomingRequests);
  console.log('PickupRequests - outgoingRequests:', outgoingRequests);
  
  // Tab state for main view toggle
  const [viewTab, setViewTab] = useState<"incoming" | "outgoing">("incoming");
  
  // Incoming (as donor)
  const pendingRequests = incomingRequests.filter(r => r.status === "pending");
  const activeRequests = incomingRequests.filter(r => r.status === "accepted");
  const completedRequests = incomingRequests.filter(r => r.status === "completed" || r.status === "rejected");
  
  // Outgoing (as requester)
  const myPendingRequests = outgoingRequests.filter(r => r.status === "pending");
  const myActiveRequests = outgoingRequests.filter(r => r.status === "accepted");
  const myCompletedRequests = outgoingRequests.filter(r => r.status === "completed" || r.status === "rejected" || r.status === "cancelled");

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
        </div>

        {/* Main Toggle: Incoming vs Outgoing */}
        <Tabs value={viewTab} onValueChange={(v) => setViewTab(v as "incoming" | "outgoing")} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="incoming" className="gap-2">
              <Package className="w-4 h-4" />
              Incoming ({incomingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="outgoing" className="gap-2">
              <Heart className="w-4 h-4" />
              My Requests ({outgoingRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* INCOMING REQUESTS (as donor) */}
          <TabsContent value="incoming">
            {incomingRequests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold mb-2">No incoming requests</h3>
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
                <div className="lg:col-span-1">
                  <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
                      <TabsTrigger value="active">Active ({activeRequests.length})</TabsTrigger>
                      <TabsTrigger value="history">History ({completedRequests.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-3 pr-3">
                          {pendingRequests.length === 0 ? (
                            <Card className="text-center py-8"><CardContent><p className="text-muted-foreground">No pending requests</p></CardContent></Card>
                          ) : pendingRequests.map(request => (
                            <RequestCard key={request.id} request={request} selectedId={selectedRequest?.id} onClick={() => setSelectedRequest(request)} />
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="active">
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-3 pr-3">
                          {activeRequests.length === 0 ? (
                            <Card className="text-center py-8"><CardContent><p className="text-muted-foreground">No active pickups</p></CardContent></Card>
                          ) : activeRequests.map(request => (
                            <RequestCard key={request.id} request={request} selectedId={selectedRequest?.id} onClick={() => setSelectedRequest(request)} showStatus />
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="history">
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-3 pr-3">
                          {completedRequests.length === 0 ? (
                            <Card className="text-center py-8"><CardContent><p className="text-muted-foreground">No history yet</p></CardContent></Card>
                          ) : completedRequests.map(request => (
                            <RequestCard key={request.id} request={request} selectedId={selectedRequest?.id} onClick={() => setSelectedRequest(request)} showStatus dimmed />
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="lg:col-span-2">
                  <RequestDetailPanel 
                    request={selectedRequest} 
                    mode="incoming"
                    onAccept={() => selectedRequest && handleAcceptRequest(selectedRequest.id)}
                    onReject={() => selectedRequest && handleRejectRequest(selectedRequest.id)}
                    onComplete={() => selectedRequest && handleCompletePickup(selectedRequest.id)}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* OUTGOING REQUESTS (as requester) */}
          <TabsContent value="outgoing">
            {outgoingRequests.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold mb-2">No requests made</h3>
                  <p className="text-muted-foreground mb-4">
                    When you request to pick up a donated item, it will appear here.
                  </p>
                  <Link to="/browse">
                    <Button variant="outline">Browse Items</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="pending">Pending ({myPendingRequests.length})</TabsTrigger>
                      <TabsTrigger value="active">Accepted ({myActiveRequests.length})</TabsTrigger>
                      <TabsTrigger value="history">History ({myCompletedRequests.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-3 pr-3">
                          {myPendingRequests.length === 0 ? (
                            <Card className="text-center py-8"><CardContent><p className="text-muted-foreground">No pending requests</p></CardContent></Card>
                          ) : myPendingRequests.map(request => (
                            <RequestCard key={request.id} request={request} selectedId={selectedRequest?.id} onClick={() => setSelectedRequest(request)} showDonor />
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="active">
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-3 pr-3">
                          {myActiveRequests.length === 0 ? (
                            <Card className="text-center py-8"><CardContent><p className="text-muted-foreground">No accepted requests</p></CardContent></Card>
                          ) : myActiveRequests.map(request => (
                            <RequestCard key={request.id} request={request} selectedId={selectedRequest?.id} onClick={() => setSelectedRequest(request)} showStatus showDonor />
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="history">
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-3 pr-3">
                          {myCompletedRequests.length === 0 ? (
                            <Card className="text-center py-8"><CardContent><p className="text-muted-foreground">No history yet</p></CardContent></Card>
                          ) : myCompletedRequests.map(request => (
                            <RequestCard key={request.id} request={request} selectedId={selectedRequest?.id} onClick={() => setSelectedRequest(request)} showStatus showDonor dimmed />
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="lg:col-span-2">
                  <RequestDetailPanel 
                    request={selectedRequest} 
                    mode="outgoing"
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DonorPickupRequests;
