# CyberTrace System Architecture

CyberTrace is engineered as a privacy-first, modular cybersecurity SaaS platform for image forensics, reverse visual discovery, and takedown notice preparation.

---

## High-Level Architecture

```
┌────────────────────────────────────────────────────────┐
│                   BROWSER CLIENT                       │
│                                                        │
│  - React 19 + Next.js App Router (Tailwind CSS v4)    │
│  - Client-side WebCrypto SHA-256 Digesting             │
│  - Ephemeral Canvas Preview (Zero Server Retention)    │
│  - Interactive Triage & Synthetic Fixtures Workbench  │
└───────────────────────────┬────────────────────────────┘
                            │ JSON (Zod Validated)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   NEXT.JS SERVER API                   │
│                                                        │
│  /api/health               /api/cases                  │
│  /api/cases/[id]           /api/cases/[id]/analyze     │
│  /api/cases/[id]/reports                               │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│    REPOSITORY LAYER      │  │    AI SERVICES LAYER     │
│                          │  │                          │
│ - ICaseRepository        │  │ - IForensicService       │
│ - FileCaseRepository     │  │   (Mock / NVIDIA Vision) │
│   (.data/cases.json)     │  │ - ITraceService          │
│ - MemoryCaseRepository   │  │   (Mock / Multimodal)    │
│                          │  │ - IGuardianService       │
│                          │  │   (Mock / Nemotron LLM)  │
└──────────────────────────┘  └──────────────────────────┘
```

---

## Directory Organization

```
cybertrace/
├── docs/                             # Architecture, contracts & onboarding guides
│   ├── api-contracts.md              # Formal REST API specification
│   ├── architecture.md               # System design documentation
│   ├── model-integration-guide.md    # NVIDIA / Nebius connection blueprint
│   └── team-work-allocation.md       # 4-developer parallel execution guide
├── src/
│   ├── app/                          # Next.js App Router pages & API routes
│   │   ├── api/                      # Server-side API endpoints
│   │   │   ├── cases/                # Case creation, listing & ID routes
│   │   │   └── health/               # System health check
│   │   ├── cases/                    # Case archive & detail workbench
│   │   ├── dashboard/                # Investigation operations center
│   │   ├── investigate/              # File intake & preview pipeline
│   │   ├── globals.css               # Cybersecurity design tokens
│   │   ├── layout.tsx                # Global application shell
│   │   └── page.tsx                  # CyberTrace landing page
│   ├── components/                   # Reusable UI primitives (Badge, Card, Button, Navbar, Footer)
│   ├── features/                     # Domain UI views
│   │   ├── forensics/                # Forensic results & indicator cards
│   │   ├── guardian/                 # Removal notice drafts & legal view
│   │   └── trace/                    # Candidate match tables & domains
│   ├── lib/                          # Shared constants, Zod validations, utils, fixtures
│   ├── server/                       # Backend domain logic
│   │   ├── repositories/             # Persistence interfaces & adapters
│   │   └── services/                 # Three AI interfaces & mock adapters
│   └── types/                        # Shared TypeScript type definitions
├── test/                             # Automated test suite (Vitest)
├── .env.example                      # Configuration template
├── package.json                      # Dependencies & scripts
└── tsconfig.json                     # Strict TypeScript configuration
```

---

## Key Security & Privacy Safeguards

1. **Client-Side Image Hashing**:
   The browser computes the SHA-256 fingerprint using `crypto.subtle.digest` before transmitting metadata. Original full-resolution image binaries are never stored by the server by default.

2. **Unverified Notice Protocol**:
   The `GuardianService` enforces that all generated takedown notices specify `verifiedOutcome: 'unverified'`. CyberTrace will never falsely assert that a hosting provider has removed or suppressed content without validated confirmation.

3. **Deterministic Heuristics with Honest Disclaimers**:
   All mock services explicitly declare `isMock: true` and surface notices alerting the user that initial indicators are simulated until live models are authenticated.
