import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Eye } from "lucide-react";

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
}

interface DonationCardProps {
  item: DonationItem;
}

const DonationCard = ({ item }: DonationCardProps) => {
  return (
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
        <Button variant="default" className="w-full">
          Request Pickup
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DonationCard;
