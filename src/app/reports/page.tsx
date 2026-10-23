'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import {
  AlertOctagon,
  Download,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Shield,
  Scale,
  PlusCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { RemovalReport } from '@/types';

interface CaseReportItem {
  caseId: string;
  caseTitle: string;
  report: RemovalReport;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<CaseReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to fetch reports');
      }
      setReports(data.data?.reports || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch('/api/reports');
        const data = await res.json();
        if (!ignore) {
          if (!res.ok) {
            setError(data.error?.message || 'Failed to fetch reports');
          } else {
            setReports(data.data?.reports || []);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error loading reports');
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (report: RemovalReport) => {
    const blob = new Blob([report.takedownLetterDraft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}_takedown_draft.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1b2230]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Scale className="w-4 h-4" />
            <span>LEGAL & COMPLIANCE DISPATCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Removal Notices & Takedown Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audit-ready legal packages compiled from visual forensic evidence and discovered host URLs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReports}
            isLoading={isLoading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Link href="/investigate">
            <Button size="sm" icon={<PlusCircle className="w-3.5 h-3.5" />}>
              New Investigation
            </Button>
          </Link>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-semibold text-amber-200">
            Platform Verification Protocol
          </div>
          <p className="text-amber-300/80 leading-relaxed">
            All generated reports are classified as drafts intended for legal counsel or verified compliance intake.
            CyberTrace <strong>never assumes or asserts that a host platform has taken down content</strong> until an official verified confirmation receipt is recorded.
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-16 text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
          <p className="text-xs font-mono">Aggregating compliance reports across cases...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 text-xs">
          {error}
        </div>
      ) : reports.length === 0 ? (
        <Card className="text-center py-16 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#131722] border border-[#222a3a] flex items-center justify-center mx-auto text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-medium text-white">No Removal Reports Compiled</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Draft formal notice letters by opening any investigated case and generating a Guardian Removal Package.
            </p>
          </div>
          <Link href="/cases">
            <Button size="sm">Browse Cases to Draft Reports</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {reports.map(({ caseId, caseTitle, report }) => (
            <Card key={report.id} className="space-y-4">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/cases/${caseId}`}
                        className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>Case #{caseId.substring(0, 8)}... ({caseTitle})</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <CardTitle>{report.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge priority={report.priorityScore} />
                    <Badge status={report.status} />
                    <span className="text-xs font-mono text-slate-400">
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="text-slate-400 font-medium">Executive Summary</div>
                  <p className="p-3 rounded-lg bg-[#0c0e14] border border-[#1b212d] text-slate-200">
                    {report.summary}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-slate-400 font-medium">Legal Basis</div>
                  <p className="p-3 rounded-lg bg-[#0c0e14] border border-[#1b212d] text-slate-300 font-mono text-[11px]">
                    {report.legalBasis}
                  </p>
                </div>
              </div>

              {/* Targets */}
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-medium">Target Platforms & Verification</div>
                <div className="space-y-2">
                  {report.notices.map((notice, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#0c0e14] border border-[#1b212d] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{notice.platform}</span>
                          <span className="font-mono text-[10px] text-slate-400 uppercase px-2 py-0.5 rounded bg-black/40 border border-slate-800">
                            {notice.noticeType}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-400 truncate max-w-md">
                          {notice.targetUrl}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/40 text-amber-300 border border-amber-800/40 self-start sm:self-center">
                        {notice.verifiedOutcome === 'unverified' ? 'STATUS: UNVERIFIED' : notice.verifiedOutcome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-[#1b212d] flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/cases/${caseId}`}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Case Workbench</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(report.takedownLetterDraft, report.id)}
                    icon={copiedId === report.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedId === report.id ? 'Copied' : 'Copy Notice Text'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(report)}
                    icon={<Download className="w-3.5 h-3.5" />}
                  >
                    Download Draft (.txt)
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
