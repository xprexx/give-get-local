import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, Building2, User } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup, user } = useAuth();
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    if (user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'organization') {
      navigate('/organization');
    } else {
      navigate('/');
    }
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(loginEmail, loginPassword);
    
    if (result.success) {
      toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
      // Navigation will be handled by the user state change
    } else {
      toast({ title: 'Login failed', description: result.error, variant: 'destructive' });
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signup(signupEmail, signupPassword, signupName, signupRole);
    
    if (result.success) {
      const message = signupRole === 'organization' 
        ? 'Your organization registration is pending approval.'
        : 'Your account has been created successfully.';
      toast({ title: 'Welcome to GiveLocal!', description: message });
    } else {
      toast({ title: 'Signup failed', description: result.error, variant: 'destructive' });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">GiveLocal Singapore</CardTitle>
          <CardDescription>Join our community of giving</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Demo admin: admin@givelocal.sg / admin123
                </p>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your name or organization"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label>Account Type</Label>
                  <RadioGroup value={signupRole} onValueChange={(v) => setSignupRole(v as UserRole)}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="user" id="role-user" />
                      <User className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <Label htmlFor="role-user" className="font-medium cursor-pointer">Individual</Label>
                        <p className="text-xs text-muted-foreground">Donate or receive items</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="organization" id="role-org" />
                      <Building2 className="h-5 w-5 text-secondary" />
                      <div className="flex-1">
                        <Label htmlFor="role-org" className="font-medium cursor-pointer">Organization</Label>
                        <p className="text-xs text-muted-foreground">Charity or nonprofit (requires approval)</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
