import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { useVolunteerEvents } from "@/hooks/useVolunteerEvents";
import { Heart, MapPin, Calendar, Clock, Users, Building2, CheckCircle, Hourglass, XCircle } from "lucide-react";
import { format } from "date-fns";

interface VolunteerEvent {
  id: string;
  organizationId: string;
  organizationName: string;
  title: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  spotsTotal: number;
  spotsFilled: number;
  image: string;
  status: "upcoming" | "full";
  requirements: string[];
}

interface VolunteerRegistration {
  id: string;
  eventId: string;
  age: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  organizationName?: string;
}

const VolunteerEvents = () => {
  const { organizations, user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const { registerForEvent, fetchMyRegistrations } = useVolunteerEvents();

  const [events, setEvents] = useState<VolunteerEvent[]>([
    {
      id: "1",
      organizationId: "org-1",
      organizationName: "Willing Hearts Singapore",
      title: "Weekend Meal Preparation",
      description: "Help prepare and pack meals for elderly and low-income families. No cooking experience required!",
      location: "8 Lorong 8 Toa Payoh, Singapore 319254",
      date: "2024-12-21",
      startTime: "08:00",
      endTime: "12:00",
      spotsTotal: 30,
      spotsFilled: 22,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
      status: "upcoming" as const,
      requirements: ["Bring own apron", "Comfortable shoes"],
    },
    {
      id: "2",
      organizationId: "org-2",
      organizationName: "SPCA Singapore",
      title: "Animal Shelter Cleaning Day",
      description: "Help clean and maintain our animal shelter. Interact with rescued animals and make their day brighter!",
      location: "50 Sungei Tengah Road, Singapore 699012",
      date: "2024-12-22",
      startTime: "09:00",
      endTime: "13:00",
      spotsTotal: 20,
      spotsFilled: 15,
      image: "https://images.unsplash.com/photo-1601758124096-1fd661873b95?w=600&h=400&fit=crop",
      status: "upcoming" as const,
      requirements: ["Wear old clothes", "Must love animals"],
    },
    {
      id: "3",
      organizationId: "org-3",
      organizationName: "MINDS Singapore",
      title: "Art Therapy Session Support",
      description: "Assist our therapists in running art therapy sessions for persons with intellectual disabilities.",
      location: "MINDS Towner Gardens, 6 Lengkok Bahru, Singapore 159051",
      date: "2024-12-28",
      startTime: "14:00",
      endTime: "17:00",
      spotsTotal: 10,
      spotsFilled: 6,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      status: "upcoming" as const,
      requirements: ["Prior volunteer experience preferred", "Patient and compassionate"],
    },
    {
      id: "4",
      organizationId: "org-4",
      organizationName: "Salvation Army Singapore",
      title: "Donation Sorting Marathon",
      description: "Help sort, clean, and organize donated items at our distribution center.",
      location: "20 Bishan Street 22, Singapore 579768",
      date: "2025-01-04",
      startTime: "10:00",
      endTime: "16:00",
      spotsTotal: 50,
      spotsFilled: 28,
      image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop",
      status: "upcoming" as const,
      requirements: ["Comfortable lifting boxes", "Lunch will be provided"],
    },
    {
      id: "5",
      organizationId: "org-1",
      organizationName: "Willing Hearts Singapore",
      title: "Christmas Meal Distribution",
      description: "Special Christmas event to distribute festive meals to beneficiaries across Singapore.",
      location: "Various locations island-wide",
      date: "2024-12-25",
      startTime: "10:00",
      endTime: "14:00",
      spotsTotal: 100,
      spotsFilled: 100,
      image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=400&fit=crop",
      status: "full" as const,
      requirements: ["Own transport preferred", "Festive spirit!"],
    },
  ]);

  const [registrations, setRegistrations] = useState<VolunteerRegistration[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<VolunteerEvent | null>(null);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const [isMyRegistrationsOpen, setIsMyRegistrationsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    experience: "",
  });

  const [totalVolunteers, setTotalVolunteers] = useState(500);

  // Load user's registrations from database
  useEffect(() => {
    const loadMyRegistrations = async () => {
      if (user) {
        const data = await fetchMyRegistrations();
        const mapped = data.map((reg: any) => ({
          id: reg.id,
          eventId: reg.event_id,
          age: reg.age,
          status: reg.status,
          createdAt: reg.created_at,
          eventTitle: reg.volunteer_events?.title,
          eventDate: reg.volunteer_events?.event_date,
          eventTime: reg.volunteer_events?.event_time,
          organizationName: reg.volunteer_events?.organizations?.name,
        }));
        setRegistrations(mapped);
      }
    };
    loadMyRegistrations();
  }, [user]);

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const fullEvents = events.filter(e => e.status === 'full');

  const getSpotsRemaining = (total: number, filled: number) => total - filled;

  const handleSignupClick = (event: VolunteerEvent) => {
    setSelectedEvent(event);
    setSignupSuccess(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      age: "",
      experience: "",
    });
    setIsSignupDialogOpen(true);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to register for volunteer events.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!formData.age) {
      toast({
        title: "Missing Information",
        description: "Please enter your age.",
        variant: "destructive",
      });
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 16 || age > 100) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age (16 or above).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await registerForEvent(selectedEvent!.id, age, formData.experience || undefined);

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to register. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Reload registrations after successful signup
    const data = await fetchMyRegistrations();
    const mapped = data.map((reg: any) => ({
      id: reg.id,
      eventId: reg.event_id,
      age: reg.age,
      status: reg.status,
      createdAt: reg.created_at,
      eventTitle: reg.volunteer_events?.title,
      eventDate: reg.volunteer_events?.event_date,
      eventTime: reg.volunteer_events?.event_time,
      organizationName: reg.volunteer_events?.organizations?.name,
    }));
    setRegistrations(mapped);

    setIsSubmitting(false);
    setSignupSuccess(true);
  };

  const closeSignupDialog = () => {
    setIsSignupDialogOpen(false);
    setSelectedEvent(null);
    setSignupSuccess(false);
  };

  const handlePostEventClick = () => {
    if (user?.role === "organization") {
      navigate("/organization/volunteer-events");
    } else if (user) {
      toast({
        title: "Organizations Only",
        description: "Only verified charity organizations can post volunteer events. Register as an organization to access this feature.",
      });
    } else {
      toast({
        title: "Login Required",
        description: "Please log in as an organization to post volunteer events.",
      });
      navigate("/auth");
    }
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
              Volunteer
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Make a Difference
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Join volunteer events organized by verified charity organizations. 
              Your time and effort can change lives.
            </p>
            {user && (
              <Button
                variant="outline"
                onClick={() => setIsMyRegistrationsOpen(true)}
                className="gap-2"
              >
                <Hourglass className="w-4 h-4" />
                My Registrations
                {registrations.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {registrations.length}
                  </Badge>
                )}
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{upcomingEvents.length}</div>
                <div className="text-xs text-muted-foreground">Upcoming Events</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <Users className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold">{totalVolunteers}+</div>
                <div className="text-xs text-muted-foreground">Active Volunteers</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <Building2 className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">15</div>
                <div className="text-xs text-muted-foreground">Partner Organizations</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <Clock className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold">2,400+</div>
                <div className="text-xs text-muted-foreground">Volunteer Hours</div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-48 md:h-auto overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary">
                        {getSpotsRemaining(event.spotsTotal, event.spotsFilled)} spots left
                      </Badge>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {event.organizationName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{event.organizationName}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.spotsFilled}/{event.spotsTotal} volunteers signed up</span>
                        </div>
                      </div>

                      {event.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {event.requirements.map((req, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <Button className="w-full" onClick={() => handleSignupClick(event)}>
                        Sign Up to Volunteer
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Full Events */}
          {fullEvents.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Fully Booked Events</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden opacity-75">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover grayscale-[30%]"
                      />
                      <Badge className="absolute top-3 right-3" variant="secondary">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Fully Booked
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {event.organizationName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{event.organizationName}</span>
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.spotsTotal} volunteers registered</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline" disabled>
                        Event Full
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* CTA for Organizations */}
          <section>
            <Card className="bg-gradient-hero text-primary-foreground p-8 md:p-12">
              <CardContent className="p-0 text-center">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Volunteers for Your Event?</h2>
                <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                  If you're a verified charity organization, you can create volunteer event listings 
                  to find dedicated volunteers for your activities.
                </p>
                <Button size="lg" variant="secondary" className="font-semibold" onClick={handlePostEventClick}>
                  Post a Volunteer Event
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Signup Dialog */}
      <Dialog open={isSignupDialogOpen} onOpenChange={closeSignupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {signupSuccess ? "Application Submitted!" : `Sign Up: ${selectedEvent?.title}`}
            </DialogTitle>
          </DialogHeader>
          
          {signupSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Hourglass className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pending Approval</h3>
              <p className="text-muted-foreground mb-4">
                Your volunteer application for {selectedEvent?.title} has been submitted and is pending approval from the organization.
              </p>
              <div className="text-sm text-muted-foreground space-y-1 mb-4">
                <p><strong>Event:</strong> {selectedEvent?.title}</p>
                <p><strong>Date:</strong> {selectedEvent && format(new Date(selectedEvent.date), 'EEEE, MMMM d, yyyy')}</p>
                <p><strong>Organization:</strong> {selectedEvent?.organizationName}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                You will receive an email at {formData.email} once your application is reviewed.
              </p>
              <Button className="mt-6" onClick={closeSignupDialog}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-1 text-sm">
                <p><strong>Event:</strong> {selectedEvent?.title}</p>
                <p><strong>Date:</strong> {selectedEvent && format(new Date(selectedEvent.date), 'EEEE, MMMM d, yyyy')}</p>
                <p><strong>Time:</strong> {selectedEvent?.startTime} - {selectedEvent?.endTime}</p>
                <p><strong>Spots Remaining:</strong> {selectedEvent && getSpotsRemaining(selectedEvent.spotsTotal, selectedEvent.spotsFilled)}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Tan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="16"
                    max="100"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
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

              <div className="space-y-2">
                <Label htmlFor="experience">Relevant Experience (Optional)</Label>
                <Textarea
                  id="experience"
                  placeholder="Tell us about any relevant volunteering experience..."
                  rows={3}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>

              {selectedEvent?.requirements && selectedEvent.requirements.length > 0 && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Requirements:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    {selectedEvent.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Your application will be reviewed by {selectedEvent?.organizationName}. You will be notified once approved.
              </p>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeSignupDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* My Registrations Dialog */}
      <Dialog open={isMyRegistrationsOpen} onOpenChange={setIsMyRegistrationsOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hourglass className="w-5 h-5" />
              My Registrations
            </DialogTitle>
            <DialogDescription>
              View your volunteer event registrations and their approval status.
            </DialogDescription>
          </DialogHeader>
          
          {registrations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">You haven't registered for any events yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Browse upcoming events and sign up to volunteer!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <Card key={reg.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{reg.eventTitle || "Unknown Event"}</h4>
                      <p className="text-sm text-muted-foreground">{reg.organizationName}</p>
                      {reg.eventDate && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{format(new Date(reg.eventDate), 'MMM d, yyyy')}</span>
                          {reg.eventTime && (
                            <>
                              <Clock className="w-3 h-3 ml-2" />
                              <span>{reg.eventTime}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <Badge 
                      variant={
                        reg.status === 'approved' ? 'default' : 
                        reg.status === 'rejected' ? 'destructive' : 
                        'secondary'
                      }
                    >
                      {reg.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {reg.status === 'pending' && <Hourglass className="w-3 h-3 mr-1" />}
                      {reg.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                      {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default VolunteerEvents;