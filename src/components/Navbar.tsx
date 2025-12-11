import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Menu, X, LogOut, User, Building2, Shield, HandHeart, LayoutDashboard, PlusCircle, Package, ChevronDown } from "lucide-react";
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
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/browse" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium rounded-md hover:bg-muted/50">
              Browse
            </Link>
            <Link to="/item-requests" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium rounded-md hover:bg-muted/50">
              Requests
            </Link>
            <Link to="/organizations" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium rounded-md hover:bg-muted/50">
              Organizations
            </Link>
            <Link to="/crowdfunding" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium rounded-md hover:bg-muted/50">
              Crowdfunding
            </Link>
            <Link to="/volunteer" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium rounded-md hover:bg-muted/50">
              Volunteer
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/donate">
                  <Button variant="hero" size="sm" className="gap-1.5">
                    <PlusCircle className="h-4 w-4" />
                    Donate
                  </Button>
                </Link>
                <NotificationDropdown />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      {user.role === 'admin' && <Shield className="h-4 w-4" />}
                      {user.role === 'organization' && <Building2 className="h-4 w-4" />}
                      {user.role === 'beneficiary' && <HandHeart className="h-4 w-4" />}
                      {user.role === 'user' && <User className="h-4 w-4" />}
                      <span className="max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/donor/my-listings" className="w-full cursor-pointer">
                        <Package className="h-4 w-4 mr-2" />
                        My Listings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/donor/pickup-requests" className="w-full cursor-pointer">
                        <Heart className="h-4 w-4 mr-2" />
                        Pickup Requests
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'beneficiary' && user.status === 'active' && (
                      <DropdownMenuItem asChild>
                        <Link to="/beneficiary/requests" className="w-full cursor-pointer">
                          <HandHeart className="h-4 w-4 mr-2" />
                          My Item Requests
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="w-full cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Account
                      </Link>
                    </DropdownMenuItem>
                    {(user.role === 'admin' || user.role === 'organization') && (
                      <DropdownMenuItem asChild>
                        <Link to={getDashboardLink()} className="w-full cursor-pointer">
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/donate">
                  <Button variant="hero" size="sm">Donate Now</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-up">
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
                <Link to="/donor/my-listings" className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2" onClick={() => setIsOpen(false)}>
                  My Listings
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
                  <Link to="/donate" onClick={() => setIsOpen(false)}>
                    <Button variant="hero" className="w-full gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Donate Item
                    </Button>
                  </Link>
                  <Link to="/account" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full gap-2">
                      {user.role === 'admin' && <Shield className="h-4 w-4" />}
                      {user.role === 'organization' && <Building2 className="h-4 w-4" />}
                      {user.role === 'beneficiary' && <HandHeart className="h-4 w-4" />}
                      {user.role === 'user' && <User className="h-4 w-4" />}
                      {user.name} - Account
                    </Button>
                  </Link>
                  {(user.role === 'admin' || user.role === 'organization') && (
                    <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/donate" onClick={() => setIsOpen(false)}>
                    <Button variant="hero" className="w-full">Donate Now</Button>
                  </Link>
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
