'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  LayoutDashboard,
  FolderGit2,
  FileCheck2,
  Settings,
  PlusCircle,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/investigate', label: 'New Investigation', icon: Search },
    { href: '/cases', label: 'Cases', icon: FolderGit2 },
    { href: '/reports', label: 'Reports', icon: FileCheck2 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1d2331] bg-[#090a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#141824] border border-[#232b3d] flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/50 transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wider text-white">
                  CYBER<span className="text-emerald-400">TRACE</span>
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-950/60 text-emerald-400 text-[10px] font-mono rounded font-medium border border-emerald-800/50">
                  v0.1
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                Visual Forensics & Verification
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-[#151a26] text-white border border-[#242e44]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#12151f]'
                  )}
                >
                  <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-emerald-400' : 'text-slate-400')} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-400 px-3 py-1 rounded-full bg-[#10131d] border border-[#1d2331]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>OPERATIONAL</span>
          </div>

          <Link
            href="/investigate"
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Investigate</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#141824]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1d2331] bg-[#0c0e15] px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-[#151a26] text-white border border-[#242e44]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#12151f]'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-emerald-400' : 'text-slate-400')} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
