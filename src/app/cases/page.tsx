'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Case } from '@/types';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import {
  FolderGit2,
  Search,
  PlusCircle,
  Filter,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { formatDate, formatBytes } from '@/lib/utils';

export default function CasesListPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchCases = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let url = '/api/cases';
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to fetch cases');
      }
      setCases(data.data?.cases || []);
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
        let url = '/api/cases';
        const params = new URLSearchParams();
        if (statusFilter !== 'all') {
          params.append('status', statusFilter);
        }
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (!ignore) {
          if (!res.ok) {
            setError(data.error?.message || 'Failed to fetch cases');
          } else {
            setCases(data.data?.cases || []);
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
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCases();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1b2230]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>INVESTIGATION ARCHIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Case Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review case histories, triage forensic verdicts, and monitor takedown notice dispatches.
          </p>
        </div>

        <Link href="/investigate">
          <Button icon={<PlusCircle className="w-4 h-4" />}>
            New Case
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-[#0c0e14]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, file name, or case ID..."
              className="w-full pl-9 pr-20 py-2 rounded-lg bg-[#11141d] border border-[#1e2534] text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#181d28] text-[11px] font-mono text-slate-300 hover:text-white hover:bg-[#202736]"
            >
              Filter
            </button>
          </form>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Cases' },
              { id: 'analysis_pending', label: 'Pending' },
              { id: 'flagged', label: 'Flagged' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-[#151a24] text-white border-emerald-500/50'
                    : 'bg-[#0f121a] text-slate-400 border-[#1a202c] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Cases List Table / Empty States */}
      <Card>
        {isLoading ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
            <p className="text-xs font-mono">Querying repository records...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-400 text-xs">
            {error}
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#131722] border border-[#222a3a] flex items-center justify-center mx-auto text-slate-400">
              <Filter className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">No Matching Cases Found</h4>
              <p className="text-xs text-slate-400">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try broadening your search term or clearing the active status filter.'
                  : 'Get started by creating your first forensic investigation.'}
              </p>
            </div>
            {searchQuery || statusFilter !== 'all' ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Link href="/investigate">
                <Button size="sm">Create Investigation</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0d13] text-slate-400 font-mono border-b border-[#1a202c]">
                <tr>
                  <th className="py-3 px-4">Case Identification</th>
                  <th className="py-3 px-4">Image Evidence</th>
                  <th className="py-3 px-4">Triage Status</th>
                  <th className="py-3 px-4">Forensic Verdict</th>
                  <th className="py-3 px-4">Trace Matches</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Workbench</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151b26]">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#131722]/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white hover:text-emerald-400">
                          <Link href={`/cases/${c.id}`}>{c.title}</Link>
                        </span>
                        {c.isSyntheticFixture && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/25">
                            FIXTURE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">{c.id}</div>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-300">
                      <div className="truncate max-w-[180px] text-white">
                        {c.imageMetadata.fileName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatBytes(c.imageMetadata.fileSize)} • {c.imageMetadata.mimeType}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <Badge status={c.status} />
                    </td>

                    <td className="py-4 px-4">
                      {c.forensicResult ? (
                        <div className="space-y-1">
                          <Badge verdict={c.forensicResult.overallVerdict} />
                          <div className="text-[10px] font-mono text-slate-400">
                            Confidence: {(c.forensicResult.confidenceScore * 100).toFixed(0)}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">Analysis pending</span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-300">
                      {c.traceResult ? (
                        <span className="text-emerald-400 font-semibold">
                          {c.traceResult.matches.length} candidate(s)
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                      {formatDate(c.createdAt)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/cases/${c.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#141822] hover:bg-[#1b212e] text-slate-200 hover:text-white border border-[#222a3a] transition-colors"
                      >
                        <span>Open Case</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
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
