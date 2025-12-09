import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, RotateCcw, Ban, UserCheck, Users } from 'lucide-react';
import { format } from 'date-fns';

const AdminUsers = () => {
  const { users, resetPassword, banUser, unbanUser } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleBulkBan = () => {
    selectedUsers.forEach(userId => banUser(userId));
    toast({ title: 'Users banned', description: `${selectedUsers.length} user(s) have been banned.` });
    setSelectedUsers([]);
  };

  const handleBulkUnban = () => {
    selectedUsers.forEach(userId => unbanUser(userId));
    toast({ title: 'Users unbanned', description: `${selectedUsers.length} user(s) have been unbanned.` });
    setSelectedUsers([]);
  };

  const handleResetPassword = (userId: string, userName: string) => {
    resetPassword(userId);
    toast({ 
      title: 'Password reset', 
      description: `Password for ${userName} has been reset to "reset123".` 
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'organization':
        return <Badge variant="secondary">Organization</Badge>;
      case 'beneficiary':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Beneficiary</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };

  const getStatusBadge = (user: typeof users[0]) => {
    if (user.isBanned) {
      return <Badge variant="destructive">Banned</Badge>;
    }
    if (user.status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
    if (user.status === 'rejected') {
      return <Badge variant="destructive">Rejected</Badge>;
    }
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Active
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">View and manage all user accounts</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Users ({filteredUsers.length})
                </CardTitle>
                <CardDescription>Manage user accounts, reset passwords, and ban users</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Regular Users</option>
                  <option value="beneficiary">Beneficiaries</option>
                  <option value="organization">Organizations</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg mb-4 flex items-center justify-between">
                <span className="font-medium">{selectedUsers.length} user(s) selected</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive" onClick={handleBulkBan}>
                    <Ban className="h-4 w-4 mr-2" />
                    Ban Selected
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleBulkUnban}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Unban Selected
                  </Button>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className={user.isBanned ? 'opacity-60' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {getStatusBadge(user)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleResetPassword(user.id, user.name)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        {user.isBanned ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              unbanUser(user.id);
                              toast({ title: 'User unbanned', description: `${user.name} has been unbanned.` });
                            }}
                          >
                            <UserCheck className="h-4 w-4 text-green-600" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              banUser(user.id);
                              toast({ title: 'User banned', description: `${user.name} has been banned.` });
                            }}
                            disabled={user.role === 'admin'}
                          >
                            <Ban className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminUsers;
