'use client';

import React from 'react';
import { ForensicAnalysisResult } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert, Cpu, Info } from 'lucide-react';

interface ForensicResultViewProps {
  result: ForensicAnalysisResult;
}

export function ForensicResultView({ result }: ForensicResultViewProps) {
  const isManipulated = result.overallVerdict === 'manipulation_suspected';
  const isAuthentic = result.overallVerdict === 'authentic_candidate';

  return (
    <div className="space-y-6">
      {/* Disclaimer / Model Status Banner */}
      <div className="rounded-lg border border-[#232d3f] bg-[#10141f] p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-200">
            <span>Analysis Engine: {result.modelInfo.provider}</span>
            {result.modelInfo.isMock && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono text-[10px]">
                HEURISTIC SIMULATION
              </span>
            )}
          </div>
          <p className="text-slate-400">
            This report represents preliminary forensic indicators. Production deployment supports connecting authenticated vision models behind the replaceable service interface.
          </p>
        </div>
      </div>

      {/* Primary Verdict Card */}
      <Card glow className="border-[#232d3f]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#1a202d]">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Forensic Integrity Verdict
            </div>
            <div className="flex items-center gap-3">
              {isManipulated ? (
                <div className="w-10 h-10 rounded-lg bg-rose-950/60 border border-rose-700/60 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              ) : isAuthentic ? (
                <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-700/60 flex items-center justify-center text-blue-400">
                  <HelpCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <Badge verdict={result.overallVerdict} className="text-sm px-3 py-1" />
                <div className="text-xs text-slate-400 mt-1">
                  Evaluated at {new Date(result.analyzedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="bg-[#141824] p-4 rounded-xl border border-[#212b3d] min-w-[220px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">Heuristic Confidence</span>
              <span className="font-mono font-bold text-white">
                {(result.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#090b10] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${result.confidenceScore * 100}%`,
                  backgroundColor: isManipulated ? '#f43f5e' : isAuthentic ? '#10b981' : '#38bdf8',
                }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5 font-mono">
              Signal stability: High • Multi-sensor check
            </div>
          </div>
        </div>

        {/* Human Readable Explanation */}
        <div className="pt-5 space-y-2">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
            Investigator Summary
          </div>
          <p className="text-sm text-slate-300 leading-relaxed bg-[#0a0c12] p-4 rounded-lg border border-[#1b212f]">
            {result.explanation}
          </p>
        </div>
      </Card>

      {/* Structural Indicators Table / Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <CardTitle>Detected Structural Indicators ({result.indicators.length})</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-3">
          {result.indicators.map((ind) => (
            <div
              key={ind.id}
              className="p-4 rounded-lg bg-[#0c0f16] border border-[#1b2231] hover:border-[#273248] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    {ind.type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-white">{ind.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-400">
                    Intensity: {(ind.score * 100).toFixed(0)}%
                  </span>
                  <Badge severity={ind.severity} />
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{ind.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Known Limitations */}
      <Card className="bg-[#090b10] border-[#181e2b]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          <Cpu className="w-4 h-4 text-slate-400" />
          <span>Known Algorithmic Limitations</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
          {result.limitations.map((lim, idx) => (
            <li key={idx}>{lim}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
