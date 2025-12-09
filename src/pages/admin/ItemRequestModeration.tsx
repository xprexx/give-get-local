import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, ArrowLeft, MapPin, Calendar, CheckCircle, XCircle, 
  Clock, Search, AlertTriangle, Trash2, User 
} from "lucide-react";
import { format } from "date-fns";

const ItemRequestModeration = () => {
  const { itemRequests, users, approveItemRequest, rejectItemRequest, deleteItemRequest } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");

  const pendingRequests = itemRequests.filter(req => req.moderationStatus === 'pending');
  const approvedRequests = itemRequests.filter(req => req.moderationStatus === 'approved');
  const rejectedRequests = itemRequests.filter(req => req.moderationStatus === 'rejected');

  const getRequesterName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || "Unknown";
  };

  const getRequesterEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.email || "";
  };

  const handleApprove = (requestId: string) => {
    approveItemRequest(requestId);
    toast({
      title: "Request Approved",
      description: "The item request is now visible to donors.",
    });
  };

  const openRejectDialog = (requestId: string) => {
    setSelectedRequestId(requestId);
    setRejectionNote("");
    setRejectDialogOpen(true);
  };

  const handleReject = () => {
    if (selectedRequestId && rejectionNote.trim()) {
      rejectItemRequest(selectedRequestId, rejectionNote);
      toast({
        title: "Request Rejected",
        description: "The beneficiary has been notified of the rejection.",
      });
      setRejectDialogOpen(false);
      setSelectedRequestId(null);
      setRejectionNote("");
    }
  };

  const handleDelete = (requestId: string) => {
    deleteItemRequest(requestId);
    toast({
      title: "Request Removed",
      description: "The item request has been permanently removed.",
      variant: "destructive",
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive' as const;
      case 'medium': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  const filterRequests = (requests: typeof itemRequests) => {
    if (!searchQuery) return requests;
    return requests.filter(req =>
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const RequestCard = ({ request, showActions = true, showDelete = false }: { 
    request: typeof itemRequests[0]; 
    showActions?: boolean;
    showDelete?: boolean;
  }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{request.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <User className="w-3 h-3" />
              {getRequesterName(request.userId)} ({getRequesterEmail(request.userId)})
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Badge variant={getUrgencyColor(request.urgency)}>
              {request.urgency === 'high' ? 'Urgent' : request.urgency === 'medium' ? 'Moderate' : 'Low'}
            </Badge>
            {request.isCustomCategory && (
              <Badge variant="secondary" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                Custom Category
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{request.category}</Badge>
        </div>

        <p className="text-muted-foreground text-sm">
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

        {request.moderationNote && (
          <div className="p-3 bg-destructive/10 rounded-lg text-sm">
            <strong>Rejection Note:</strong> {request.moderationNote}
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-2 border-t border-border">
            <Button 
              onClick={() => handleApprove(request.id)} 
              className="flex-1 gap-2"
              variant="default"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </Button>
            <Button 
              onClick={() => openRejectDialog(request.id)} 
              className="flex-1 gap-2"
              variant="destructive"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
          </div>
        )}

        {showDelete && (
          <div className="flex gap-2 pt-2 border-t border-border">
            <Button 
              onClick={() => handleDelete(request.id)} 
              className="flex-1 gap-2"
              variant="destructive"
            >
              <Trash2 className="w-4 h-4" />
              Remove Request
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-xl font-bold">Item Request Moderation</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Approved ({approvedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="w-4 h-4" />
              Rejected ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {filterRequests(pendingRequests).length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <CheckCircle className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
                  <p className="text-muted-foreground">
                    All item requests have been reviewed.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterRequests(pendingRequests).map((request) => (
                  <RequestCard key={request.id} request={request} showActions={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved">
            {filterRequests(approvedRequests).length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Approved Requests</h3>
                  <p className="text-muted-foreground">
                    No requests have been approved yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterRequests(approvedRequests).map((request) => (
                  <RequestCard key={request.id} request={request} showActions={false} showDelete={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected">
            {filterRequests(rejectedRequests).length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <XCircle className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Rejected Requests</h3>
                  <p className="text-muted-foreground">
                    No requests have been rejected.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterRequests(rejectedRequests).map((request) => (
                  <RequestCard key={request.id} request={request} showActions={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Item Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionNote">Reason for rejection *</Label>
              <Textarea
                id="rejectionNote"
                placeholder="Explain why this request is being rejected..."
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                This note will be visible to the beneficiary.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionNote.trim()}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemRequestModeration;