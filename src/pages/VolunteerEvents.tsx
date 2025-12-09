import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, MapPin, Calendar, Clock, Users, Building2, CheckCircle } from "lucide-react";
import { format } from "date-fns";

// Mock volunteer events data
const mockEvents = [
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
];

const VolunteerEvents = () => {
  const { organizations } = useAuth();

  const upcomingEvents = mockEvents.filter(e => e.status === 'upcoming');
  const fullEvents = mockEvents.filter(e => e.status === 'full');

  const getSpotsRemaining = (total: number, filled: number) => total - filled;

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
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join volunteer events organized by verified charity organizations. 
              Your time and effort can change lives.
            </p>
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
                <div className="text-2xl font-bold">500+</div>
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
                      
                      <Button className="w-full">Sign Up to Volunteer</Button>
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
                <Button size="lg" variant="secondary" className="font-semibold">
                  Post a Volunteer Event
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VolunteerEvents;
