import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, Building2, User, HandHeart, Upload, FileText, AlertCircle, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup, user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [verificationBase64, setVerificationBase64] = useState<string>('');
  
  // Beneficiary-specific fields
  const [nric, setNric] = useState('');
  const [address, setAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [declarationAgreed, setDeclarationAgreed] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB for localStorage)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload a file smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      setVerificationFile(file);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setVerificationBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(loginEmail, loginPassword);
    
    if (result.success) {
      toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
    } else {
      toast({ title: 'Login failed', description: result.error, variant: 'destructive' });
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate document upload for beneficiary and organization
    const requiresDocument = signupRole === 'beneficiary' || signupRole === 'organization';
    if (requiresDocument && !verificationBase64) {
      toast({
        title: 'Document required',
        description: signupRole === 'beneficiary' 
          ? 'Please upload your CPF statement for verification.'
          : 'Please upload a document to verify your organization.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Validate beneficiary-specific fields
    if (signupRole === 'beneficiary') {
      if (!nric || !address || !birthdate) {
        toast({
          title: 'Missing information',
          description: 'Please fill in all required fields (NRIC, address, and birthdate).',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      // Validate NRIC format (Singapore format: S/T/F/G followed by 7 digits and a letter)
      const nricPattern = /^[STFG]\d{7}[A-Z]$/i;
      if (!nricPattern.test(nric)) {
        toast({
          title: 'Invalid NRIC',
          description: 'Please enter a valid Singapore NRIC (e.g., S1234567A).',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (!declarationAgreed) {
        toast({
          title: 'Declaration required',
          description: 'You must agree to the declaration before proceeding.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
    }

    const beneficiaryDetails = signupRole === 'beneficiary' 
      ? { nric: nric.toUpperCase(), address, birthdate }
      : undefined;

    const result = await signup(
      signupEmail, 
      signupPassword, 
      signupName, 
      signupRole,
      verificationBase64,
      verificationFile?.name,
      beneficiaryDetails
    );
    
    if (result.success) {
      const requiresApproval = signupRole === 'beneficiary' || signupRole === 'organization';
      const message = requiresApproval
        ? 'Your registration is pending approval. You will be notified once verified.'
        : 'Your account has been created successfully.';
      toast({ title: 'Welcome to GiveLocal!', description: message });
      
      // Clear form
      setSignupEmail('');
      setSignupPassword('');
      setSignupName('');
      setSignupRole('user');
      setVerificationFile(null);
      setVerificationBase64('');
      setNric('');
      setAddress('');
      setBirthdate('');
      setDeclarationAgreed(false);
    } else {
      toast({ title: 'Signup failed', description: result.error, variant: 'destructive' });
    }
    
    setIsLoading(false);
  };

  const getDocumentLabel = () => {
    if (signupRole === 'beneficiary') {
      return 'Upload CPF Statement (Last 3 months)';
    }
    if (signupRole === 'organization') {
      return 'Upload Verification Document';
    }
    return '';
  };

  const getDocumentHelp = () => {
    if (signupRole === 'beneficiary') {
      return 'Required: Your recent CPF contribution statement to verify eligibility.';
    }
    if (signupRole === 'organization') {
      return 'e.g., ACRA certificate, IPC status letter, or any official document proving legitimacy.';
    }
    return '';
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
                  <RadioGroup value={signupRole} onValueChange={(v) => {
                    setSignupRole(v as UserRole);
                    setVerificationFile(null);
                    setVerificationBase64('');
                    setNric('');
                    setAddress('');
                    setBirthdate('');
                    setDeclarationAgreed(false);
                  }}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="user" id="role-user" />
                      <User className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <Label htmlFor="role-user" className="font-medium cursor-pointer">Regular User</Label>
                        <p className="text-xs text-muted-foreground">Donate or receive items</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="beneficiary" id="role-beneficiary" />
                      <HandHeart className="h-5 w-5 text-amber-600" />
                      <div className="flex-1">
                        <Label htmlFor="role-beneficiary" className="font-medium cursor-pointer">Beneficiary</Label>
                        <p className="text-xs text-muted-foreground">Verified users who can also request items (requires CPF verification)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="organization" id="role-org" />
                      <Building2 className="h-5 w-5 text-secondary" />
                      <div className="flex-1">
                        <Label htmlFor="role-org" className="font-medium cursor-pointer">Organization</Label>
                        <p className="text-xs text-muted-foreground">Charity or nonprofit (requires document verification)</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Beneficiary-specific fields */}
                {signupRole === 'beneficiary' && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="nric">NRIC (IC Number) *</Label>
                      <Input
                        id="nric"
                        type="text"
                        placeholder="e.g., S1234567A"
                        value={nric}
                        onChange={(e) => setNric(e.target.value.toUpperCase())}
                        maxLength={9}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Your Singapore NRIC number</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">Date of Birth *</Label>
                      <Input
                        id="birthdate"
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">House Address *</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your full residential address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Document Upload for Beneficiary and Organization */}
                {(signupRole === 'beneficiary' || signupRole === 'organization') && (
                  <div className="space-y-3">
                    <Label>{getDocumentLabel()}</Label>
                    <p className="text-xs text-muted-foreground">{getDocumentHelp()}</p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      {verificationFile ? (
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <FileText className="h-5 w-5" />
                          <span className="text-sm font-medium">{verificationFile.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Upload className="h-8 w-8" />
                          <span className="text-sm">Click to upload (PDF, JPG, PNG - max 5MB)</span>
                        </div>
                      )}
                    </div>

                    {/* Declaration for Beneficiary */}
                    {signupRole === 'beneficiary' && (
                      <div className="space-y-3 mt-4">
                        <Alert className="bg-red-50 border-red-200">
                          <ShieldAlert className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800 text-xs">
                            <strong>Important Declaration:</strong> By checking the box below, you declare that all information provided is true and accurate. Providing false information is a serious offence and may be reported to the Singapore Police Force.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="flex items-start space-x-3 p-3 rounded-lg border border-red-200 bg-red-50/50">
                          <Checkbox
                            id="declaration"
                            checked={declarationAgreed}
                            onCheckedChange={(checked) => setDeclarationAgreed(checked === true)}
                          />
                          <Label htmlFor="declaration" className="text-sm leading-relaxed cursor-pointer">
                            I declare that all information provided (NRIC, address, birthdate, and CPF statement) is true, accurate, and complete. I understand that providing false information may result in my account being reported to the authorities.
                          </Label>
                        </div>
                      </div>
                    )}

                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 text-xs">
                        Your account will be reviewed by our admin team. You will be able to login once approved.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

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