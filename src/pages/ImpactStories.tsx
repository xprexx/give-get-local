import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart, Quote, Play, Users, Gift, Calendar } from "lucide-react";

const impactMedia = [
  {
    id: 1,
    type: "image",
    url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop",
    title: "Community Distribution Day",
    description: "Volunteers distributing donated items to families in Toa Payoh",
    date: "December 2024",
  },
  {
    id: 2,
    type: "image",
    url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop",
    title: "Back to School Drive",
    description: "Children receiving school supplies through our partnership with MINDS Singapore",
    date: "January 2024",
  },
  {
    id: 3,
    type: "image",
    url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop",
    title: "Furniture Donation Event",
    description: "Families picking up donated furniture at our Tampines distribution center",
    date: "November 2024",
  },
  {
    id: 4,
    type: "image",
    url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=600&fit=crop",
    title: "Volunteers Making a Difference",
    description: "Our dedicated volunteers sorting donations at Salvation Army Singapore",
    date: "October 2024",
  },
  {
    id: 5,
    type: "image",
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop",
    title: "Clothing Drive Success",
    description: "Over 500 pieces of clothing distributed to families in need",
    date: "September 2024",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Mdm Tan Siew Ling",
    location: "Bedok",
    avatar: "",
    quote: "As a single mother of three, I was struggling to provide school supplies for my children. Through GiveLocal, I received not just books and stationery, but also uniforms. My children are now able to focus on their studies without worry. Thank you to all the kind donors!",
    itemReceived: "School supplies & uniforms",
    date: "November 2024",
  },
  {
    id: 2,
    name: "Mr. Ahmad bin Hassan",
    location: "Jurong West",
    avatar: "",
    quote: "After losing my job, I couldn't afford to replace our broken refrigerator. A generous donor on GiveLocal gave us a working fridge that has made such a huge difference. We can now store food properly and save money. Allah bless all of you.",
    itemReceived: "Refrigerator",
    date: "October 2024",
  },
  {
    id: 3,
    name: "Mrs. Priya Krishnan",
    location: "Tampines",
    avatar: "",
    quote: "My elderly mother needed a wheelchair after her surgery. Within a week of posting on GiveLocal, we received a brand new wheelchair from a family whose grandmother had passed. This platform truly connects hearts.",
    itemReceived: "Wheelchair",
    date: "September 2024",
  },
  {
    id: 4,
    name: "Mr. Chen Wei Ming",
    location: "Ang Mo Kio",
    avatar: "",
    quote: "I'm a retiree living on CPF. When my washing machine broke down, I thought I would have to hand wash everything. A young family donated their old machine to me. It works perfectly! Singapore has such caring people.",
    itemReceived: "Washing machine",
    date: "August 2024",
  },
  {
    id: 5,
    name: "Ms. Fatimah bte Osman",
    location: "Woodlands",
    avatar: "",
    quote: "My son needed a laptop for his polytechnic studies but we couldn't afford one. Through GiveLocal, a tech professional donated a refurbished laptop that my son now uses daily. His grades have improved so much. We are forever grateful.",
    itemReceived: "Laptop",
    date: "July 2024",
  },
  {
    id: 6,
    name: "Mr. Raju Suppiah",
    location: "Yishun",
    avatar: "",
    quote: "Being disabled and unemployed, I felt hopeless. But the GiveLocal community showed me that Singaporeans care. I received clothes, groceries, and even job referrals. I now have a part-time job. This platform saved me.",
    itemReceived: "Clothing & groceries",
    date: "June 2024",
  },
];

const impactStats = [
  { icon: Gift, value: "15,000+", label: "Items Donated" },
  { icon: Users, value: "3,500+", label: "Families Helped" },
  { icon: Heart, value: "50+", label: "Partner Organizations" },
  { icon: Calendar, value: "100+", label: "Events Organized" },
];

const ImpactStories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Heart className="w-3 h-3 mr-1" />
              Our Impact
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Stories That Inspire
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how GiveLocal is making a difference in Singapore, one donation at a time.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Media Carousel */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-8">Moments of Giving</h2>
            <div className="relative px-12">
              <Carousel className="w-full">
                <CarouselContent>
                  {impactMedia.map((media) => (
                    <CarouselItem key={media.id} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="overflow-hidden group cursor-pointer">
                        <div className="relative aspect-[4/3]">
                          <img
                            src={media.url}
                            alt={media.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {media.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                                <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <Badge variant="secondary" className="mb-2">
                              {media.date}
                            </Badge>
                            <h3 className="text-white font-semibold">{media.title}</h3>
                            <p className="text-white/80 text-sm line-clamp-2">{media.description}</p>
                          </div>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
            </div>
          </section>

          {/* Testimonials Section */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Voices of Gratitude</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from beneficiaries whose lives have been touched by the generosity of our community.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <Quote className="w-8 h-8 text-primary/20" />
                  </div>
                  <CardContent className="p-6 pt-8">
                    <p className="text-muted-foreground mb-6 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex items-start gap-4 pt-4 border-t border-border">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Gift className="w-3 h-3 mr-1" />
                            {testimonial.itemReceived}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-20 text-center">
            <Card className="bg-gradient-hero text-primary-foreground p-12">
              <CardContent className="p-0">
                <h2 className="text-3xl font-bold mb-4">Be Part of the Story</h2>
                <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                  Every donation creates a new story of hope. Join our community of givers today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="font-semibold">
                    Start Donating
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                    Share Your Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImpactStories;
