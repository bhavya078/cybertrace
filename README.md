# CyberTrace — Visual Forensic Intelligence Platform

> **AI-Powered Image Forensics, Online Syndication Discovery & Removal Notice Preparation**

CyberTrace is an investigation platform engineered for security analysts, legal representatives, and investigators to evaluate potentially manipulated media, map candidate online distribution points, and synthesize verified removal notice packages.

---

## Key Features

- **Forensic Tampering Triage**: Analyzes high-frequency generative artifacts, facial boundary masks, Error Level Analysis (ELA) compression gradients, and metadata consistency.
- **Reverse Trace & Online Discovery**: Searches visual hash registries and neural embedding distributions to identify candidate matching locations across social platforms, image boards, forums, and web archives.
- **Guardian Removal Workflow**: Synthesizes verified forensic signals and distribution URLs into formal takedown packages (DMCA 17 U.S.C. § 512, Right of Publicity, Terms of Service).
- **Ephemeral Processing & Privacy-First**: Inspects and previews media locally in the browser sandbox. The server only stores cryptographic fingerprints (SHA-256) and structural metrics—never permanently retaining victim images by default.
- **Synthetic Test Fixtures**: Includes zero-risk preset scenarios (GAN Deepfake Portrait, Altered Financial Certificate, Authentic Baseline Photo) for live demonstration without uploading sensitive personal files.
- **Modular AI Architecture**: Pluggable, replaceable server-side adapters allowing the team to connect vision models, discovery engines, and reasoning LLMs.

---

## Security & Privacy Controls

- **Zero Media Retention**: Media binaries and Base64 data URLs are kept strictly in the user's browser sandbox via in-memory `blob:` URLs; the backend only receives validated metadata and SHA-256 digests.
- **SSRF Defense Shield**: Server-Side Request Forgery prevention on target URLs rejects RFC 1918 private subnets, cloud metadata (`169.254.169.254`), non-HTTP/S protocols, and non-standard ports.
- **Magic Byte Verification**: Verifies true binary file headers (JPEG `FF D8 FF`, PNG `89 50 4E 47`, WebP `RIFF...WEBP`) to block MIME-spoofing and hidden executable uploads.
- **Investigator Session Isolation (IDOR Defense)**: Cases are cryptographically partitioned by investigator session identifiers to prevent Insecure Direct Object References.
- **Token Bucket Rate Limiting**: Sliding window rate limiting across API endpoints protects services against request flooding and brute-force enumeration.
- **Hardened HTTP Headers**: Strict Content Security Policy (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Cache-Control: no-store, private` on private case records.

---

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Persistence**: Modular Repository Pattern (Local File-based JSON Adapter + In-Memory Adapter)

---

## Getting Started (Windows & Cross-Platform)

### Prerequisites

- **Node.js**: v20+ or v24+ (`node --version`)
- **npm**: v10+ or v11+ (`npm --version`)
- **Git**: (`git --version`)

### Installation

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/bhavya078/cybertrace.git
   cd cybertrace
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Configure Environment Variables:**
   ```powershell
   copy .env.example .env.local
   ```
   *(By default, CyberTrace runs immediately in `mock` mode without requiring external API keys).*

---

## Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts local Next.js development server on `http://localhost:3000` |
| **Type Check** | `npm run typecheck` | Executes strict TypeScript compiler (`tsc --noEmit`) |
| **Lint** | `npm run lint` | Runs ESLint across all source and test files |
| **Unit & Security Tests** | `npm run test` | Executes unit and security test suite via Vitest |
| **Test Watch** | `npm run test:watch` | Runs Vitest in interactive watch mode |
| **Production Build** | `npm run build` | Compiles optimized Next.js production bundle |
| **Start Production** | `npm run start` | Boots compiled production server |

---

## Page Navigation

1. **`/`** — Landing page introducing product philosophy, three AI engines, and quick-launch CTAs.
2. **`/dashboard`** — Investigation overview displaying active case metrics, recent investigation logs, and one-click synthetic scenario presets.
3. **`/investigate`** — Intake pipeline with drag-and-drop file upload, browser sandbox preview, client-side SHA-256 calculation, and preset loaders.
4. **`/cases`** — Case directory supporting status filtering (Pending, Flagged, Completed) and keyword search.
5. **`/cases/[id]`** — Detailed investigation workbench featuring:
   - **Tab 1: Forensic Integrity**: Signal confidence meter, structured indicators list, and model limitations disclaimer.
   - **Tab 2: Reverse Trace & Discovery**: Discovered candidate URLs, similarity meters, matching methods, and takedown eligibility tags.
   - **Tab 3: Guardian Removal Reports**: Formal takedown draft letter preview, legal basis summary, unverified outcome tracking, and one-click copy/download.
6. **`/reports`** — Dedicated removal reports and takedown notices repository across all investigated cases.
7. **`/settings`** — Workbench settings displaying active investigator session ID, storage adapter status, security controls, and session reset action.

---

## Architecture & Team Allocation

CyberTrace is organized for a 4-developer team working in parallel:

- **Developer 1**: Core Platform, Repositories, Security & API Routes (`src/server/repositories/`, `src/server/security/`, `src/app/api/`)
- **Developer 2**: Forensics & Vision Intelligence (`src/server/services/forensics/`, `src/features/forensics/`)
- **Developer 3**: Trace & Online Discovery (`src/server/services/trace/`, `src/features/trace/`)
- **Developer 4**: Guardian & Legal Workflows (`src/server/services/guardian/`, `src/features/guardian/`)

For full details, review:
- [API Contracts Documentation](docs/api-contracts.md)
- [Team Work Allocation Guide](docs/team-work-allocation.md)
- [AI Model Integration Blueprint](docs/model-integration-guide.md)
- [System Architecture](docs/architecture.md)

---

## Honest Limitations & Ethics

1. **No False Tampering Claims**: Merely submitting an image never flags it as manipulated. Cases begin in `Analysis pending` status.
2. **Mock Indicators Labeled**: Until external live models are authenticated, all simulation results are clearly marked as `DEMO / MOCK ANALYSIS`.
3. **Unverified Notice Protocol**: The Guardian Service never claims a host or social platform has removed content without external validation (`verifiedOutcome: "unverified"`).
4. **Zero Media Retention**: Sensitive victim media is not permanently stored on disk by default.

---

## License

MIT © CyberTrace Contributors.
