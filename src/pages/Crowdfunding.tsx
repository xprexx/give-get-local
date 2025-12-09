import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Heart, DollarSign, Users, Calendar, Building2, Target, Clock, CreditCard, CheckCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface Campaign {
  id: string;
  organizationId: string;
  organizationName: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  image: string;
  supporters: number;
  status: "active" | "completed";
}

const Crowdfunding = () => {
  const { organizations } = useAuth();
  const { toast } = useToast();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      organizationId: "org-1",
      organizationName: "Willing Hearts Singapore",
      title: "New Kitchen Equipment for Community Meals",
      description: "Help us upgrade our kitchen facilities to serve 10,000 meals daily to the elderly, disabled, and low-income families across Singapore.",
      targetAmount: 50000,
      currentAmount: 32500,
      startDate: "2024-11-01",
      endDate: "2025-01-31",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
      supporters: 245,
      status: "active" as const,
    },
    {
      id: "2",
      organizationId: "org-2",
      organizationName: "MINDS Singapore",
      title: "Vocational Training Equipment",
      description: "Fund specialized equipment for our vocational training center to help persons with intellectual disabilities gain employment skills.",
      targetAmount: 30000,
      currentAmount: 18750,
      startDate: "2024-12-01",
      endDate: "2025-02-28",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      supporters: 156,
      status: "active" as const,
    },
    {
      id: "3",
      organizationId: "org-3",
      organizationName: "SPCA Singapore",
      title: "Animal Shelter Expansion",
      description: "Help us expand our shelter facilities to rescue and care for more abandoned animals in Singapore.",
      targetAmount: 100000,
      currentAmount: 67800,
      startDate: "2024-10-15",
      endDate: "2025-01-15",
      image: "https://images.unsplash.com/photo-1601758124096-1fd661873b95?w=600&h=400&fit=crop",
      supporters: 523,
      status: "active" as const,
    },
    {
      id: "4",
      organizationId: "org-4",
      organizationName: "Salvation Army Singapore",
      title: "Winter Clothing Drive 2025",
      description: "Provide warm clothing to migrant workers and low-income families during the monsoon season.",
      targetAmount: 15000,
      currentAmount: 15000,
      startDate: "2024-09-01",
      endDate: "2024-11-30",
      image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop",
      supporters: 312,
      status: "completed" as const,
    },
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');

  const totalRaised = campaigns.reduce((sum, c) => sum + c.currentAmount, 0);
  const totalSupporters = campaigns.reduce((sum, c) => sum + c.supporters, 0);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (endDate: string) => {
    const days = differenceInDays(new Date(endDate), new Date());
    return Math.max(0, days);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDonateClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDonationAmount("");
    setPaymentSuccess(false);
    setIsPaymentDialogOpen(true);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(donationAmount);
    if (!amount || amount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount (minimum $1).",
        variant: "destructive",
      });
      return;
    }

    if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      toast({
        title: "Missing Card Details",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update campaign with new donation
    setCampaigns(prev => prev.map(c => {
      if (c.id === selectedCampaign?.id) {
        return {
          ...c,
          currentAmount: c.currentAmount + amount,
          supporters: c.supporters + 1,
        };
      }
      return c;
    }));

    setIsProcessing(false);
    setPaymentSuccess(true);
    setCardDetails({ cardNumber: "", expiry: "", cvv: "", name: "" });
  };

  const closePaymentDialog = () => {
    setIsPaymentDialogOpen(false);
    setSelectedCampaign(null);
    setDonationAmount("");
    setPaymentSuccess(false);
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
              Crowdfunding
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Fund a Cause
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Support verified charity organizations with their fundraising campaigns. 
              Every dollar makes a difference.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{formatCurrency(totalRaised)}</div>
                <div className="text-xs text-muted-foreground">Total Raised</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <Target className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold">{activeCampaigns.length}</div>
                <div className="text-xs text-muted-foreground">Active Campaigns</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{totalSupporters.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Supporters</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <Building2 className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold">{completedCampaigns.length}</div>
                <div className="text-xs text-muted-foreground">Funded Campaigns</div>
              </CardContent>
            </Card>
          </div>

          {/* Active Campaigns */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Active Campaigns</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCampaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <Badge className="absolute top-3 right-3 bg-primary">
                      <Clock className="w-3 h-3 mr-1" />
                      {getDaysRemaining(campaign.endDate)} days left
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {campaign.organizationName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{campaign.organizationName}</span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{campaign.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-foreground">
                          {formatCurrency(campaign.currentAmount)}
                        </span>
                        <span className="text-muted-foreground">
                          of {formatCurrency(campaign.targetAmount)}
                        </span>
                      </div>
                      <Progress 
                        value={getProgressPercentage(campaign.currentAmount, campaign.targetAmount)} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{campaign.supporters} supporters</span>
                      </div>
                      <span>{Math.round(getProgressPercentage(campaign.currentAmount, campaign.targetAmount))}% funded</span>
                    </div>

                    <Button className="w-full" onClick={() => handleDonateClick(campaign)}>
                      Donate Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Completed Campaigns */}
          {completedCampaigns.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Successfully Funded</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="overflow-hidden opacity-90">
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-full object-cover grayscale-[30%]"
                      />
                      <Badge className="absolute top-3 right-3" variant="success">
                        <Heart className="w-3 h-3 mr-1" fill="currentColor" />
                        Funded
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {campaign.organizationName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{campaign.organizationName}</span>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{campaign.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold text-foreground">
                            {formatCurrency(campaign.currentAmount)}
                          </span>
                          <span className="text-muted-foreground">raised</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{campaign.supporters} supporters</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Ended {format(new Date(campaign.endDate), 'MMM yyyy')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* CTA for Organizations */}
          <section className="mt-16">
            <Card className="bg-gradient-hero text-primary-foreground p-8 md:p-12">
              <CardContent className="p-0 text-center">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Are You a Charity Organization?</h2>
                <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                  Start a crowdfunding campaign to raise funds for your cause. 
                  Join our community of verified organizations making a difference in Singapore.
                </p>
                <Button size="lg" variant="secondary" className="font-semibold">
                  Start a Campaign
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={closePaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {paymentSuccess ? "Thank You!" : `Donate to ${selectedCampaign?.title}`}
            </DialogTitle>
          </DialogHeader>
          
          {paymentSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground mb-4">
                Your donation of {formatCurrency(parseFloat(donationAmount))} has been processed.
              </p>
              <p className="text-sm text-muted-foreground">
                Thank you for supporting {selectedCampaign?.organizationName}!
              </p>
              <Button className="mt-6" onClick={closePaymentDialog}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Donation Amount (SGD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="50"
                    className="pl-10"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {[10, 25, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDonationAmount(amount.toString())}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  <span>Card Details (Demo)</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card *</Label>
                  <Input
                    id="cardName"
                    placeholder="John Tan"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry *</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                This is a demo payment. No actual charges will be made.
              </p>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closePaymentDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Donate ${donationAmount ? formatCurrency(parseFloat(donationAmount)) : ""}`}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Crowdfunding;