import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import LoginButton from './LoginButton';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/members', label: 'Members', authRequired: true },
    { to: '/events', label: 'Events', authRequired: true },
    { to: '/news', label: 'News', authRequired: true },
    { to: '/gallery', label: 'Gallery', authRequired: true },
  ];

  const handleNavClick = (to: string, authRequired: boolean) => {
    if (authRequired && !isAuthenticated) {
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
            <img src="/assets/generated/club-logo.dim_512x512.png" alt="Reapers Asylum MC" className="h-14 w-14" />
            <div className="hidden sm:block">
              <h1 className="font-display text-2xl leading-none chrome-text group-hover:animate-pulse-glow">
                Reapers Asylum MC
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.to}
                onClick={() => handleNavClick(link.to, link.authRequired || false)}
                disabled={link.authRequired && !isAuthenticated}
                className={`font-heading text-lg uppercase tracking-wider transition-colors ${
                  link.authRequired && !isAuthenticated
                    ? 'text-muted-foreground cursor-not-allowed'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* User Info & Login */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && userProfile && (
              <span className="text-sm text-muted-foreground">Welcome, {userProfile.name}</span>
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
              {navLinks.map((link) => (
                <button
                  key={link.to}
                  onClick={() => handleNavClick(link.to, link.authRequired || false)}
                  disabled={link.authRequired && !isAuthenticated}
                  className={`font-heading text-lg uppercase tracking-wider text-left transition-colors ${
                    link.authRequired && !isAuthenticated
                      ? 'text-muted-foreground cursor-not-allowed'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 border-t border-border">
                {isAuthenticated && userProfile && (
                  <p className="text-sm text-muted-foreground mb-3">Welcome, {userProfile.name}</p>
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
