import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus, ArrowLeft, Clock, Users, MapPin, Edit, Trash2, CheckCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";

// Mock data - in real app this would come from context/API
const mockEvents = [
  {
    id: "1",
    title: "Weekend Meal Preparation",
    description: "Help prepare and pack meals for elderly and low-income families. No cooking experience required!",
    location: "8 Lorong 8 Toa Payoh, Singapore 319254",
    date: "2024-12-21",
    startTime: "08:00",
    endTime: "12:00",
    spotsTotal: 30,
    spotsFilled: 22,
    status: "upcoming" as const,
    requirements: ["Bring own apron", "Comfortable shoes"],
  },
];

const OrganizationVolunteerEvents = () => {
  const { user, organizations } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState(mockEvents);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    spotsTotal: "",
    requirements: "",
  });

  const myOrg = organizations.find(o => o.userId === user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location || !formData.date || 
        !formData.startTime || !formData.endTime || !formData.spotsTotal) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newEvent = {
      id: `event-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      spotsTotal: parseInt(formData.spotsTotal),
      spotsFilled: 0,
      status: "upcoming" as const,
      requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r),
    };

    setEvents([...events, newEvent]);
    toast({
      title: "Event Created",
      description: "Your volunteer event has been created successfully.",
    });

    setFormData({ title: "", description: "", location: "", date: "", startTime: "", endTime: "", spotsTotal: "", requirements: "" });
    setIsDialogOpen(false);
  };

  const handleDelete = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    toast({
      title: "Event Deleted",
      description: "Your event has been removed.",
    });
  };

  const getSpotsRemaining = (total: number, filled: number) => total - filled;

  const totalVolunteers = events.reduce((sum, e) => sum + e.spotsFilled, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/organization">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Volunteer Events</span>
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
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.filter(e => e.status === 'upcoming').length}</div>
              <p className="text-xs text-muted-foreground">events scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVolunteers}</div>
              <p className="text-xs text-muted-foreground">signed up</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open Spots</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.reduce((sum, e) => sum + getSpotsRemaining(e.spotsTotal, e.spotsFilled), 0)}
              </div>
              <p className="text-xs text-muted-foreground">available</p>
            </CardContent>
          </Card>
        </div>

        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">My Events</h1>
            <p className="text-muted-foreground">
              Manage your volunteer events
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/organization/volunteer-approvals">
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Volunteer Approvals
              </Button>
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Volunteer Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Weekend Meal Preparation"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the volunteer activity..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., 8 Lorong 8 Toa Payoh, Singapore 319254"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spotsTotal">Number of Volunteers *</Label>
                    <Input
                      id="spotsTotal"
                      type="number"
                      min="1"
                      placeholder="e.g., 20"
                      value={formData.spotsTotal}
                      onChange={(e) => setFormData({ ...formData, spotsTotal: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                  <Input
                    id="requirements"
                    placeholder="e.g., Bring own apron, Comfortable shoes"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Create Event
                </Button>
              </form>
            </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first volunteer event to find dedicated volunteers.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            <Badge variant={getSpotsRemaining(event.spotsTotal, event.spotsFilled) > 0 ? 'default' : 'secondary'}>
                              {getSpotsRemaining(event.spotsTotal, event.spotsFilled) > 0 
                                ? `${getSpotsRemaining(event.spotsTotal, event.spotsFilled)} spots left` 
                                : 'Full'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">{event.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event.spotsFilled}/{event.spotsTotal} volunteers</span>
                        </div>
                      </div>

                      {event.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {event.requirements.map((req, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganizationVolunteerEvents;
