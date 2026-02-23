import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import LoginButton from './LoginButton';
import AdminBadge from './AdminBadge';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/members', label: 'Members', authRequired: true },
    { to: '/events', label: 'Events', authRequired: true },
    { to: '/news', label: 'News', authRequired: true },
    { to: '/gallery', label: 'Gallery', authRequired: true },
    { to: '/admin', label: 'Admin', authRequired: true, adminOnly: true },
    { to: '/member-management', label: 'Manage Members', authRequired: true, adminOnly: true },
  ];

  const handleNavClick = (to: string, authRequired: boolean, adminOnly?: boolean) => {
    if (authRequired && !isAuthenticated) {
      return;
    }
    if (adminOnly && !isAdmin) {
      return;
    }
    navigate({ to });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/assets/generated/reapers-asylum-logo.dim_400x400.png" 
              alt="Reapers Asylum MC" 
              className="h-14 w-14 object-contain transition-transform group-hover:scale-105" 
            />
            <div className="hidden sm:block">
              <h1 className="font-display text-2xl leading-none chrome-text group-hover:animate-pulse-glow">
                Reapers Asylum MC
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const shouldShow = !link.adminOnly || (link.adminOnly && isAdmin);
              if (!shouldShow) return null;
              
              return (
                <button
                  key={link.to}
                  onClick={() => handleNavClick(link.to, link.authRequired || false, link.adminOnly)}
                  disabled={link.authRequired && !isAuthenticated}
                  className={`font-heading text-lg uppercase tracking-wider transition-colors ${
                    link.authRequired && !isAuthenticated
                      ? 'text-muted-foreground cursor-not-allowed'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* User Info & Login */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <div className="flex items-center gap-3">
                {isAdmin && <AdminBadge />}
                {userProfile && (
                  <button
                    onClick={() => navigate({ to: '/profile' })}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>{userProfile.name}</span>
                  </button>
                )}
              </div>
            )}
            <LoginButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const shouldShow = !link.adminOnly || (link.adminOnly && isAdmin);
                if (!shouldShow) return null;
                
                return (
                  <button
                    key={link.to}
                    onClick={() => handleNavClick(link.to, link.authRequired || false, link.adminOnly)}
                    disabled={link.authRequired && !isAuthenticated}
                    className={`font-heading text-lg uppercase tracking-wider text-left transition-colors ${
                      link.authRequired && !isAuthenticated
                        ? 'text-muted-foreground cursor-not-allowed'
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    navigate({ to: '/profile' });
                    setMobileMenuOpen(false);
                  }}
                  className="font-heading text-lg uppercase tracking-wider text-left text-foreground hover:text-primary transition-colors"
                >
                  Profile
                </button>
              )}
              <div className="pt-4 border-t border-border">
                {isAuthenticated && (
                  <div className="mb-3 space-y-2">
                    {isAdmin && <AdminBadge />}
                    {userProfile && (
                      <p className="text-sm text-muted-foreground">Welcome, {userProfile.name}</p>
                    )}
                  </div>
                )}
                <LoginButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
