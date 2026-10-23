import Link from 'next/link';
import {
  Search,
  FileCheck2,
  Lock,
  ArrowRight,
  Terminal,
  Layers,
  Fingerprint,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background Grid Pattern & Subtle Ambient Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10141e] border border-[#202738] text-xs text-slate-300 font-mono shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI IMAGE FORENSICS PLATFORM</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-medium">PRIVACY-SECURED</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Forensic Intelligence for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
              Manipulated Visual Media
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            CyberTrace gives security teams, legal representatives, and investigators a modular pipeline to verify image authenticity, trace syndication across the web, and draft verified removal actions.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/investigate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/15 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Search className="w-4 h-4" />
              <span>Launch New Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#141824] hover:bg-[#1a2130] text-slate-200 font-medium text-sm border border-[#242e42] hover:border-[#354360] transition-all"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Investigation Overview</span>
            </Link>
          </div>

          {/* Privacy Guarantee Pill */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero persistent storage of sensitive victim media. In-browser hashing and memory-only analysis.</span>
          </div>
        </div>
      </section>

      {/* 3 Modular AI Pipeline Engines */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#1a202d]">
        <div className="text-center space-y-3 mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Modular Service Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Three Independent Forensic Engines
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Architected for parallel multi-engineer development with pluggable AI provider adapters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: ForensicService */}
          <div className="group rounded-xl bg-[#0e1119] border border-[#1d2331] p-6 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#141822] border border-[#22293a] flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-emerald-400">SERVICE 01</div>
                <h3 className="text-lg font-bold text-white">ForensicService</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspects pixel inconsistencies, high-frequency convolutional checkerboards, Error Level Analysis (ELA) gradients, and facial boundary masks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#181d28] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Target: Vision Model</span>
              <span className="text-emerald-400">Pluggable Adapter</span>
            </div>
          </div>

          {/* Card 2: TraceService */}
          <div className="group rounded-xl bg-[#0e1119] border border-[#1d2331] p-6 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#141822] border border-[#22293a] flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-emerald-400">SERVICE 02</div>
                <h3 className="text-lg font-bold text-white">TraceService</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Queries perceptual hash registries and visual neural embedding indices to uncover candidate matching distributions across forums and web archives.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#181d28] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Target: Discovery Engine</span>
              <span className="text-emerald-400">Pluggable Adapter</span>
            </div>
          </div>

          {/* Card 3: GuardianService */}
          <div className="group rounded-xl bg-[#0e1119] border border-[#1d2331] p-6 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#141822] border border-[#22293a] flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-emerald-400">SERVICE 03</div>
                <h3 className="text-lg font-bold text-white">GuardianService</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Synthesizes forensic evidence into formal takedown packages (DMCA, Right of Publicity). Enforces unverified platform notice safety guardrails.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#181d28] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Target: Legal LLM</span>
              <span className="text-emerald-400">Pluggable Adapter</span>
            </div>
          </div>
        </div>
      </section>

      {/* Developer & Architecture Philosophy */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#1a202d]">
        <div className="rounded-2xl bg-[#0d1017] border border-[#1f2636] p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#161c28] border border-[#263348] text-xs font-mono text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>SECURE WORKBENCH ARCHITECTURE</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Engineered for Multi-Developer Velocity & Privacy
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                CyberTrace is structured with strict separation of concerns across presentation features, backend domain services, and repository persistence. Four engineers can independently implement forensic analysis, trace engines, legal workflows, and infrastructure without merge contention.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-[#121620] border border-[#202737]">
                  <div className="text-xs text-slate-400">Strict Typecheck</div>
                  <div className="text-sm font-semibold text-white">TypeScript Strict Mode</div>
                </div>
                <div className="p-3 rounded-lg bg-[#121620] border border-[#202737]">
                  <div className="text-xs text-slate-400">Validation & Security</div>
                  <div className="text-sm font-semibold text-white">Zod + SSRF Shield</div>
                </div>
              </div>
            </div>

            <div className="bg-[#07090e] rounded-xl p-5 border border-[#191f2c] font-mono text-xs text-slate-300 space-y-3">
              <div className="flex items-center justify-between border-b border-[#161d28] pb-3 text-slate-400">
                <span>API Health & Runtime</span>
                <span className="text-emerald-400">STATUS: OPERATIONAL</span>
              </div>
              <div className="space-y-1 text-slate-400">
                <p><span className="text-emerald-400">&gt;</span> GET /api/health</p>
                <p className="text-slate-200">  HTTP 200 OK — Ready for investigation</p>
                <p><span className="text-emerald-400">&gt;</span> POST /api/cases (Validated Zod input)</p>
                <p className="text-slate-200">  Safe metadata extraction (SHA-256 hash)</p>
                <p><span className="text-emerald-400">&gt;</span> POST /api/cases/[id]/analyze</p>
                <p className="text-slate-200">  Forensic + Trace modular pipeline</p>
                <p><span className="text-emerald-400">&gt;</span> POST /api/cases/[id]/reports</p>
                <p className="text-slate-200">  Draft DMCA / Terms of Service notice</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
