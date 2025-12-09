import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Tags, CheckCircle, XCircle, Clock, FolderTree } from 'lucide-react';
import { format } from 'date-fns';

const AdminCategories = () => {
  const { categories, categoryProposals, reviewCategoryProposal } = useAuth();
  const { toast } = useToast();

  const pendingProposals = categoryProposals.filter(p => p.status === 'pending');
  const reviewedProposals = categoryProposals.filter(p => p.status !== 'pending');

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

  const handleApprove = (proposalId: string, categoryName: string) => {
    reviewCategoryProposal(proposalId, 'approved');
    toast({ title: 'Category approved', description: `"${categoryName}" has been added to the system.` });
  };

  const handleReject = (proposalId: string, categoryName: string) => {
    reviewCategoryProposal(proposalId, 'rejected');
    toast({ title: 'Category rejected', description: `"${categoryName}" proposal has been rejected.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
          <p className="text-muted-foreground">Review category proposals and manage donation categories</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Pending Proposals */}
        {pendingProposals.length > 0 && (
          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50/50">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Pending Proposals ({pendingProposals.length})
              </CardTitle>
              <CardDescription>Category proposals from organizations awaiting review</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {pendingProposals.map((proposal) => (
                  <div key={proposal.id} className="p-4 border rounded-lg bg-card">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Tags className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">
                            {proposal.categoryName}
                            {proposal.subcategory && (
                              <span className="text-muted-foreground font-normal">
                                {' '}/ {proposal.subcategory}
                              </span>
                            )}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Proposed by: {proposal.organizationName}
                        </p>
                        <p className="text-sm">{proposal.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Submitted: {format(new Date(proposal.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(proposal.id, proposal.categoryName)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(proposal.id, proposal.categoryName)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Current Categories ({categories.length})
            </CardTitle>
            <CardDescription>Active donation categories and their subcategories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.name} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Tags className="h-4 w-4 text-primary" />
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {category.subcategories.map((sub) => (
                      <Badge key={sub} variant="secondary" className="text-xs">
                        {sub}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proposal History */}
        {reviewedProposals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Proposal History</CardTitle>
              <CardDescription>Previously reviewed category proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Proposed By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewedProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">
                        {proposal.categoryName}
                        {proposal.subcategory && ` / ${proposal.subcategory}`}
                      </TableCell>
                      <TableCell>{proposal.organizationName}</TableCell>
                      <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(proposal.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {pendingProposals.length === 0 && reviewedProposals.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Tags className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No category proposals yet.</p>
              <p className="text-sm">Organizations can propose new categories from their dashboard.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminCategories;
