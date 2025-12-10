import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { 
  Heart, ArrowLeft, MapPin, Calendar, Clock, MessageSquare, 
  CheckCircle, XCircle, Send, User, Package 
} from "lucide-react";
import { format } from "date-fns";

interface PickupRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemLocation: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  preferredDate: string;
  preferredTime: string;
  alternativeDate?: string;
  alternativeTime?: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

// Mock pickup requests
const mockRequests: PickupRequest[] = [
  {
    id: "req-1",
    itemId: "item-1",
    itemTitle: "Gently Used Winter Jacket",
    itemImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
    itemLocation: "Toa Payoh, Singapore",
    requesterId: "user-123",
    requesterName: "Sarah Chen",
    requesterEmail: "sarah@example.com",
    requesterPhone: "+65 9123 4567",
    preferredDate: "2024-12-22",
    preferredTime: "14:00",
    alternativeDate: "2024-12-23",
    alternativeTime: "10:00",
    message: "Hi! I'm interested in this jacket for my dad. Is it still available? I can come anytime this weekend.",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: "msg-1",
        senderId: "user-123",
        senderName: "Sarah Chen",
        message: "Hi! I'm interested in this jacket for my dad. Is it still available? I can come anytime this weekend.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      }
    ],
  },
  {
    id: "req-2",
    itemId: "item-2",
    itemTitle: "Children's Books Collection",
    itemImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop",
    itemLocation: "Tampines, Singapore",
    requesterId: "user-456",
    requesterName: "Michael Tan",
    requesterEmail: "michael@example.com",
    requesterPhone: "+65 8765 4321",
    preferredDate: "2024-12-21",
    preferredTime: "18:00",
    message: "These would be perfect for my classroom! Can we arrange pickup after school hours?",
    status: "accepted",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: "msg-2",
        senderId: "user-456",
        senderName: "Michael Tan",
        message: "These would be perfect for my classroom! Can we arrange pickup after school hours?",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg-3",
        senderId: "donor-1",
        senderName: "You",
        message: "Hi Michael! Yes, 6pm works great for me. I'll meet you at the void deck of Block 123.",
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg-4",
        senderId: "user-456",
        senderName: "Michael Tan",
        message: "Perfect! See you then. Thank you so much!",
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

const DonorPickupRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [requests, setRequests] = useState<PickupRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const pendingRequests = requests.filter(r => r.status === "pending");
  const activeRequests = requests.filter(r => r.status === "accepted");
  const completedRequests = requests.filter(r => r.status === "completed" || r.status === "rejected");

  const handleAcceptRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: "accepted" as const } : r
    ));
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(prev => prev ? { ...prev, status: "accepted" } : null);
    }
    // Note: In a real implementation, notifications would be created server-side
    toast({
      title: "Request Accepted",
      description: "You can now chat with the requester to coordinate pickup.",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: "rejected" as const } : r
    ));
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(prev => prev ? { ...prev, status: "rejected" } : null);
    }
    toast({
      title: "Request Declined",
      description: "The requester will be notified.",
    });
  };

  const handleCompletePickup = (requestId: string) => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: "completed" as const } : r
    ));
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(prev => prev ? { ...prev, status: "completed" } : null);
    }
    toast({
      title: "Pickup Completed!",
      description: "Thank you for your donation. You've made a difference!",
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRequest) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "donor-1",
      senderName: "You",
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    setRequests(prev => prev.map(r => 
      r.id === selectedRequest.id 
        ? { ...r, messages: [...r.messages, newMsg] }
        : r
    ));
    setSelectedRequest(prev => 
      prev ? { ...prev, messages: [...prev.messages, newMsg] } : null
    );
    setNewMessage("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary">Pending</Badge>;
      case "accepted": return <Badge variant="default">Accepted</Badge>;
      case "completed": return <Badge variant="success">Completed</Badge>;
      case "rejected": return <Badge variant="outline">Declined</Badge>;
      default: return null;
    }
  };

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
                              src={request.itemImage} 
                              alt={request.itemTitle}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">{request.itemTitle}</h4>
                              <p className="text-xs text-muted-foreground">by {request.requesterName}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Clock className="w-3 h-3" />
                                <span>{format(new Date(request.createdAt), 'MMM d, h:mm a')}</span>
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
                              src={request.itemImage} 
                              alt={request.itemTitle}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm truncate">{request.itemTitle}</h4>
                                {getStatusBadge(request.status)}
                              </div>
                              <p className="text-xs text-muted-foreground">with {request.requesterName}</p>
                              <div className="flex items-center gap-1 text-xs text-primary mt-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>{request.messages.length} messages</span>
                              </div>
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
                              src={request.itemImage} 
                              alt={request.itemTitle}
                              className="w-16 h-16 rounded-lg object-cover grayscale-[30%]"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm truncate">{request.itemTitle}</h4>
                                {getStatusBadge(request.status)}
                              </div>
                              <p className="text-xs text-muted-foreground">with {request.requesterName}</p>
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

          {/* Chat/Detail Panel */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <Card className="h-[calc(100vh-200px)] flex flex-col">
                <CardHeader className="border-b flex-shrink-0">
                  <div className="flex items-start gap-4">
                    <img 
                      src={selectedRequest.itemImage} 
                      alt={selectedRequest.itemTitle}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{selectedRequest.itemTitle}</CardTitle>
                        {getStatusBadge(selectedRequest.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{selectedRequest.requesterName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedRequest.itemLocation}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Preferred: {selectedRequest.preferredDate} at {selectedRequest.preferredTime}</span>
                        </div>
                      </div>
                      {selectedRequest.alternativeDate && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Alternative: {selectedRequest.alternativeDate} at {selectedRequest.alternativeTime}
                        </div>
                      )}
                    </div>
                  </div>

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
                    <Button 
                      className="w-full mt-4 gap-2 bg-green-600 hover:bg-green-700" 
                      onClick={() => handleCompletePickup(selectedRequest.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Picked Up
                    </Button>
                  )}
                </CardHeader>

                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedRequest.messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex ${msg.senderName === "You" ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${msg.senderName === "You" ? 'order-2' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">{msg.senderName}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(msg.timestamp), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <div className={`p-3 rounded-lg ${
                            msg.senderName === "You" 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                {(selectedRequest.status === "accepted" || selectedRequest.status === "pending") && (
                  <div className="border-t p-4 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="h-[calc(100vh-200px)] flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Request</h3>
                  <p className="text-muted-foreground">
                    Choose a pickup request from the list to view details and chat with the requester.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorPickupRequests;