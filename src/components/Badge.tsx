import React from 'react';
import { cn } from '@/lib/utils';
import { CaseStatus, ForensicVerdict, ForensicSeverity, PriorityScore } from '@/types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'status' | 'verdict' | 'severity' | 'priority' | 'neutral';
  status?: CaseStatus | string;
  verdict?: ForensicVerdict;
  severity?: ForensicSeverity;
  priority?: PriorityScore;
  className?: string;
  showDot?: boolean;
}

export function Badge({
  children,
  status,
  verdict,
  severity,
  priority,
  className,
  showDot = true,
}: BadgeProps) {
  let colorStyles = 'bg-[#151924] text-slate-300 border-[#222b3d]';
  let dotColor = 'bg-slate-400';
  let label = children;

  if (status) {
    switch (status) {
      case 'flagged':
        colorStyles = 'bg-rose-950/40 text-rose-300 border-rose-800/60';
        dotColor = 'bg-rose-500';
        label = label || 'Tampering Suspected';
        break;
      case 'completed':
        colorStyles = 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60';
        dotColor = 'bg-emerald-400';
        label = label || 'Completed';
        break;
      case 'analyzing':
        colorStyles = 'bg-amber-950/40 text-amber-300 border-amber-800/60';
        dotColor = 'bg-amber-400 animate-pulse';
        label = label || 'Analyzing';
        break;
      case 'analysis_pending':
        colorStyles = 'bg-slate-900 text-slate-300 border-slate-700/70';
        dotColor = 'bg-slate-400';
        label = label || 'Analysis Pending';
        break;
      case 'submitted':
        colorStyles = 'bg-slate-900 text-slate-300 border-slate-700';
        dotColor = 'bg-slate-400';
        label = label || 'Submitted';
        break;
      default:
        colorStyles = 'bg-[#151924] text-slate-300 border-[#222b3d]';
        dotColor = 'bg-slate-400';
        label = label || status;
    }
  } else if (verdict) {
    switch (verdict) {
      case 'manipulation_suspected':
        colorStyles = 'bg-rose-950/50 text-rose-300 border-rose-800/70';
        dotColor = 'bg-rose-500';
        label = label || 'Manipulation Suspected';
        break;
      case 'authentic_candidate':
        colorStyles = 'bg-emerald-950/50 text-emerald-400 border-emerald-800/70';
        dotColor = 'bg-emerald-400';
        label = label || 'Authentic Candidate';
        break;
      case 'inconclusive':
        colorStyles = 'bg-amber-950/50 text-amber-300 border-amber-800/70';
        dotColor = 'bg-amber-400';
        label = label || 'Inconclusive / Mixed';
        break;
      default:
        colorStyles = 'bg-slate-900 text-slate-300 border-slate-700/70';
        dotColor = 'bg-slate-400';
        label = label || 'Analysis Pending';
    }
  } else if (severity) {
    switch (severity) {
      case 'high':
        colorStyles = 'bg-rose-950/50 text-rose-300 border-rose-800/60';
        dotColor = 'bg-rose-500';
        label = label || 'High Risk';
        break;
      case 'medium':
        colorStyles = 'bg-amber-950/50 text-amber-300 border-amber-800/60';
        dotColor = 'bg-amber-400';
        label = label || 'Medium';
        break;
      case 'low':
        colorStyles = 'bg-slate-900/60 text-slate-300 border-slate-700/60';
        dotColor = 'bg-slate-400';
        label = label || 'Low Risk';
        break;
      default:
        colorStyles = 'bg-[#151924] text-slate-400 border-[#222b3d]';
        dotColor = 'bg-slate-500';
        label = label || severity;
    }
  } else if (priority) {
    switch (priority) {
      case 'critical':
      case 'high':
        colorStyles = 'bg-rose-950/40 text-rose-300 border-rose-800/60';
        dotColor = 'bg-rose-500';
        break;
      case 'medium':
        colorStyles = 'bg-amber-950/40 text-amber-300 border-amber-800/60';
        dotColor = 'bg-amber-400';
        break;
      default:
        colorStyles = 'bg-slate-900 text-slate-300 border-slate-700';
        dotColor = 'bg-slate-400';
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide select-none',
        colorStyles,
        className
      )}
    >
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />}
      <span>{label}</span>
    </span>
  );
}
