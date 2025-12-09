import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Tags, CheckCircle, XCircle, Clock, FolderTree, Pencil, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';

const AdminCategories = () => {
  const { 
    categories, 
    categoryProposals, 
    reviewCategoryProposal,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory
  } = useAuth();
  const { toast } = useToast();

  const [editCategoryDialog, setEditCategoryDialog] = useState<{ open: boolean; name: string; newName: string }>({ open: false, name: '', newName: '' });
  const [addCategoryDialog, setAddCategoryDialog] = useState<{ open: boolean; name: string }>({ open: false, name: '' });
  const [editSubcategoryDialog, setEditSubcategoryDialog] = useState<{ open: boolean; category: string; oldName: string; newName: string }>({ open: false, category: '', oldName: '', newName: '' });
  const [addSubcategoryDialog, setAddSubcategoryDialog] = useState<{ open: boolean; category: string; name: string }>({ open: false, category: '', name: '' });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: 'category' | 'subcategory'; category: string; subcategory?: string }>({ open: false, type: 'category', category: '' });

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

  const handleAddCategory = () => {
    if (!addCategoryDialog.name.trim()) return;
    addCategory(addCategoryDialog.name.trim());
    toast({ title: 'Category added', description: `"${addCategoryDialog.name}" has been created.` });
    setAddCategoryDialog({ open: false, name: '' });
  };

  const handleUpdateCategory = () => {
    if (!editCategoryDialog.newName.trim()) return;
    updateCategory(editCategoryDialog.name, editCategoryDialog.newName.trim());
    toast({ title: 'Category updated', description: `Category renamed to "${editCategoryDialog.newName}".` });
    setEditCategoryDialog({ open: false, name: '', newName: '' });
  };

  const handleDeleteCategory = () => {
    deleteCategory(deleteDialog.category);
    toast({ title: 'Category deleted', description: `"${deleteDialog.category}" has been removed.` });
    setDeleteDialog({ open: false, type: 'category', category: '' });
  };

  const handleAddSubcategory = () => {
    if (!addSubcategoryDialog.name.trim()) return;
    addSubcategory(addSubcategoryDialog.category, addSubcategoryDialog.name.trim());
    toast({ title: 'Subcategory added', description: `"${addSubcategoryDialog.name}" added to ${addSubcategoryDialog.category}.` });
    setAddSubcategoryDialog({ open: false, category: '', name: '' });
  };

  const handleUpdateSubcategory = () => {
    if (!editSubcategoryDialog.newName.trim()) return;
    updateSubcategory(editSubcategoryDialog.category, editSubcategoryDialog.oldName, editSubcategoryDialog.newName.trim());
    toast({ title: 'Subcategory updated', description: `Subcategory renamed to "${editSubcategoryDialog.newName}".` });
    setEditSubcategoryDialog({ open: false, category: '', oldName: '', newName: '' });
  };

  const handleDeleteSubcategory = () => {
    deleteSubcategory(deleteDialog.category, deleteDialog.subcategory!);
    toast({ title: 'Subcategory deleted', description: `"${deleteDialog.subcategory}" has been removed.` });
    setDeleteDialog({ open: false, type: 'category', category: '' });
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5" />
                  Current Categories ({categories.length})
                </CardTitle>
                <CardDescription>Active donation categories and their subcategories</CardDescription>
              </div>
              <Dialog open={addCategoryDialog.open} onOpenChange={(open) => setAddCategoryDialog({ ...addCategoryDialog, open })}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>Create a new donation category</DialogDescription>
                  </DialogHeader>
                  <Input
                    placeholder="Category name"
                    value={addCategoryDialog.name}
                    onChange={(e) => setAddCategoryDialog({ ...addCategoryDialog, name: e.target.value })}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddCategoryDialog({ open: false, name: '' })}>Cancel</Button>
                    <Button onClick={handleAddCategory}>Add Category</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.name} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Tags className="h-4 w-4 text-primary" />
                      {category.name}
                    </h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditCategoryDialog({ open: true, name: category.name, newName: category.name })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteDialog({ open: true, type: 'category', category: category.name })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {category.subcategories.map((sub) => (
                      <Badge 
                        key={sub} 
                        variant="secondary" 
                        className="text-xs flex items-center gap-1 pr-1"
                      >
                        {sub}
                        <button
                          className="ml-1 hover:text-primary"
                          onClick={() => setEditSubcategoryDialog({ open: true, category: category.name, oldName: sub, newName: sub })}
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          className="hover:text-destructive"
                          onClick={() => setDeleteDialog({ open: true, type: 'subcategory', category: category.name, subcategory: sub })}
                        >
                          <XCircle className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setAddSubcategoryDialog({ open: true, category: category.name, name: '' })}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Subcategory
                  </Button>
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

        {pendingProposals.length === 0 && reviewedProposals.length === 0 && categories.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Tags className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No categories yet.</p>
              <p className="text-sm">Add categories using the button above.</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Edit Category Dialog */}
      <Dialog open={editCategoryDialog.open} onOpenChange={(open) => setEditCategoryDialog({ ...editCategoryDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Rename the category "{editCategoryDialog.name}"</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Category name"
            value={editCategoryDialog.newName}
            onChange={(e) => setEditCategoryDialog({ ...editCategoryDialog, newName: e.target.value })}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCategoryDialog({ open: false, name: '', newName: '' })}>Cancel</Button>
            <Button onClick={handleUpdateCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={editSubcategoryDialog.open} onOpenChange={(open) => setEditSubcategoryDialog({ ...editSubcategoryDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>Rename the subcategory "{editSubcategoryDialog.oldName}" in {editSubcategoryDialog.category}</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Subcategory name"
            value={editSubcategoryDialog.newName}
            onChange={(e) => setEditSubcategoryDialog({ ...editSubcategoryDialog, newName: e.target.value })}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSubcategoryDialog({ open: false, category: '', oldName: '', newName: '' })}>Cancel</Button>
            <Button onClick={handleUpdateSubcategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={addSubcategoryDialog.open} onOpenChange={(open) => setAddSubcategoryDialog({ ...addSubcategoryDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription>Add a new subcategory to {addSubcategoryDialog.category}</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Subcategory name"
            value={addSubcategoryDialog.name}
            onChange={(e) => setAddSubcategoryDialog({ ...addSubcategoryDialog, name: e.target.value })}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSubcategoryDialog({ open: false, category: '', name: '' })}>Cancel</Button>
            <Button onClick={handleAddSubcategory}>Add Subcategory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {deleteDialog.type === 'category' 
                ? `Are you sure you want to delete "${deleteDialog.category}" and all its subcategories?`
                : `Are you sure you want to delete the subcategory "${deleteDialog.subcategory}" from ${deleteDialog.category}?`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, type: 'category', category: '' })}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={deleteDialog.type === 'category' ? handleDeleteCategory : handleDeleteSubcategory}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;