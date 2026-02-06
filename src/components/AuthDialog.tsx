import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, AlertCircle, Info } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const { signIn, signUp, isSupabaseAvailable } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [signinData, setSigninData] = useState({
    email: '',
    password: ''
  });
  
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { success, error } = await signIn(signinData.email, signinData.password);
    
    if (success) {
      onClose();
      setSigninData({ email: '', password: '' });
    } else {
      setError(error || 'Sign in failed');
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    const { success, error } = await signUp(signupData.email, signupData.password, signupData.name);
    
    if (success) {
      onClose();
      setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
    } else {
      setError(error || 'Sign up failed');
    }
    
    setLoading(false);
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setError(null);
    
    const { success, error } = await signIn('demo@pcbuilder.com', 'demo123');
    
    if (success) {
      onClose();
    } else {
      setError(error || 'Demo sign in failed');
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to PC Builder</DialogTitle>
          <DialogDescription>
            Sign in to save builds and compete on leaderboards
          </DialogDescription>
        </DialogHeader>

        {/* Demo Mode Info */}
        {!isSupabaseAvailable && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Demo mode active. Use the demo account below to test all features.
            </AlertDescription>
          </Alert>
        )}

        {/* Demo Account Button */}
        <div className="space-y-2">
          <Button
            onClick={handleDemoSignIn}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Use Demo Account
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Email: <code className="text-xs bg-muted px-1 rounded">demo@pcbuilder.com</code> • 
            Password: <code className="text-xs bg-muted px-1 rounded">demo123</code>
          </p>
        </div>

        {/* Authentication Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup" disabled={!isSupabaseAvailable}>
              Sign Up
              {!isSupabaseAvailable && <Badge variant="secondary" className="ml-1 text-xs">Demo only</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signinData.email}
                  onChange={(e) => setSigninData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={signinData.password}
                  onChange={(e) => setSigninData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            {isSupabaseAvailable ? (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupData.name}
                    onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Enter your password (min. 6 characters)"
                    value={signupData.password}
                    onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </form>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Sign up is not available in demo mode. Use the demo account above to test all features.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            {isSupabaseAvailable 
              ? "Your account allows you to save builds and compete on leaderboards."
              : "Demo mode provides full functionality without requiring account creation."
            }
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}