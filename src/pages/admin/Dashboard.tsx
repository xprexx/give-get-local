import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Building2, Tags, TrendingUp, AlertCircle, CheckCircle, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { users, organizations, categoryProposals, logout } = useAuth();

  const stats = {
    totalUsers: users.filter(u => u.role === 'user').length,
    totalOrganizations: organizations.length,
    pendingOrgs: organizations.filter(o => o.status === 'pending').length,
    pendingProposals: categoryProposals.filter(p => p.status === 'pending').length,
    bannedUsers: users.filter(u => u.isBanned).length,
    activeUsers: users.filter(u => !u.isBanned).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">GiveLocal Singapore Management</p>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} active, {stats.bannedUsers} banned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingOrgs} pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Category Proposals</CardTitle>
              <Tags className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingProposals}</div>
              <p className="text-xs text-muted-foreground">pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Good</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  User Management
                </CardTitle>
                <CardDescription>
                  View, reset passwords, and manage user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Manage Users</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/organizations">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-secondary" />
                  Organizations
                  {stats.pendingOrgs > 0 && (
                    <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.pendingOrgs}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Review and approve organization registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">Review Organizations</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/categories">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5 text-accent-foreground" />
                  Categories
                  {stats.pendingProposals > 0 && (
                    <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.pendingProposals}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Review category proposals from organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">Review Proposals</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.pendingOrgs > 0 && (
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <div className="flex-1">
                    <p className="font-medium text-amber-800">
                      {stats.pendingOrgs} organization(s) awaiting approval
                    </p>
                    <p className="text-sm text-amber-600">Review their applications</p>
                  </div>
                  <Link to="/admin/organizations">
                    <Button size="sm" variant="outline">Review</Button>
                  </Link>
                </div>
              )}
              {stats.pendingProposals > 0 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Tags className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">
                      {stats.pendingProposals} category proposal(s) pending
                    </p>
                    <p className="text-sm text-blue-600">Organizations have suggested new categories</p>
                  </div>
                  <Link to="/admin/categories">
                    <Button size="sm" variant="outline">Review</Button>
                  </Link>
                </div>
              )}
              {stats.pendingOrgs === 0 && stats.pendingProposals === 0 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">All caught up!</p>
                    <p className="text-sm text-green-600">No pending items require your attention</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
