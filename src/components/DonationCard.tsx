import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Clock, Eye, CheckCircle, MessageSquare, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface DonationItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  durability: string;
  location: string;
  distance: string;
  postedAt: string;
  views: number;
  donorId?: string;
}

interface DonationCardProps {
  item: DonationItem;
}

const DonationCard = ({ item }: DonationCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    alternativeDate: "",
    alternativeTime: "",
    message: "",
  });

  const handleRequestPickup = () => {
    setRequestSuccess(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      alternativeDate: "",
      alternativeTime: "",
      message: "",
    });
    setIsRequestDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.preferredDate || !formData.preferredTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setRequestSuccess(true);
    
    toast({
      title: "Pickup Request Sent!",
      description: "The donor will review your request and get back to you.",
    });
  };

  const closeDialog = () => {
    setIsRequestDialogOpen(false);
    setRequestSuccess(false);
  };

  return (
    <>
      <Card className="group overflow-hidden cursor-pointer hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="success">{item.category}</Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {item.durability}
            </Badge>
          </div>
        </div>
        
        <CardContent className="pt-4">
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {item.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{item.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{item.postedAt}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{item.views}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button variant="default" className="w-full" onClick={handleRequestPickup}>
            Request Pickup
          </Button>
        </CardFooter>
      </Card>

      {/* Request Pickup Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {requestSuccess ? "Request Sent!" : `Request Pickup: ${item.title}`}
            </DialogTitle>
          </DialogHeader>
          
          {requestSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pickup Request Sent!</h3>
              <p className="text-muted-foreground mb-4">
                Your pickup request has been sent to the donor. They will review your proposed timing and get back to you.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg text-left text-sm space-y-2 mb-4">
                <p><strong>Item:</strong> {item.title}</p>
                <p><strong>Pickup Location:</strong> {item.location}</p>
                <p><strong>Your Preferred Time:</strong> {formData.preferredDate} at {formData.preferredTime}</p>
                {formData.alternativeDate && (
                  <p><strong>Alternative Time:</strong> {formData.alternativeDate} at {formData.alternativeTime}</p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                The donor may propose alternative timings. You will be notified at {formData.email}.
              </p>
              <Button className="mt-6" onClick={closeDialog}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Item Info */}
              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">{item.durability}</Badge>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Tan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+65 9123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Preferred Timing */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">Propose Your Pickup Timing</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date *</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Time *</Label>
                    <Input
                      id="preferredTime"
                      type="time"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Alternative Timing */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alternativeDate">Alternative Date (Optional)</Label>
                  <Input
                    id="alternativeDate"
                    type="date"
                    value={formData.alternativeDate}
                    onChange={(e) => setFormData({ ...formData, alternativeDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternativeTime">Alternative Time</Label>
                  <Input
                    id="alternativeTime"
                    type="time"
                    value={formData.alternativeTime}
                    onChange={(e) => setFormData({ ...formData, alternativeTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message to Donor (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Any special requests or questions? The donor can respond to negotiate timing..."
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                The donor will review your request and may propose alternative timings. You'll be notified via email to continue the conversation.
              </p>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Pickup Request"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonationCard;