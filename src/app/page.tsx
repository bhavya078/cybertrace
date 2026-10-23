import Link from 'next/link';
import {
  Search,
  FileCheck2,
  Lock,
  ArrowRight,
  Layers,
  Fingerprint,
  Shield,
  CheckCircle2,
  FileSearch,
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
            CyberTrace gives security teams, legal representatives, and investigators a modular pipeline to verify image authenticity, trace syndication across the web, and prepare verified removal actions.
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

      {/* Core Forensic Capabilities */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#1a202d]">
        <div className="text-center space-y-3 mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Forensic Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Complete Digital Evidence Pipeline
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            From client-side intake to legal takedown drafting, every stage is designed for defensible chain-of-custody.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Capability 1: Image Authenticity Verification */}
          <div className="group rounded-xl bg-[#0e1119] border border-[#1d2331] p-6 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#141822] border border-[#22293a] flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-emerald-400">STAGE 01</div>
                <h3 className="text-lg font-bold text-white">Visual Authenticity Analysis</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspects pixel inconsistencies, high-frequency convolutional checkerboards, Error Level Analysis (ELA) gradients, and facial boundary masks for signs of manipulation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#181d28] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Artifact Detection</span>
              <span className="text-emerald-400">Multi-Signal Scan</span>
            </div>
          </div>

          {/* Capability 2: Cross-Platform Discovery */}
          <div className="group rounded-xl bg-[#0e1119] border border-[#1d2331] p-6 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#141822] border border-[#22293a] flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <FileSearch className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-emerald-400">STAGE 02</div>
                <h3 className="text-lg font-bold text-white">Syndication Discovery</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cross-references visual perceptual hash registries to uncover candidate matching distributions across forums, social media, and web archives.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#181d28] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Reverse Discovery</span>
              <span className="text-emerald-400">Candidate Matches</span>
            </div>
          </div>

          {/* Capability 3: Guardian Removal Workflow */}
          <div className="group rounded-xl bg-[#0e1119] border border-[#1d2331] p-6 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#141822] border border-[#22293a] flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-emerald-400">STAGE 03</div>
                <h3 className="text-lg font-bold text-white">Legal Notice Preparation</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Synthesizes forensic evidence into formal takedown packages (DMCA 17 U.S.C. § 512, Right of Publicity) with unverified outcome safeguards.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#181d28] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Compliance Drafting</span>
              <span className="text-emerald-400">Audit-Ready Notices</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Forensic Workflow */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#1a202d]">
        <div className="rounded-2xl bg-[#0d1017] border border-[#1f2636] p-8 md:p-12">
          <div className="max-w-2xl mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#161c28] border border-[#263348] text-xs font-mono text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>CHAIN OF CUSTODY PROTOCOL</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              How CyberTrace Protects Investigation Integrity
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every investigation adheres to strict evidence preservation and privacy standards without exposing sensitive victim assets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-5 rounded-xl bg-[#11141d] border border-[#1e2534] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-xs font-mono font-bold text-emerald-400">
                01
              </div>
              <h4 className="text-sm font-semibold text-white">Client-Side Intake</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Media is previewed in your browser sandbox. A cryptographic SHA-256 fingerprint is calculated locally without persisting raw images to disk.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-xl bg-[#11141d] border border-[#1e2534] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-xs font-mono font-bold text-emerald-400">
                02
              </div>
              <h4 className="text-sm font-semibold text-white">Forensic Signal Triage</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The image is evaluated against multiple manipulation indicators with clear confidence ratings and technical limitations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-xl bg-[#11141d] border border-[#1e2534] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-xs font-mono font-bold text-emerald-400">
                03
              </div>
              <h4 className="text-sm font-semibold text-white">Online Syndication Discovery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Perceptual hash comparisons identify candidate appearances across monitored indices with similarity proximity scores.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-xl bg-[#11141d] border border-[#1e2534] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-xs font-mono font-bold text-emerald-400">
                04
              </div>
              <h4 className="text-sm font-semibold text-white">Removal Package Dispatch</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evidence is compiled into formal takedown drafts with clear disclosures that platform removals require verified confirmation.
              </p>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 pt-6 border-t border-[#181d28] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero server image retention</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No presumption of manipulation upon intake</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Isolated investigator sessions</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
