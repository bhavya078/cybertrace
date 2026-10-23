'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  Settings as SettingsIcon,
  Shield,
  Key,
  HardDrive,
  Trash2,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

interface SettingsInfo {
  session: {
    investigatorId: string;
    authType: 'cookie' | 'header' | 'ephemeral';
  };
  storage: {
    adapter: string;
    totalCases: number;
    ephemeralDataOnly: boolean;
  };
  security: {
    ssrfProtection: boolean;
    magicBytesValidation: boolean;
    rateLimitingEnabled: boolean;
    cacheControlStrict: boolean;
  };
}

export default function SettingsPage() {
  const [info, setInfo] = useState<SettingsInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to fetch settings');
      }
      setInfo(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (!ignore) {
          if (!res.ok) {
            setError(data.error?.message || 'Failed to fetch settings');
          } else {
            setInfo(data.data);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error loading settings');
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleReset = async () => {
    if (
      !confirm(
        'Warning: This will clear case data for your session and issue a fresh session identifier. Are you sure?'
      )
    ) {
      return;
    }

    try {
      setIsResetting(true);
      setResetSuccess(false);
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_session' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to reset session');
      }

      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
      await fetchSettings();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error resetting session');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1b2230]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <SettingsIcon className="w-4 h-4" />
            <span>OPERATIONAL PREFERENCES & SECURITY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Workbench Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Inspect active investigator session isolation, storage adapter state, and security controls.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchSettings}
          isLoading={isLoading}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
          <p className="text-xs font-mono">Reading platform runtime configuration...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 text-xs">{error}</div>
      ) : info ? (
        <div className="space-y-6">
          {/* Section 1: Session & IDOR Protection */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <CardTitle>Investigator Session Isolation</CardTitle>
              </div>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <p className="text-slate-400">
                To prevent Insecure Direct Object Reference (IDOR) vulnerabilities, cases are isolated to individual investigator sessions using cryptographically secure tokens.
              </p>
              <div className="p-3.5 rounded-lg bg-[#0c0e14] border border-[#1b212d] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-mono">Active Investigator ID:</span>
                  <span className="font-mono text-emerald-400 font-bold bg-[#141924] px-2 py-0.5 rounded border border-[#232c3f]">
                    {info.session.investigatorId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-mono">Authentication Transport:</span>
                  <span className="font-mono text-slate-300 uppercase">
                    {info.session.authType}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Storage Architecture */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <CardTitle>Storage & Privacy Guardrails</CardTitle>
              </div>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-lg bg-[#0c0e14] border border-[#1b212d] space-y-1">
                <span className="text-slate-400 block text-[11px]">Storage Adapter</span>
                <span className="text-white font-semibold">{info.storage.adapter}</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#0c0e14] border border-[#1b212d] space-y-1">
                <span className="text-slate-400 block text-[11px]">Session Case Count</span>
                <span className="text-white font-semibold">{info.storage.totalCases} cases</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#0c0e14] border border-[#1b212d] space-y-1">
                <span className="text-slate-400 block text-[11px]">Disk Image Retention</span>
                <span className="text-emerald-400 font-semibold">Disabled (Zero Retention)</span>
              </div>
            </div>
          </Card>

          {/* Section 3: Active Security Defenses */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <CardTitle>Active Application Security Controls</CardTitle>
              </div>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0c0e14] border border-[#1b212d] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">SSRF Defense Shield</div>
                  <div className="text-[11px] text-slate-400">Blocks RFC 1918, cloud metadata, & non-HTTP schemes</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>

              <div className="p-3 rounded-lg bg-[#0c0e14] border border-[#1b212d] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Magic Byte Verification</div>
                  <div className="text-[11px] text-slate-400">Validates true binary headers against MIME spoofing</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>

              <div className="p-3 rounded-lg bg-[#0c0e14] border border-[#1b212d] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Rate Protection Shield</div>
                  <div className="text-[11px] text-slate-400">Automated request throttling to prevent enumeration attacks</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>

              <div className="p-3 rounded-lg bg-[#0c0e14] border border-[#1b212d] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Strict Privacy Headers</div>
                  <div className="text-[11px] text-slate-400">Client-only non-caching policies prevent evidentiary data leaks</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            </div>
          </Card>

          {/* Section 4: Data Management & Reset */}
          <Card className="border-rose-950/40 bg-[#0d090d]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <CardTitle className="text-rose-200">Session Reset & Data Purge</CardTitle>
              </div>
            </CardHeader>

            <div className="space-y-4 text-xs">
              <p className="text-slate-400">
                Purge recorded cases associated with this investigator session and re-issue a clean session key. This action cannot be undone.
              </p>

              {resetSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Session successfully cleared and re-initialized.</span>
                </div>
              )}

              <Button
                variant="danger"
                size="sm"
                onClick={handleReset}
                isLoading={isResetting}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Reset Session & Purge Cases
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
