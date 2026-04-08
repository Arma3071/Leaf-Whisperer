import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Shield, Sparkles, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { href: "/", label: "Scan" },
  { href: "/about", label: "About" },
  { href: "/diseases", label: "Diseases" },
  { href: "/history", label: "History" },
  { href: "/dashboard", label: "Dashboard" },
];

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="w-full py-4 px-4 md:px-6 glass sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent-foreground rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Leaf className="h-6 w-6 text-primary-foreground" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-accent-foreground animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-gradient">AgriGuard</span>
              <span className="text-foreground"> AI</span>
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Intelligent Plant Disease Detection
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                location.pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-severity-healthy opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-severity-healthy" />
            </div>
            <span className="text-muted-foreground">AI Active</span>
            <Shield className="h-4 w-4 text-primary" />
          </div>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="text-muted-foreground text-xs max-w-[120px] truncate">
                  {user.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth")}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Sign In</span>
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-2 border-t border-border/30 pt-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
