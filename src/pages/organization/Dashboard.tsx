import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Building2, Tags, FileText, Clock, CheckCircle, XCircle, LogOut, AlertCircle, DollarSign, Calendar, Users } from 'lucide-react';

const OrganizationDashboard = () => {
  const { user, organizations, categoryProposals, logout } = useAuth();

  const myOrg = organizations.find(o => o.userId === user?.id);
  const myProposals = categoryProposals.filter(p => p.organizationId === myOrg?.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-amber-600" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return { text: 'Your organization is approved!', color: 'text-green-600', bg: 'bg-green-50 border-green-200' };
      case 'rejected':
        return { text: 'Your registration was rejected. Please contact support.', color: 'text-destructive', bg: 'bg-red-50 border-red-200' };
      default:
        return { text: 'Your registration is pending approval.', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    }
  };

  const statusInfo = myOrg ? getStatusMessage(myOrg.status) : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Organization Dashboard</h1>
            <p className="text-muted-foreground">{myOrg?.name || user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline">View Site</Button>
            </Link>
            <Button variant="ghost" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Status Banner */}
        {myOrg && statusInfo && (
          <div className={`p-4 rounded-lg border mb-8 flex items-center gap-3 ${statusInfo.bg}`}>
            {getStatusIcon(myOrg.status)}
            <div>
              <p className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</p>
              {myOrg.status === 'pending' && (
                <p className="text-sm text-muted-foreground">
                  You can still set up your profile while waiting for approval.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Accepted Categories</CardTitle>
              <Tags className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myOrg?.acceptedCategories.length || 0}</div>
              <p className="text-xs text-muted-foreground">categories you accept</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejected Categories</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myOrg?.rejectedCategories.length || 0}</div>
              <p className="text-xs text-muted-foreground">categories you don't accept</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Category Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myProposals.length}</div>
              <p className="text-xs text-muted-foreground">
                {myProposals.filter(p => p.status === 'pending').length} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/organization/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Organization Profile
                </CardTitle>
                <CardDescription>
                  Update your organization's description and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Edit Profile</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/organization/categories">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5 text-secondary" />
                  Category Preferences
                </CardTitle>
                <CardDescription>
                  Set which donation categories you accept or reject
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">Manage Categories</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/organization/crowdfunding">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Crowdfunding
                </CardTitle>
                <CardDescription>
                  Create and manage fundraising campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">Manage Campaigns</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/organization/volunteer-events">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  Volunteer Events
                </CardTitle>
                <CardDescription>
                  Create events and find volunteers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">Manage Events</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Proposal History */}
        {myProposals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Category Proposals</CardTitle>
              <CardDescription>Track the status of categories you've proposed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myProposals.map((proposal) => (
                  <div key={proposal.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(proposal.status)}
                      <div>
                        <p className="font-medium">
                          {proposal.categoryName}
                          {proposal.subcategory && ` / ${proposal.subcategory}`}
                        </p>
                        <p className="text-sm text-muted-foreground">{proposal.description}</p>
                      </div>
                    </div>
                    <Badge variant={proposal.status === 'approved' ? 'default' : proposal.status === 'rejected' ? 'destructive' : 'secondary'}>
                      {proposal.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Getting Started */}
        {(!myOrg?.description || myOrg?.acceptedCategories.length === 0) && (
          <Card className="mt-8 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Getting Started
              </CardTitle>
              <CardDescription>Complete these steps to set up your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {myOrg?.description ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className={myOrg?.description ? 'text-muted-foreground line-through' : ''}>
                    Add your organization description
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {myOrg && myOrg.acceptedCategories.length > 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className={myOrg && myOrg.acceptedCategories.length > 0 ? 'text-muted-foreground line-through' : ''}>
                    Select categories you accept
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default OrganizationDashboard;
