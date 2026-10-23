'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, PlusCircle, Search, LayoutDashboard, FolderGit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/investigate', label: 'Investigate', icon: Search },
    { href: '/cases', label: 'Cases', icon: FolderGit2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#202634] bg-[#08090d]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-[#141822] border border-[#2b3548] flex items-center justify-center text-[#76b900] group-hover:border-[#76b900]/60 transition-colors">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wider text-white">CYBER<span className="text-[#76b900]">TRACE</span></span>
                <span className="px-1.5 py-0.2 bg-[#76b900]/15 text-[#76b900] text-[10px] font-mono rounded font-medium border border-[#76b900]/30">
                  v0.1
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Visual Forensic Intelligence</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#181d27] text-white border border-[#2c374b]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#12151d]'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-[#76b900]' : 'text-slate-400')} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 px-3 py-1 rounded-full bg-[#11141b] border border-[#202634]">
            <span className="w-2 h-2 rounded-full bg-[#76b900] animate-pulse" />
            <span>AI ENGINE: READY (MOCK)</span>
          </div>

          <Link
            href="/investigate"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#76b900] hover:bg-[#85cf00] text-black font-semibold text-xs tracking-wide transition-all shadow-sm shadow-[#76b900]/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Case</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
