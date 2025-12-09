import { ArrowLeft, FileText, Check, X, Download, User as UserIcon, Building2, HandHeart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AdminVerifications = () => {
  const { users, organizations, approveUser, rejectUser, approveOrganization, rejectOrganization } = useAuth();
  const { toast } = useToast();

  // Get pending beneficiaries
  const pendingBeneficiaries = users.filter(u => u.role === 'beneficiary' && u.status === 'pending');
  
  // Get pending organizations with their documents
  const pendingOrgs = organizations.filter(o => o.status === 'pending').map(org => {
    const orgUser = users.find(u => u.id === org.userId);
    return { ...org, user: orgUser };
  });

  const handleApproveBeneficiary = (userId: string, userName: string) => {
    approveUser(userId);
    toast({
      title: 'Beneficiary Approved',
      description: `${userName} has been verified and can now access the platform.`,
    });
  };

  const handleRejectBeneficiary = (userId: string, userName: string) => {
    rejectUser(userId);
    toast({
      title: 'Beneficiary Rejected',
      description: `${userName}'s verification has been rejected.`,
      variant: 'destructive',
    });
  };

  const handleApproveOrg = (orgId: string, orgName: string) => {
    approveOrganization(orgId);
    toast({
      title: 'Organization Approved',
      description: `${orgName} has been verified and can now access the platform.`,
    });
  };

  const handleRejectOrg = (orgId: string, orgName: string) => {
    rejectOrganization(orgId);
    toast({
      title: 'Organization Rejected',
      description: `${orgName}'s verification has been rejected.`,
      variant: 'destructive',
    });
  };

  const downloadDocument = (base64Data: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = fileName || 'verification-document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderDocumentPreview = (base64Data: string, fileName: string) => {
    const isImage = base64Data.startsWith('data:image');
    const isPdf = base64Data.startsWith('data:application/pdf');

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            View Document
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{fileName || 'Verification Document'}</DialogTitle>
            <DialogDescription>Review the submitted verification document</DialogDescription>
          </DialogHeader>
          <div className="overflow-auto max-h-[60vh]">
            {isImage && (
              <img src={base64Data} alt="Verification document" className="w-full h-auto" />
            )}
            {isPdf && (
              <iframe src={base64Data} className="w-full h-[500px]" title="PDF Document" />
            )}
            {!isImage && !isPdf && (
              <p className="text-muted-foreground text-center py-8">
                Unable to preview this document type. Please download to view.
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => downloadDocument(base64Data, fileName)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const totalPending = pendingBeneficiaries.length + pendingOrgs.length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Verification Requests</h1>
            <p className="text-muted-foreground">Review and approve user verification documents</p>
          </div>
          {totalPending > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {totalPending} pending
            </Badge>
          )}
        </div>

        {/* Pending Beneficiaries */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HandHeart className="h-5 w-5 text-amber-600" />
              <CardTitle>Pending Beneficiary Verifications</CardTitle>
            </div>
            <CardDescription>
              Users requesting beneficiary status with CPF statement verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingBeneficiaries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No pending beneficiary verifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingBeneficiaries.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Registered: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.verificationDocument && renderDocumentPreview(
                        user.verificationDocument, 
                        user.verificationDocumentName || 'cpf-statement'
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRejectBeneficiary(user.id, user.name)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApproveBeneficiary(user.id, user.name)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Organizations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Pending Organization Verifications</CardTitle>
            </div>
            <CardDescription>
              Organizations requesting verification with supporting documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingOrgs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No pending organization verifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingOrgs.map(org => (
                  <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-sm text-muted-foreground">{org.user?.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Registered: {new Date(org.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {org.verificationDocument && renderDocumentPreview(
                        org.verificationDocument, 
                        org.verificationDocumentName || 'organization-document'
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRejectOrg(org.id, org.name)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApproveOrg(org.id, org.name)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminVerifications;