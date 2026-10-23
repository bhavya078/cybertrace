'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Case } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import {
  FolderGit2,
  FileCheck,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { formatDate, formatBytes } from '@/lib/utils';
import { SYNTHETIC_FIXTURE_PRESETS } from '@/lib/fixtures';

export default function DashboardPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchCases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/cases');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to fetch cases');
      }
      setCases(data.data.cases || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading cases');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch('/api/cases');
        const data = await res.json();
        if (!ignore) {
          if (!res.ok) {
            setError(data.error?.message || 'Failed to fetch cases');
          } else {
            setCases(data.data.cases || []);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error loading cases');
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleLoadSyntheticFixture = async (fixtureIndex: number) => {
    try {
      setIsSeeding(true);
      const fixture = SYNTHETIC_FIXTURE_PRESETS[fixtureIndex];
      const payload = {
        title: fixture.name,
        description: fixture.description,
        fileName: fixture.fileName,
        mimeType: fixture.mimeType,
        fileSize: fixture.fileSize,
        width: fixture.width,
        height: fixture.height,
        sha256Hash: fixture.sha256Hash,
        previewDataUrl: fixture.sampleSvgPreview,
        isSyntheticFixture: true,
      };

      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to create fixture case');
      }

      await fetchCases();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error creating fixture');
    } finally {
      setIsSeeding(false);
    }
  };

  // Metrics
  const totalCases = cases.length;
  const pendingCases = cases.filter((c) => c.status === 'analysis_pending' || c.status === 'analyzing').length;
  const flaggedCases = cases.filter((c) => c.status === 'flagged').length;
  const totalReports = cases.reduce((acc, c) => acc + (c.reports?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1f2636]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#76b900] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#76b900] animate-pulse" />
            <span>SECURITY OPERATIONS CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Investigation Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time status of visual forensic audits, network discovery, and legal removal packages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCases}
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Audits</span>
            <FolderGit2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{totalCases}</div>
          <div className="mt-1 text-[11px] text-slate-400">Cases logged across repository</div>
        </Card>

        {/* Metric 2 */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">In Pipeline</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-400 font-mono">{pendingCases}</div>
          <div className="mt-1 text-[11px] text-slate-400">Awaiting analysis execution</div>
        </Card>

        {/* Metric 3 */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Flagged Tampering</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-400 font-mono">{flaggedCases}</div>
          <div className="mt-1 text-[11px] text-slate-400">High-confidence anomalies identified</div>
        </Card>

        {/* Metric 4 */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Takedowns Drafted</span>
            <FileCheck className="w-4 h-4 text-[#76b900]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#76b900] font-mono">{totalReports}</div>
          <div className="mt-1 text-[11px] text-slate-400">Unverified notices compiled</div>
        </Card>
      </div>

      {/* Synthetic Test Fixtures Loader Section */}
      <Card className="border-[#273248] bg-gradient-to-r from-[#11151e] to-[#0c0e14]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#76b900]">
              <Sparkles className="w-4 h-4" />
              <span>SYNTHETIC DEMONSTRATION WORKBENCH</span>
            </div>
            <h3 className="text-sm font-semibold text-white">
              Load Preset Forensic Test Scenarios
            </h3>
            <p className="text-xs text-slate-400">
              Instantly seed simulated visual anomalies for zero-risk demonstrations without uploading sensitive personal files.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              disabled={isSeeding}
              onClick={() => handleLoadSyntheticFixture(0)}
            >
              + Deepfake Portrait
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={isSeeding}
              onClick={() => handleLoadSyntheticFixture(1)}
            >
              + Altered Document
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={isSeeding}
              onClick={() => handleLoadSyntheticFixture(2)}
            >
              + Authentic Baseline
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Investigations Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#76b900]" />
              <CardTitle>Recent Investigation Cases</CardTitle>
            </div>
            <Link
              href="/cases"
              className="text-xs font-medium text-[#76b900] hover:underline flex items-center gap-1"
            >
              <span>View All Cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </CardHeader>

        {isLoading ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#76b900]" />
            <p className="text-xs font-mono">Loading cases from repository...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-rose-400 text-xs">
            {error}
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-sm text-slate-400">No cases recorded in the system yet.</p>
            <Link href="/investigate">
              <Button size="sm">Create First Case</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0e14] text-slate-400 font-mono border-b border-[#1b2230]">
                <tr>
                  <th className="py-3 px-4">Case ID & Title</th>
                  <th className="py-3 px-4">File Details</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Forensic Signal</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171d29]">
                {cases.slice(0, 6).map((c) => (
                  <tr key={c.id} className="hover:bg-[#151923]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{c.title}</div>
                      <div className="text-[11px] font-mono text-slate-400">{c.id}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div className="truncate max-w-[180px]">{c.imageMetadata.fileName}</div>
                      <div className="text-[10px] text-slate-400">
                        {formatBytes(c.imageMetadata.fileSize)} • {c.imageMetadata.mimeType}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      {c.forensicResult ? (
                        <Badge verdict={c.forensicResult.overallVerdict} />
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">Analysis pending</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {formatDate(c.createdAt).split(',')[0]}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/cases/${c.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#171c26] hover:bg-[#202735] text-slate-200 hover:text-white border border-[#273247] transition-colors"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3 text-[#76b900]" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
