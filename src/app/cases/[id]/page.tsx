'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Case } from '@/types';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ForensicResultView } from '@/features/forensics/ForensicResultView';
import { TraceResultView } from '@/features/trace/TraceResultView';
import { GuardianReportView } from '@/features/guardian/GuardianReportView';
import {
  Search,
  FileCheck2,
  ArrowLeft,
  RefreshCw,
  Fingerprint,
  Trash2,
  Play,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { formatDate, formatBytes } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CaseDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [caseRecord, setCaseRecord] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  // Active Tab: 'forensics' | 'trace' | 'guardian'
  const [activeTab, setActiveTab] = useState<'forensics' | 'trace' | 'guardian'>('forensics');

  // Execution states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDraftingReport, setIsDraftingReport] = useState(false);
  const [simulatedScenario, setSimulatedScenario] = useState<'deepfake' | 'manipulated_doc' | 'authentic'>('deepfake');

  const fetchCase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsUnauthorized(false);
      const res = await fetch(`/api/cases/${id}`);
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setIsUnauthorized(true);
        }
        throw new Error(data.error?.message || 'Failed to retrieve case');
      }
      setCaseRecord(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching case');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch(`/api/cases/${id}`);
        const data = await res.json();
        if (!ignore) {
          if (!res.ok) {
            if (res.status === 403) {
              setIsUnauthorized(true);
            }
            setError(data.error?.message || 'Failed to retrieve case');
          } else {
            setCaseRecord(data.data);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error fetching case');
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleRunAnalysis = async () => {
    if (!caseRecord) return;
    try {
      setIsAnalyzing(true);
      setError(null);

      const res = await fetch(`/api/cases/${id}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deepScan: true,
          enableTraceDiscovery: true,
          simulatedScenario,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Analysis pipeline failed');
      }

      setCaseRecord(data.data.case);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error running analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDraftReport = async () => {
    if (!caseRecord) return;
    try {
      setIsDraftingReport(true);
      setError(null);

      const res = await fetch(`/api/cases/${id}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Takedown Notice Draft — ${caseRecord.title}`,
          noticeType: 'dmca_takedown',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Report generation failed');
      }

      // Re-fetch case to load updated reports list
      await fetchCase();
      setActiveTab('guardian');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error drafting report');
    } finally {
      setIsDraftingReport(false);
    }
  };

  const handleDeleteCase = async () => {
    if (!confirm('Are you sure you want to delete this case? This cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/cases/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to delete case');
      }
      router.push('/cases');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete case');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400" />
        <p className="text-sm font-mono text-slate-400">Loading forensic workbench...</p>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-950/50 border border-amber-800/60 flex items-center justify-center mx-auto text-amber-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Access Restricted (IDOR Protection)</h2>
        <p className="text-xs text-slate-400">
          This investigation belongs to another investigator session. Direct object reference is blocked to safeguard private evidentiary metadata.
        </p>
        <Link href="/cases">
          <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Back to Case Directory
          </Button>
        </Link>
      </div>
    );
  }

  if (error || !caseRecord) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-950/50 border border-rose-800/60 flex items-center justify-center mx-auto text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Investigation Case Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'The requested case does not exist in local repository.'}</p>
        <Link href="/cases">
          <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Back to Case Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/cases"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Case Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="danger" size="sm" onClick={handleDeleteCase} icon={<Trash2 className="w-3.5 h-3.5" />}>
            Delete Case
          </Button>
        </div>
      </div>

      {/* Case Header Card */}
      <Card className="border-[#202737] bg-[#0c0e14]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/25">
                {caseRecord.id}
              </span>
              <Badge status={caseRecord.status} />
              {caseRecord.isSyntheticFixture && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-800/40">
                  SYNTHETIC FIXTURE
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {caseRecord.title}
            </h1>

            {caseRecord.description && (
              <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                {caseRecord.description}
              </p>
            )}
          </div>

          {/* Quick Timestamps Box */}
          <div className="text-xs font-mono text-slate-400 bg-[#11151f] p-3.5 rounded-lg border border-[#1b2230] shrink-0 space-y-1">
            <div>Logged: <span className="text-slate-200">{formatDate(caseRecord.createdAt)}</span></div>
            <div>Updated: <span className="text-slate-200">{formatDate(caseRecord.updatedAt)}</span></div>
          </div>
        </div>

        {/* Image Evidence Metadata Bar */}
        <div className="mt-6 pt-4 border-t border-[#171d27] grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block">File Target</span>
            <span className="text-slate-200 truncate block">{caseRecord.imageMetadata.fileName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">MIME & Size</span>
            <span className="text-slate-200">
              {caseRecord.imageMetadata.mimeType} ({formatBytes(caseRecord.imageMetadata.fileSize)})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Dimensions</span>
            <span className="text-slate-200">
              {caseRecord.imageMetadata.width || '—'} × {caseRecord.imageMetadata.height || '—'} px
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">SHA-256 Fingerprint</span>
            <span className="text-emerald-400 truncate block" title={caseRecord.imageMetadata.sha256Hash}>
              {caseRecord.imageMetadata.sha256Hash.substring(0, 16)}...
            </span>
          </div>
        </div>
      </Card>

      {/* Primary Workbench Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1b2230] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('forensics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors shrink-0 ${
            activeTab === 'forensics'
              ? 'bg-[#141924] text-white border border-emerald-500/50'
              : 'text-slate-400 hover:text-white hover:bg-[#0f121a]'
          }`}
        >
          <Fingerprint className="w-4 h-4 text-emerald-400" />
          <span>1. Forensic Integrity</span>
          {caseRecord.forensicResult && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('trace')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors shrink-0 ${
            activeTab === 'trace'
              ? 'bg-[#141924] text-white border border-emerald-500/50'
              : 'text-slate-400 hover:text-white hover:bg-[#0f121a]'
          }`}
        >
          <Search className="w-4 h-4 text-emerald-400" />
          <span>2. Reverse Trace & Discovery</span>
          {caseRecord.traceResult && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black text-emerald-400">
              {caseRecord.traceResult.matches.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('guardian')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors shrink-0 ${
            activeTab === 'guardian'
              ? 'bg-[#141924] text-white border border-emerald-500/50'
              : 'text-slate-400 hover:text-white hover:bg-[#0f121a]'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <span>3. Guardian Removal Reports</span>
          {caseRecord.reports.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black text-emerald-400">
              {caseRecord.reports.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Forensic Analysis */}
      {activeTab === 'forensics' && (
        <div className="space-y-6">
          {!caseRecord.forensicResult ? (
            <Card className="text-center py-16 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#131722] border border-[#222a3a] flex items-center justify-center mx-auto text-emerald-400">
                <Fingerprint className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-white">Forensic Analysis Pending</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The image metadata is registered. Trigger the AI analysis pipeline to inspect frequency domain anomalies, boundary masks, and Error Level Analysis (ELA).
                </p>
              </div>

              {/* Simulation Mode Selector */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-[#0b0e14] border border-[#1b2230] text-left space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Select Simulation Scenario Heuristic:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'deepfake', label: 'Deepfake' },
                    { id: 'manipulated_doc', label: 'Altered Doc' },
                    { id: 'authentic', label: 'Authentic' },
                  ].map((scen) => (
                    <button
                      key={scen.id}
                      type="button"
                      onClick={() => setSimulatedScenario(scen.id as typeof simulatedScenario)}
                      className={`py-1.5 px-2 rounded text-xs font-mono border transition-colors ${
                        simulatedScenario === scen.id
                          ? 'bg-[#161c28] text-emerald-400 border-emerald-500/50'
                          : 'bg-[#0f121a] text-slate-400 border-[#1a202c] hover:text-white'
                      }`}
                    >
                      {scen.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleRunAnalysis}
                isLoading={isAnalyzing}
                icon={<Play className="w-4 h-4" />}
              >
                Execute Forensic Pipeline
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-mono">
                  Engine: <span className="text-slate-200">{caseRecord.forensicResult.modelInfo.provider}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRunAnalysis}
                  isLoading={isAnalyzing}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Re-run Analysis
                </Button>
              </div>

              <ForensicResultView result={caseRecord.forensicResult} />
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reverse Trace & Discovery */}
      {activeTab === 'trace' && (
        <div className="space-y-6">
          {!caseRecord.traceResult ? (
            <Card className="text-center py-16 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#131722] border border-[#222a3a] flex items-center justify-center mx-auto text-emerald-400">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Reverse Discovery Unexecuted</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Execute the investigation pipeline to search visual indices for candidate match locations across social forums and archives.
              </p>
              <Button
                size="sm"
                onClick={handleRunAnalysis}
                isLoading={isAnalyzing}
                icon={<Play className="w-3.5 h-3.5" />}
              >
                Run Discovery Engine
              </Button>
            </Card>
          ) : (
            <TraceResultView result={caseRecord.traceResult} />
          )}
        </div>
      )}

      {/* Tab 3: Guardian Removal Workflow */}
      {activeTab === 'guardian' && (
        <div className="space-y-6">
          <GuardianReportView
            reports={caseRecord.reports}
            onGenerateReport={handleDraftReport}
            isGenerating={isDraftingReport}
          />
        </div>
      )}
    </div>
  );
}
