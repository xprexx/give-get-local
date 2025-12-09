import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Tags, Plus, CheckCircle, XCircle, Save } from 'lucide-react';

const OrganizationCategories = () => {
  const { user, organizations, categories, updateOrganization, submitCategoryProposal } = useAuth();
  const { toast } = useToast();

  const myOrg = organizations.find(o => o.userId === user?.id);

  const [acceptedCategories, setAcceptedCategories] = useState<string[]>(myOrg?.acceptedCategories || []);
  const [rejectedCategories, setRejectedCategories] = useState<string[]>(myOrg?.rejectedCategories || []);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');

  const toggleCategory = (categoryName: string, type: 'accept' | 'reject') => {
    if (type === 'accept') {
      if (acceptedCategories.includes(categoryName)) {
        setAcceptedCategories(prev => prev.filter(c => c !== categoryName));
      } else {
        setAcceptedCategories(prev => [...prev, categoryName]);
        setRejectedCategories(prev => prev.filter(c => c !== categoryName));
      }
    } else {
      if (rejectedCategories.includes(categoryName)) {
        setRejectedCategories(prev => prev.filter(c => c !== categoryName));
      } else {
        setRejectedCategories(prev => [...prev, categoryName]);
        setAcceptedCategories(prev => prev.filter(c => c !== categoryName));
      }
    }
  };

  const handleSave = () => {
    updateOrganization({ acceptedCategories, rejectedCategories });
    toast({ title: 'Categories updated', description: 'Your category preferences have been saved.' });
  };

  const handleProposalSubmit = () => {
    if (!newCategory.trim()) {
      toast({ title: 'Error', description: 'Please enter a category name.', variant: 'destructive' });
      return;
    }
    if (!proposalDescription.trim()) {
      toast({ title: 'Error', description: 'Please provide a description.', variant: 'destructive' });
      return;
    }

    submitCategoryProposal({
      organizationId: myOrg?.id || '',
      organizationName: myOrg?.name || '',
      categoryName: newCategory,
      subcategory: newSubcategory || undefined,
      description: proposalDescription,
    });

    toast({ title: 'Proposal submitted', description: 'Your category proposal has been sent for review.' });
    setNewCategory('');
    setNewSubcategory('');
    setProposalDescription('');
    setProposalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/organization" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Category Preferences</h1>
          <p className="text-muted-foreground">Configure which donation categories you accept</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Categories Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Tags className="h-5 w-5 text-primary" />
                      Donation Categories
                    </CardTitle>
                    <CardDescription>
                      Select categories you accept or explicitly don't accept
                    </CardDescription>
                  </div>
                  <Dialog open={proposalOpen} onOpenChange={setProposalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Propose New
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Propose New Category</DialogTitle>
                        <DialogDescription>
                          Suggest a new donation category for the platform
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-category">Category Name</Label>
                          <Input
                            id="new-category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="e.g., Medical Equipment"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-subcategory">Subcategory (optional)</Label>
                          <Input
                            id="new-subcategory"
                            value={newSubcategory}
                            onChange={(e) => setNewSubcategory(e.target.value)}
                            placeholder="e.g., Wheelchairs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="proposal-description">Why is this needed?</Label>
                          <Textarea
                            id="proposal-description"
                            value={proposalDescription}
                            onChange={(e) => setProposalDescription(e.target.value)}
                            placeholder="Explain why this category would be useful for donations..."
                            rows={3}
                          />
                        </div>
                        <Button onClick={handleProposalSubmit} className="w-full">
                          Submit Proposal
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Categories</TabsTrigger>
                    <TabsTrigger value="accepted">
                      Accepted ({acceptedCategories.length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Not Accepted ({rejectedCategories.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {categories.map((category) => (
                      <div key={category.name} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{category.name}</h3>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={acceptedCategories.includes(category.name) ? 'default' : 'outline'}
                              className={acceptedCategories.includes(category.name) ? 'bg-green-600 hover:bg-green-700' : ''}
                              onClick={() => toggleCategory(category.name, 'accept')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant={rejectedCategories.includes(category.name) ? 'destructive' : 'outline'}
                              onClick={() => toggleCategory(category.name, 'reject')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Don't Accept
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.map((sub) => (
                            <Badge key={sub} variant="secondary" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="accepted">
                    {acceptedCategories.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        You haven't accepted any categories yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {acceptedCategories.map((cat) => (
                          <div key={cat} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                            <span className="font-medium text-green-800">{cat}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleCategory(cat, 'accept')}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="rejected">
                    {rejectedCategories.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        You haven't rejected any categories.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {rejectedCategories.map((cat) => (
                          <div key={cat} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                            <span className="font-medium text-red-800">{cat}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleCategory(cat, 'reject')}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t">
                  <Button onClick={handleSave} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Accepting</span>
                  <Badge className="bg-green-100 text-green-700">
                    {acceptedCategories.length} categories
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Not accepting</span>
                  <Badge variant="destructive">
                    {rejectedCategories.length} categories
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Unconfigured</span>
                  <Badge variant="outline">
                    {categories.length - acceptedCategories.length - rejectedCategories.length} categories
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Be specific:</strong> Marking categories you don't accept helps donors know what to give.
                </p>
                <p>
                  <strong className="text-foreground">Example:</strong> "No textbooks" helps avoid unusable donations.
                </p>
                <p>
                  <strong className="text-foreground">Propose new:</strong> If you need a category that doesn't exist, submit a proposal!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizationCategories;
