import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, ArrowLeft, Calendar, Clock, Mail, Phone, 
  CheckCircle, XCircle, User, Hourglass 
} from "lucide-react";
import { format } from "date-fns";

interface VolunteerRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  experience: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// Mock events for reference
const mockEvents = [
  { id: "1", title: "Weekend Meal Preparation", date: "2024-12-21", spotsTotal: 30, spotsFilled: 22 },
  { id: "2", title: "Animal Shelter Cleaning Day", date: "2024-12-22", spotsTotal: 20, spotsFilled: 15 },
];

// Mock registrations
const mockRegistrations: VolunteerRegistration[] = [
  {
    id: "reg-1",
    eventId: "1",
    eventTitle: "Weekend Meal Preparation",
    eventDate: "2024-12-21",
    name: "Emily Wong",
    email: "emily@example.com",
    phone: "+65 9111 2222",
    age: 24,
    experience: "I've volunteered at food banks before and I'm comfortable with food preparation.",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "reg-2",
    eventId: "1",
    eventTitle: "Weekend Meal Preparation",
    eventDate: "2024-12-21",
    name: "James Lim",
    email: "james@example.com",
    phone: "+65 8222 3333",
    age: 32,
    experience: "First time volunteering but very eager to learn and help out!",
    status: "pending",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "reg-3",
    eventId: "2",
    eventTitle: "Animal Shelter Cleaning Day",
    eventDate: "2024-12-22",
    name: "Rachel Tan",
    email: "rachel@example.com",
    phone: "+65 9333 4444",
    age: 19,
    experience: "I love animals! I have 2 dogs at home and I'm comfortable around pets.",
    status: "pending",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "reg-4",
    eventId: "1",
    eventTitle: "Weekend Meal Preparation",
    eventDate: "2024-12-21",
    name: "David Ng",
    email: "david@example.com",
    phone: "+65 8444 5555",
    age: 45,
    experience: "Professional chef with 20 years experience. Happy to help teach others.",
    status: "approved",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "reg-5",
    eventId: "2",
    eventTitle: "Animal Shelter Cleaning Day",
    eventDate: "2024-12-22",
    name: "Priya Kumar",
    email: "priya@example.com",
    phone: "+65 9555 6666",
    age: 16,
    experience: "",
    status: "rejected",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

const OrganizationVolunteerApprovals = () => {
  const { user, organizations } = useAuth();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<VolunteerRegistration[]>(mockRegistrations);
  const [events, setEvents] = useState(mockEvents);

  const myOrg = organizations.find(o => o.userId === user?.id);

  const pendingRegistrations = registrations.filter(r => r.status === "pending");
  const approvedRegistrations = registrations.filter(r => r.status === "approved");
  const rejectedRegistrations = registrations.filter(r => r.status === "rejected");

  const handleApprove = (registrationId: string) => {
    const registration = registrations.find(r => r.id === registrationId);
    if (!registration) return;

    // Update registration status
    setRegistrations(prev => prev.map(r => 
      r.id === registrationId ? { ...r, status: "approved" as const } : r
    ));

    // Update event spots
    setEvents(prev => prev.map(e => 
      e.id === registration.eventId 
        ? { ...e, spotsFilled: e.spotsFilled + 1 }
        : e
    ));

    toast({
      title: "Volunteer Approved",
      description: `${registration.name} has been approved for ${registration.eventTitle}.`,
    });
  };

  const handleReject = (registrationId: string) => {
    const registration = registrations.find(r => r.id === registrationId);
    if (!registration) return;

    setRegistrations(prev => prev.map(r => 
      r.id === registrationId ? { ...r, status: "rejected" as const } : r
    ));

    toast({
      title: "Volunteer Rejected",
      description: `${registration.name}'s application has been declined.`,
    });
  };

  const getEventStats = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const pending = registrations.filter(r => r.eventId === eventId && r.status === "pending").length;
    return { event, pending };
  };

  const RegistrationCard = ({ registration }: { registration: VolunteerRegistration }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">{registration.name}</h4>
                <p className="text-sm text-muted-foreground">Age: {registration.age}</p>
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg mb-4">
              <p className="text-sm font-medium mb-1">For Event:</p>
              <p className="text-sm">{registration.eventTitle}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(registration.eventDate), 'EEEE, MMMM d, yyyy')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{registration.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{registration.phone}</span>
              </div>
            </div>

            {registration.experience && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Experience:</p>
                <p className="text-sm text-muted-foreground">{registration.experience}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Applied {format(new Date(registration.createdAt), 'MMM d, yyyy h:mm a')}</span>
            </div>
          </div>

          {registration.status === "pending" && (
            <div className="flex md:flex-col gap-2 w-full md:w-auto">
              <Button 
                className="flex-1 md:flex-none gap-2"
                onClick={() => handleApprove(registration.id)}
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 md:flex-none gap-2"
                onClick={() => handleReject(registration.id)}
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </div>
          )}

          {registration.status === "approved" && (
            <Badge variant="success" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              Approved
            </Badge>
          )}

          {registration.status === "rejected" && (
            <Badge variant="outline" className="gap-1">
              <XCircle className="w-3 h-3" />
              Rejected
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/organization/volunteer-events">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Volunteer Approvals</span>
              </div>
            </div>
            <Badge variant="outline">{myOrg?.name}</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Hourglass className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRegistrations.length}</div>
              <p className="text-xs text-muted-foreground">awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedRegistrations.length}</div>
              <p className="text-xs text-muted-foreground">volunteers confirmed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedRegistrations.length}</div>
              <p className="text-xs text-muted-foreground">applications declined</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Hourglass className="w-4 h-4" />
              Pending ({pendingRegistrations.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Approved ({approvedRegistrations.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="w-4 h-4" />
              Rejected ({rejectedRegistrations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingRegistrations.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <CheckCircle className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">
                    No pending volunteer applications to review.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingRegistrations.map(reg => (
                <RegistrationCard key={reg.id} registration={reg} />
              ))
            )}
          </TabsContent>

          <TabsContent value="approved">
            {approvedRegistrations.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Approved Volunteers Yet</h3>
                  <p className="text-muted-foreground">
                    Approved volunteers will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              approvedRegistrations.map(reg => (
                <RegistrationCard key={reg.id} registration={reg} />
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected">
            {rejectedRegistrations.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <XCircle className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Rejected Applications</h3>
                  <p className="text-muted-foreground">
                    Rejected applications will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              rejectedRegistrations.map(reg => (
                <RegistrationCard key={reg.id} registration={reg} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OrganizationVolunteerApprovals;