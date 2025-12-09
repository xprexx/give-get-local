import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const AdminOrganizations = () => {
  const { organizations, approveOrganization, rejectOrganization, users } = useAuth();
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
    }
  };

  const getOrgUser = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const handleApprove = (orgId: string, orgName: string) => {
    approveOrganization(orgId);
    toast({ title: 'Organization approved', description: `${orgName} has been approved.` });
  };

  const handleReject = (orgId: string, orgName: string) => {
    rejectOrganization(orgId);
    toast({ title: 'Organization rejected', description: `${orgName} has been rejected.` });
  };

  const pendingOrgs = organizations.filter(o => o.status === 'pending');
  const otherOrgs = organizations.filter(o => o.status !== 'pending');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Organization Management</h1>
          <p className="text-muted-foreground">Review and approve organization registrations</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Pending Organizations */}
        {pendingOrgs.length > 0 && (
          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50/50">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Pending Approvals ({pendingOrgs.length})
              </CardTitle>
              <CardDescription>Organizations waiting for your review</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {pendingOrgs.map((org) => {
                  const orgUser = getOrgUser(org.userId);
                  return (
                    <div key={org.id} className="p-4 border rounded-lg bg-card">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-lg">{org.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Contact: {orgUser?.email || 'N/A'}
                          </p>
                          <p className="text-sm">
                            {org.description || 'No description provided yet.'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Applied: {format(new Date(org.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(org.id, org.name)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleReject(org.id, org.name)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Organizations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              All Organizations ({organizations.length})
            </CardTitle>
            <CardDescription>Complete list of registered organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Accepted Categories</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No organizations registered yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  organizations.map((org) => {
                    const orgUser = getOrgUser(org.userId);
                    return (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium">{org.name}</TableCell>
                        <TableCell>{orgUser?.email || 'N/A'}</TableCell>
                        <TableCell>{getStatusBadge(org.status)}</TableCell>
                        <TableCell>
                          {org.acceptedCategories.length > 0 ? (
                            <span className="text-sm">{org.acceptedCategories.length} categories</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">Not configured</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(org.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          {org.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-600"
                                onClick={() => handleApprove(org.id, org.name)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive"
                                onClick={() => handleReject(org.id, org.name)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : org.status === 'rejected' ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600"
                              onClick={() => handleApprove(org.id, org.name)}
                            >
                              Approve
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminOrganizations;
