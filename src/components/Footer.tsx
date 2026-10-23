'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ShieldAlert } from 'lucide-react';
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

          {/* Col 3: Standards & Compliance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Notice Verification Standards</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Removal notice packages adhere to formal statutory frameworks (DMCA 17 U.S.C. § 512, Right of Publicity). Platform removals are never presumed until verified by confirmation receipts.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © 2026 {APP_METADATA.name} — Visual Integrity & Digital Media Forensics.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-mono">v{APP_METADATA.version}</span>
            <span>•</span>
            <span>Zero Server Media Retention Active</span>
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
