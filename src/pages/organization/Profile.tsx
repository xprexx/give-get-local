import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Save } from 'lucide-react';

const OrganizationProfile = () => {
  const { user, organizations, updateOrganization } = useAuth();
  const { toast } = useToast();

  const myOrg = organizations.find(o => o.userId === user?.id);

  const [name, setName] = useState(myOrg?.name || '');
  const [description, setDescription] = useState(myOrg?.description || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (myOrg) {
      setName(myOrg.name);
      setDescription(myOrg.description);
    }
  }, [myOrg]);

  const handleSave = () => {
    setIsSaving(true);
    updateOrganization({ name, description });
    toast({ title: 'Profile updated', description: 'Your organization profile has been saved.' });
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/organization" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Organization Profile</h1>
          <p className="text-muted-foreground">Update your organization's information</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>
              This information will be visible to donors on the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Willing Hearts Singapore"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-description">Description</Label>
              <Textarea
                id="org-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell donors about your organization, your mission, and how donations help..."
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                A good description helps donors understand your mission and increases donations.
              </p>
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tips for a Great Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Explain your organization's mission clearly
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Mention specific programs or initiatives you run
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Share the impact donations have made
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Include your operating hours or locations in Singapore
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrganizationProfile;
