'use client';

import React, { useState } from 'react';
import { TraceResult } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Globe, ExternalLink, Copy, Check, Radio, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface TraceResultViewProps {
  result: TraceResult;
}

export function TraceResultView({ result }: TraceResultViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Provider disclaimer */}
      <div className="rounded-lg border border-[#232a38] bg-[#10141e] p-4 flex items-start gap-3">
        <Radio className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-200">
            <span>Trace Engine: {result.providerInfo.provider}</span>
            {result.providerInfo.isMock && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono text-[10px]">
                DEMO / SYNTHETIC CANDIDATE MATCHES
              </span>
            )}
          </div>
          <p className="text-slate-400">
            Reverse image discovery matches are candidate locations identified via visual hashing. Similarity scores indicate perceptual proximity and do not establish legal ownership.
          </p>
        </div>
      </div>

      {/* Matches List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <CardTitle>Discovered Candidate Matches ({result.matches.length})</CardTitle>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Queried: {formatDate(result.queriedAt)}
            </span>
          </div>
        </CardHeader>

        {result.matches.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No public candidate matches discovered across monitored indices.
          </div>
        ) : (
          <div className="space-y-3">
            {result.matches.map((match) => (
              <div
                key={match.id}
                className="p-4 rounded-lg bg-[#0c0e14] border border-[#1b212d] hover:border-[#2a3447] transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-white px-2 py-0.5 rounded bg-[#151922] border border-[#232a39]">
                      {match.domain}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 uppercase px-2 py-0.5 rounded bg-black/40 border border-slate-800">
                      {match.platformType.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Method: <span className="text-slate-200">{match.matchMethod}</span>
                    </span>
                  </div>

                  {/* Similarity score */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-mono text-emerald-400 font-bold">
                        {(match.similarityScore * 100).toFixed(0)}% Similarity
                      </div>
                    </div>
                    {match.isTakedownEligible && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950/50 text-emerald-300 border border-emerald-800/60">
                        TAKEDOWN ELIGIBLE
                      </span>
                    )}
                  </div>
                </div>

                {/* Target URL with copy action */}
                <div className="flex items-center gap-2 bg-[#080a0e] px-3 py-2 rounded border border-[#181d28]">
                  <span className="text-xs font-mono text-slate-300 truncate flex-1">
                    {match.url}
                  </span>
                  <button
                    onClick={() => handleCopy(match.url, match.id)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === match.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={match.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                    title="Open link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {match.sourceContext && (
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-300">Context:</span> {match.sourceContext}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Limitations note */}
      <div className="text-xs text-slate-400 flex items-start gap-2 px-1">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          {result.limitations.map((lim, i) => (
            <p key={i}>{lim}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
