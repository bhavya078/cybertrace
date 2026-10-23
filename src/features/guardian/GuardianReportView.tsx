'use client';

import React, { useState } from 'react';
import { RemovalReport } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Shield, FileText, Copy, Check, AlertOctagon, Download, Scale } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface GuardianReportViewProps {
  reports: RemovalReport[];
  onGenerateReport?: () => void;
  isGenerating?: boolean;
}

export function GuardianReportView({
  reports,
  onGenerateReport,
  isGenerating = false,
}: GuardianReportViewProps) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    reports.length > 0 ? reports[0].id : null
  );
  const [copied, setCopied] = useState(false);

  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleCopyLetter = () => {
    if (!activeReport) return;
    navigator.clipboard.writeText(activeReport.takedownLetterDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeReport) return;
    const blob = new Blob([activeReport.takedownLetterDraft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeReport.id}_takedown_draft.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Strict Disclaimer Header */}
      <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-4 flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-semibold text-amber-200">
            Legal Disclaimer & Unverified Platform Notice Protocol
          </div>
          <p className="text-amber-300/80 leading-relaxed">
            CyberTrace generates initial draft notices for review by attorneys or compliance officers.
            CyberTrace <strong>never claims that a third-party platform has removed or modified content</strong> without verified confirmation.
          </p>
        </div>
      </div>

      {reports.length === 0 ? (
        <Card className="text-center py-12 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#181d28] border border-[#262f40] flex items-center justify-center mx-auto text-[#76b900]">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-medium text-white">No Removal Reports Generated Yet</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Compile discovered distribution URLs and forensic evidence into a formal takedown request draft.
            </p>
          </div>
          {onGenerateReport && (
            <Button
              onClick={onGenerateReport}
              isLoading={isGenerating}
              icon={<FileText className="w-4 h-4" />}
            >
              Draft Removal Package
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Header with selector and action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {reports.map((rep, idx) => (
                <button
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
                    activeReport?.id === rep.id
                      ? 'bg-[#1b2230] text-white border-[#76b900]/50'
                      : 'bg-[#11141b] text-slate-400 border-[#202634] hover:text-white'
                  }`}
                >
                  Report #{idx + 1} ({formatDate(rep.createdAt).split(',')[0]})
                </button>
              ))}
            </div>

            {onGenerateReport && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onGenerateReport}
                isLoading={isGenerating}
                icon={<FileText className="w-3.5 h-3.5" />}
              >
                Draft New Notice
              </Button>
            )}
          </div>

          {activeReport && (
            <>
              {/* Report Metadata Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#76b900]" />
                      <CardTitle>{activeReport.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge priority={activeReport.priorityScore} />
                      <Badge status={activeReport.status} />
                    </div>
                  </div>
                </CardHeader>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Executive Summary</span>
                    <p className="text-slate-200 bg-[#0e1118] p-3 rounded-lg border border-[#1e2433]">
                      {activeReport.summary}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Legal & Regulatory Basis</span>
                    <p className="text-slate-300 font-mono text-[11px] bg-[#0e1118] p-3 rounded-lg border border-[#1e2433]">
                      {activeReport.legalBasis}
                    </p>
                  </div>

                  {/* Evidence Summary Points */}
                  <div>
                    <span className="text-slate-400 block mb-1.5">Compiled Evidence Items</span>
                    <ul className="space-y-1">
                      {activeReport.evidenceSummary.map((ev, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-slate-300 bg-[#0e1118] px-3 py-1.5 rounded border border-[#1a202c]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#76b900]" />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Platform Notices List */}
              <Card>
                <CardHeader>
                  <CardTitle>Target Platform Recipients & Verification Status</CardTitle>
                </CardHeader>

                <div className="space-y-3">
                  {activeReport.notices.map((notice, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-[#0e1118] border border-[#1e2433] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{notice.platform}</span>
                          <span className="font-mono text-[10px] text-slate-400 uppercase px-2 py-0.5 rounded bg-black/40 border border-slate-800">
                            {notice.noticeType}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/40 text-amber-300 border border-amber-800/40">
                          {notice.verifiedOutcome === 'unverified' ? 'UNVERIFIED CONFIRMATION' : notice.verifiedOutcome}
                        </span>
                      </div>
                      <div className="font-mono text-slate-400 truncate">
                        Target: <span className="text-slate-300">{notice.targetUrl}</span>
                      </div>
                      {notice.recipientEmail && (
                        <div className="text-slate-400">
                          Recipient Contact: <span className="text-slate-300">{notice.recipientEmail}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Takedown Draft Letter Box */}
              <Card>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#1c2230]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#76b900]" />
                    <h4 className="text-sm font-semibold text-white">Draft Removal Letter Preview</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyLetter} icon={copied ? <Check className="w-3.5 h-3.5 text-[#76b900]" /> : <Copy className="w-3.5 h-3.5" />}>
                      {copied ? 'Copied' : 'Copy Text'}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleDownload} icon={<Download className="w-3.5 h-3.5" />}>
                      Download Draft
                    </Button>
                  </div>
                </div>

                <pre className="p-4 rounded-lg bg-[#07090e] border border-[#1a202c] text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-96">
                  {activeReport.takedownLetterDraft}
                </pre>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
