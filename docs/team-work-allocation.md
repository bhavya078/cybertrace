# CyberTrace — 4-Developer Parallel Work Allocation Guide

CyberTrace's architecture is organized into four decoupled ownership zones to allow four developers to execute simultaneously without code collisions or merge blockers.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CYBERTRACE ARCHITECTURE                         │
├─────────────────────┬─────────────────────┬────────────────────────────┤
│ DEV 1: PLATFORM     │ DEV 2: FORENSICS    │ DEV 3: TRACE & DISCOVERY   │
│ & INFRASTRUCTURE    │ & VISION INTELLIGENCE│ ENGINE                    │
│                     │                     │                            │
│ - Shared Types      │ - IForensicService  │ - ITraceService            │
│ - Repositories      │ - Heuristic Models  │ - Perceptual Hashing       │
│ - Auth & Storage    │ - ELA & FFT Spectra │ - Multi-Platform Crawl     │
│ - Core Shell & Nav  │ - Visual UI Cards   │ - Candidate Table UI       │
├─────────────────────┴─────────────────────┴────────────────────────────┤
│ DEV 4: GUARDIAN SERVICE & LEGAL WORKFLOW                               │
│                                                                        │
│ - IGuardianService                                                     │
│ - DMCA & Right-of-Publicity Notice Synthesizer                          │
│ - Unverified Platform Notice Guardrails                                │
│ - PDF/Text Report Exporter UI                                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Developer 1: Core Platform, Persistence & API Foundation
**Domain**: System Shell, Repositories, Client Storage Policy & Triage API

- **Key Responsibilities**:
  1. Maintain persistence adapters (`src/server/repositories/`).
  2. Implement database migrations (e.g. SQLite, PostgreSQL, or DynamoDB) when transitioning from the local file repository.
  3. Enforce secure client-side image storage policies (`src/server/services/storage/`).
  4. Maintain API route handlers (`/api/health`, `/api/cases`, `/api/cases/[id]`).
- **Primary Files**:
  - `src/server/repositories/`
  - `src/server/services/storage/`
  - `src/app/api/cases/`
  - `src/components/Navbar.tsx`, `Footer.tsx`

---

## Developer 2: Forensics & Vision Intelligence
**Domain**: Forensic Tampering Detection & Visual Anomaly Display

- **Key Responsibilities**:
  1. Implement and refine `IForensicService` in `src/server/services/forensics/`.
  2. Integrate verified NVIDIA Vision models via Nebius Token Factory (see `docs/model-integration-guide.md`).
  3. Implement client-side Error Level Analysis (ELA) canvas visualizers and high-frequency Fourier decomposition maps.
  4. Maintain structured forensic indicator taxonomy and model limitations disclaimers.
- **Primary Files**:
  - `src/server/services/forensics/`
  - `src/features/forensics/`
  - `src/types/forensics.ts`

---

## Developer 3: Trace Engine & Online Discovery
**Domain**: Perceptual Visual Matching & Syndication Footprints

- **Key Responsibilities**:
  1. Implement and refine `ITraceService` in `src/server/services/trace/`.
  2. Integrate visual neural embedding indices (e.g., NVIDIA Multimodal Embedding) and reverse image search providers.
  3. Implement perceptual hashing (pHash, dHash, aHash) algorithms.
  4. Develop the candidate matches discovery interface with domain filters and similarity meters.
- **Primary Files**:
  - `src/server/services/trace/`
  - `src/features/trace/`
  - `src/types/trace.ts`

---

## Developer 4: Guardian Service & Legal Workflows
**Domain**: Evidence Synthesis, Takedown Drafting & Verification Tracking

- **Key Responsibilities**:
  1. Implement and refine `IGuardianService` in `src/server/services/guardian/`.
  2. Connect NVIDIA Nemotron LLM via Nebius Token Factory for automated legal notice drafting.
  3. Maintain takedown letter templates (DMCA 17 U.S.C. § 512, EU DSA, Defamation, Right of Publicity).
  4. Enforce strict **Unverified Status Safeguards** (never claiming platforms removed content without external validation).
  5. Build formal PDF/Text takedown export workflows.
- **Primary Files**:
  - `src/server/services/guardian/`
  - `src/features/guardian/`
  - `src/types/guardian.ts`
