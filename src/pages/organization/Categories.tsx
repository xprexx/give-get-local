import { useState } from 'react';
import { useAuth, SubcategoryPreference } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Tags, Plus, CheckCircle, XCircle, Save, ChevronDown, ChevronRight } from 'lucide-react';

const OrganizationCategories = () => {
  const { user, organizations, categories, updateOrganization, submitCategoryProposal } = useAuth();
  const { toast } = useToast();

  const myOrg = organizations.find(o => o.userId === user?.id);

  const [acceptedCategories, setAcceptedCategories] = useState<string[]>(myOrg?.acceptedCategories || []);
  const [rejectedCategories, setRejectedCategories] = useState<string[]>(myOrg?.rejectedCategories || []);
  const [subcategoryPreferences, setSubcategoryPreferences] = useState<SubcategoryPreference[]>(
    myOrg?.subcategoryPreferences || []
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');

  const toggleCategoryExpand = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const getSubcategoryPref = (categoryName: string): SubcategoryPreference => {
    return subcategoryPreferences.find(p => p.category === categoryName) || {
      category: categoryName,
      acceptedSubcategories: [],
      rejectedSubcategories: [],
    };
  };

  const updateSubcategoryPref = (categoryName: string, pref: SubcategoryPreference) => {
    setSubcategoryPreferences(prev => {
      const existing = prev.find(p => p.category === categoryName);
      if (existing) {
        return prev.map(p => p.category === categoryName ? pref : p);
      }
      return [...prev, pref];
    });
  };

  const toggleSubcategory = (categoryName: string, subcategory: string, type: 'accept' | 'reject') => {
    const pref = getSubcategoryPref(categoryName);
    
    if (type === 'accept') {
      const isAccepted = pref.acceptedSubcategories.includes(subcategory);
      updateSubcategoryPref(categoryName, {
        ...pref,
        acceptedSubcategories: isAccepted
          ? pref.acceptedSubcategories.filter(s => s !== subcategory)
          : [...pref.acceptedSubcategories, subcategory],
        rejectedSubcategories: pref.rejectedSubcategories.filter(s => s !== subcategory),
      });
    } else {
      const isRejected = pref.rejectedSubcategories.includes(subcategory);
      updateSubcategoryPref(categoryName, {
        ...pref,
        rejectedSubcategories: isRejected
          ? pref.rejectedSubcategories.filter(s => s !== subcategory)
          : [...pref.rejectedSubcategories, subcategory],
        acceptedSubcategories: pref.acceptedSubcategories.filter(s => s !== subcategory),
      });
    }
  };

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

  const acceptAllSubcategories = (categoryName: string, subcategories: string[]) => {
    updateSubcategoryPref(categoryName, {
      category: categoryName,
      acceptedSubcategories: subcategories,
      rejectedSubcategories: [],
    });
  };

  const rejectAllSubcategories = (categoryName: string, subcategories: string[]) => {
    updateSubcategoryPref(categoryName, {
      category: categoryName,
      acceptedSubcategories: [],
      rejectedSubcategories: subcategories,
    });
  };

  const clearSubcategoryPrefs = (categoryName: string) => {
    updateSubcategoryPref(categoryName, {
      category: categoryName,
      acceptedSubcategories: [],
      rejectedSubcategories: [],
    });
  };

  const handleSave = () => {
    updateOrganization({ acceptedCategories, rejectedCategories, subcategoryPreferences });
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
      organization_id: myOrg?.id || '',
      category_name: newCategory,
      subcategory: newSubcategory || undefined,
      description: proposalDescription,
    });

    toast({ title: 'Proposal submitted', description: 'Your category proposal has been sent for review.' });
    setNewCategory('');
    setNewSubcategory('');
    setProposalDescription('');
    setProposalOpen(false);
  };

  const getAcceptedSubcategoriesCount = () => {
    return subcategoryPreferences.reduce((sum, pref) => sum + pref.acceptedSubcategories.length, 0);
  };

  const getRejectedSubcategoriesCount = () => {
    return subcategoryPreferences.reduce((sum, pref) => sum + pref.rejectedSubcategories.length, 0);
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
          <p className="text-muted-foreground">Configure which donation categories and subcategories you accept</p>
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
                      Select categories and specific subcategories you accept or don't accept
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
                    {categories.map((category) => {
                      const pref = getSubcategoryPref(category.name);
                      const isExpanded = expandedCategories.includes(category.name);
                      
                      return (
                        <Collapsible key={category.name} open={isExpanded} onOpenChange={() => toggleCategoryExpand(category.name)}>
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <CollapsibleTrigger asChild>
                                <button className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                  {category.name}
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {category.subcategories.length} subcategories
                                  </Badge>
                                </button>
                              </CollapsibleTrigger>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant={acceptedCategories.includes(category.name) ? 'default' : 'outline'}
                                  className={acceptedCategories.includes(category.name) ? 'bg-green-600 hover:bg-green-700' : ''}
                                  onClick={() => toggleCategory(category.name, 'accept')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept All
                                </Button>
                                <Button
                                  size="sm"
                                  variant={rejectedCategories.includes(category.name) ? 'destructive' : 'outline'}
                                  onClick={() => toggleCategory(category.name, 'reject')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject All
                                </Button>
                              </div>
                            </div>
                            
                            {/* Quick subcategory badges */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {pref.acceptedSubcategories.length > 0 && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  {pref.acceptedSubcategories.length} accepted
                                </Badge>
                              )}
                              {pref.rejectedSubcategories.length > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {pref.rejectedSubcategories.length} rejected
                                </Badge>
                              )}
                            </div>

                            <CollapsibleContent>
                              <div className="mt-4 pt-4 border-t space-y-3">
                                <div className="flex gap-2 mb-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => acceptAllSubcategories(category.name, category.subcategories)}
                                  >
                                    Accept All Subcategories
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => rejectAllSubcategories(category.name, category.subcategories)}
                                  >
                                    Reject All Subcategories
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs"
                                    onClick={() => clearSubcategoryPrefs(category.name)}
                                  >
                                    Clear
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {category.subcategories.map((sub) => {
                                    const isAccepted = pref.acceptedSubcategories.includes(sub);
                                    const isRejected = pref.rejectedSubcategories.includes(sub);
                                    
                                    return (
                                      <div
                                        key={sub}
                                        className={`flex items-center justify-between p-2 rounded-md border ${
                                          isAccepted ? 'bg-green-50 border-green-200' :
                                          isRejected ? 'bg-red-50 border-red-200' : ''
                                        }`}
                                      >
                                        <span className="text-sm">{sub}</span>
                                        <div className="flex gap-1">
                                          <Button
                                            size="sm"
                                            variant={isAccepted ? 'default' : 'ghost'}
                                            className={`h-7 w-7 p-0 ${isAccepted ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                            onClick={() => toggleSubcategory(category.name, sub, 'accept')}
                                          >
                                            <CheckCircle className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant={isRejected ? 'destructive' : 'ghost'}
                                            className="h-7 w-7 p-0"
                                            onClick={() => toggleSubcategory(category.name, sub, 'reject')}
                                          >
                                            <XCircle className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="accepted">
                    {acceptedCategories.length === 0 && getAcceptedSubcategoriesCount() === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        You haven't accepted any categories yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {acceptedCategories.map((cat) => (
                          <div key={cat} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                            <div>
                              <span className="font-medium text-green-800">{cat}</span>
                              <Badge className="ml-2 bg-green-100 text-green-700 text-xs">All subcategories</Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleCategory(cat, 'accept')}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        
                        {/* Show specific subcategory preferences */}
                        {subcategoryPreferences
                          .filter(pref => pref.acceptedSubcategories.length > 0 && !acceptedCategories.includes(pref.category))
                          .map((pref) => (
                            <div key={pref.category} className="p-3 border rounded-lg bg-green-50/50">
                              <div className="font-medium text-green-800 mb-2">{pref.category}</div>
                              <div className="flex flex-wrap gap-1">
                                {pref.acceptedSubcategories.map((sub) => (
                                  <Badge key={sub} className="bg-green-100 text-green-700 text-xs">
                                    {sub}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="rejected">
                    {rejectedCategories.length === 0 && getRejectedSubcategoriesCount() === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        You haven't rejected any categories.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {rejectedCategories.map((cat) => (
                          <div key={cat} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                            <div>
                              <span className="font-medium text-red-800">{cat}</span>
                              <Badge variant="destructive" className="ml-2 text-xs">All subcategories</Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleCategory(cat, 'reject')}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        
                        {/* Show specific subcategory preferences */}
                        {subcategoryPreferences
                          .filter(pref => pref.rejectedSubcategories.length > 0 && !rejectedCategories.includes(pref.category))
                          .map((pref) => (
                            <div key={pref.category} className="p-3 border rounded-lg bg-red-50/50">
                              <div className="font-medium text-red-800 mb-2">{pref.category}</div>
                              <div className="flex flex-wrap gap-1">
                                {pref.rejectedSubcategories.map((sub) => (
                                  <Badge key={sub} variant="destructive" className="text-xs">
                                    {sub}
                                  </Badge>
                                ))}
                              </div>
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
                  <span className="text-muted-foreground">Full categories accepted</span>
                  <Badge className="bg-green-100 text-green-700">
                    {acceptedCategories.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subcategories accepted</span>
                  <Badge className="bg-green-100 text-green-700">
                    {getAcceptedSubcategoriesCount()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Full categories rejected</span>
                  <Badge variant="destructive">
                    {rejectedCategories.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subcategories rejected</span>
                  <Badge variant="destructive">
                    {getRejectedSubcategoriesCount()}
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
                  <strong className="text-foreground">Be specific:</strong> Use subcategory selection to fine-tune what you accept.
                </p>
                <p>
                  <strong className="text-foreground">Example:</strong> Accept "Clothing" but reject "Children" subcategory if you only serve adults.
                </p>
                <p>
                  <strong className="text-foreground">Expand categories:</strong> Click on a category name to see and manage its subcategories.
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