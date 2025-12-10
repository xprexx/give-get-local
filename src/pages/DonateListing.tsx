import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Heart, Upload, X, MapPin, Image as ImageIcon, Package, CheckCircle } from "lucide-react";

const DonateListing = () => {
  const { user, categories, createDonationListing } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    condition: "good",
    pickupLocation: "",
    customCategory: "",
    customSubcategory: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedCategory = categories.find(c => c.name === formData.category);
  const isOtherCategory = formData.category === "__other__";
  const isOtherSubcategory = formData.subcategory === "__other__";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload up to 5 images per listing.",
        variant: "destructive",
      });
      return;
    }

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit.`,
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one image of your item.",
        variant: "destructive",
      });
      return;
    }

    const finalCategory = isOtherCategory ? formData.customCategory : formData.category;
    const finalSubcategory = isOtherSubcategory ? formData.customSubcategory : formData.subcategory;

    if (!formData.title || !formData.description || !finalCategory || !formData.pickupLocation) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isOtherCategory && !formData.customCategory.trim()) {
      toast({
        title: "Missing category",
        description: "Please specify your custom category.",
        variant: "destructive",
      });
      return;
    }

    if (isOtherSubcategory && !formData.customSubcategory.trim()) {
      toast({
        title: "Missing subcategory",
        description: "Please specify your custom subcategory.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Save the listing
    createDonationListing({
      title: formData.title,
      description: formData.description,
      images,
      category: finalCategory,
      subcategory: finalSubcategory || undefined,
      condition: formData.condition,
      pickupLocation: formData.pickupLocation,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Listing created!",
      description: "Your donation listing has been published successfully.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto text-center py-12">
              <CardContent>
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Listing Created!</h2>
                <p className="text-muted-foreground mb-8">
                  Your donation listing has been published. Someone in need will be able to find it and reach out.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => {
                    setIsSubmitted(false);
                    setImages([]);
                    setFormData({
                      title: "",
                      description: "",
                      category: "",
                      subcategory: "",
                      condition: "good",
                      pickupLocation: "",
                      customCategory: "",
                      customSubcategory: "",
                    });
                  }}>
                    Donate Another Item
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/browse')}>
                    Browse Items
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Heart className="w-3 h-3 mr-1" />
              Make a Difference
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Donate an Item
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              List items you no longer need and help someone in your community. Your donation could change someone's life.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Photos
                  </CardTitle>
                  <CardDescription>
                    Upload up to 5 clear photos of your item. First image will be the main photo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                        <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>
                        )}
                      </div>
                    ))}
                    
                    {images.length < 5 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                        <Upload className="w-6 h-6" />
                        <span className="text-xs text-center">Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Item Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Item Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Item Name *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Wooden Dining Table, Winter Jacket, Children's Books"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      maxLength={100}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ 
                          ...formData, 
                          category: value, 
                          subcategory: "", 
                          customCategory: "",
                          customSubcategory: "" 
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {categories.map(cat => (
                            <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                          <SelectItem value="__other__">Others (specify below)</SelectItem>
                        </SelectContent>
                      </Select>
                      {isOtherCategory && (
                        <Input
                          placeholder="Enter your category"
                          value={formData.customCategory}
                          onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                          maxLength={50}
                          className="mt-2"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select
                        value={formData.subcategory}
                        onValueChange={(value) => setFormData({ ...formData, subcategory: value, customSubcategory: "" })}
                        disabled={isOtherCategory ? false : (!selectedCategory || selectedCategory.subcategories.length === 0)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            isOtherCategory 
                              ? "Select or specify subcategory" 
                              : selectedCategory 
                                ? "Select subcategory" 
                                : "Select category first"
                          } />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {!isOtherCategory && selectedCategory?.subcategories.map(sub => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                          <SelectItem value="__other__">Others (specify below)</SelectItem>
                        </SelectContent>
                      </Select>
                      {isOtherSubcategory && (
                        <Input
                          placeholder="Enter your subcategory"
                          value={formData.customSubcategory}
                          onChange={(e) => setFormData({ ...formData, customSubcategory: e.target.value })}
                          maxLength={50}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({ ...formData, condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New (unused, with tags)</SelectItem>
                        <SelectItem value="like-new">Like New (excellent condition)</SelectItem>
                        <SelectItem value="good">Good (minor signs of use)</SelectItem>
                        <SelectItem value="fair">Fair (visible wear but functional)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item - include details like size, color, brand, any defects, and why you're donating it..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      maxLength={1000}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {formData.description.length}/1000
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Pickup Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Pickup Location
                  </CardTitle>
                  <CardDescription>
                    Where can the recipient collect this item?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation">Location / Area *</Label>
                    <Input
                      id="pickupLocation"
                      placeholder="e.g., Tampines MRT, Bedok North, Toa Payoh Central"
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground">
                      Tip: Use a general area or nearby MRT station for safety
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Section */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Publishing..." : "Publish Donation Listing"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonateListing;
