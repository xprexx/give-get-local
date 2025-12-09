import { Link } from "react-router-dom";
import { Heart, Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-xl font-bold">GiveLocal</span>
            </Link>
            <p className="text-muted mb-6">
              Connecting communities through the power of giving. One item at a time.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/browse" className="text-muted hover:text-background transition-colors">Browse Items</Link></li>
              <li><Link to="/organizations" className="text-muted hover:text-background transition-colors">Organizations</Link></li>
              <li><Link to="/how-it-works" className="text-muted hover:text-background transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="text-muted hover:text-background transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* For Donors */}
          <div>
            <h3 className="font-semibold text-lg mb-4">For Donors</h3>
            <ul className="space-y-3">
              <li><Link to="/list-item" className="text-muted hover:text-background transition-colors">List an Item</Link></li>
              <li><Link to="/bulk-donate" className="text-muted hover:text-background transition-colors">Bulk Donations</Link></li>
              <li><Link to="/donation-guide" className="text-muted hover:text-background transition-colors">Donation Guide</Link></li>
              <li><Link to="/tax-receipts" className="text-muted hover:text-background transition-colors">Tax Receipts</Link></li>
            </ul>
          </div>

          {/* For Organizations */}
          <div>
            <h3 className="font-semibold text-lg mb-4">For Organizations</h3>
            <ul className="space-y-3">
              <li><Link to="/org-signup" className="text-muted hover:text-background transition-colors">Register Your Org</Link></li>
              <li><Link to="/request-items" className="text-muted hover:text-background transition-colors">Request Items</Link></li>
              <li><Link to="/org-dashboard" className="text-muted hover:text-background transition-colors">Organization Portal</Link></li>
              <li><Link to="/partner-program" className="text-muted hover:text-background transition-colors">Partner Program</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm">
            © 2024 GiveLocal. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-muted hover:text-background transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-muted hover:text-background transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-muted hover:text-background transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
