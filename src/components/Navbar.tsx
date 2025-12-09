import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Menu, X, LogOut, User, Building2, Shield, HandHeart, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationDropdown from "@/components/NotificationDropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'organization') return '/organization';
    return '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-foreground">GiveLocal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/browse" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Browse Items
            </Link>
            {user?.role === 'beneficiary' && user?.status === 'active' ? (
              <Link to="/beneficiary/requests" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Item Requests
              </Link>
            ) : (
              <Link to="/item-requests" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Item Requests
              </Link>
            )}
            {user && (
              <Link to="/donor/pickup-requests" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Pickup Requests
              </Link>
            )}
            <Link to="/organizations" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Organizations
            </Link>
            <Link to="/impact-stories" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Impact
            </Link>
            <Link to="/crowdfunding" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Crowdfunding
            </Link>
            <Link to="/volunteer" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Volunteer
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <NotificationDropdown />
                <Link to={getDashboardLink()}>
                  <Button variant="ghost" className="gap-2">
                    {user.role === 'admin' && <Shield className="h-4 w-4" />}
                    {user.role === 'organization' && <Building2 className="h-4 w-4" />}
                    {user.role === 'beneficiary' && <HandHeart className="h-4 w-4" />}
                    {user.role === 'user' && <User className="h-4 w-4" />}
                    {user.name}
                    {user.role === 'beneficiary' && (
                      <Badge variant="success" className="ml-1 text-xs">Verified</Badge>
                    )}
                  </Button>
                </Link>
                <Link to="/account">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Button variant="hero">Donate Now</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-up">
            <div className="flex flex-col gap-4">
              <Link to="/browse" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
                Browse Items
              </Link>
              {user?.role === 'beneficiary' && user?.status === 'active' ? (
                <Link to="/beneficiary/requests" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
                  Item Requests
                </Link>
              ) : (
                <Link to="/item-requests" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
                  Item Requests
                </Link>
              )}
              {user && (
                <Link to="/donor/pickup-requests" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
                  Pickup Requests
                </Link>
              )}
              <Link to="/organizations" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
                Organizations
              </Link>
              <Link to="/impact-stories" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
                Impact
              </Link>
              <Link to="/crowdfunding" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
                Crowdfunding
              </Link>
              <Link to="/volunteer" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
                Volunteer
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full gap-2">
                        {user.role === 'admin' && <Shield className="h-4 w-4" />}
                        {user.role === 'organization' && <Building2 className="h-4 w-4" />}
                        {user.role === 'beneficiary' && <HandHeart className="h-4 w-4" />}
                        {user.role === 'user' && <User className="h-4 w-4" />}
                        {user.role === 'beneficiary' ? 'My Requests' : 'Dashboard'}
                      </Button>
                    </Link>
                    <Link to="/account" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full gap-2">
                        <Settings className="h-4 w-4" />
                        Account Settings
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="ghost" className="w-full">Sign In</Button>
                    </Link>
                    <Button variant="hero" className="w-full">Donate Now</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
