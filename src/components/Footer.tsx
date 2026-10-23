'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ExternalLink, Cpu } from 'lucide-react';
import { APP_METADATA } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#1a202d] bg-[#07080c] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-[#141822]">
          {/* Col 1: Ethics & Privacy statement */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Ephemeral Processing</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              CyberTrace never stores sensitive original media on server storage by default. Visual assets are inspected client-side in the browser, transmitting only cryptographic fingerprints and structural metrics.
            </p>
          </div>

          {/* Col 2: Forensic Transparency */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Forensic Verification Protocol</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              No asset is presumed manipulated merely because it was submitted. Triage indicators provide preliminary signals to assist qualified analysts in manual verification.
            </p>
          </div>

          {/* Col 3: Architecture & System Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>System Health & Standards</span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between py-0.5 border-b border-[#141822]">
                <span className="text-slate-400">Health Endpoint</span>
                <Link
                  href="/api/health"
                  target="_blank"
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  /api/health <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-400">Architecture</span>
                <span className="text-slate-200">Modular Next.js Platform</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © 2026 {APP_METADATA.name} — Visual Integrity & Digital Media Forensics.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-mono">v{APP_METADATA.version}</span>
            <span>•</span>
            <span>Zero Server Retention Active</span>
            <span>•</span>
            <Link href="/settings" className="hover:text-slate-200 underline">
              Settings & Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
