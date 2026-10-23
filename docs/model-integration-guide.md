# NVIDIA Models Integration Guide (via Nebius Token Factory)

This guide documents the exact extension points where the team will swap out CyberTrace's initial deterministic mock adapters for verified NVIDIA models using the Nebius Token Factory API.

---

## Architecture Overview

All AI integrations are isolated behind server-side TypeScript interfaces. UI components and API routes consume the interfaces, never provider-specific SDKs directly:

```
[UI Component / API Route]
            │
            ▼
[Service Factory (src/server/services/index.ts)]
            │
      ┌─────┴───────────────────────┐
      │                             │
[Mock Adapter]            [NVIDIA / Nebius Adapter]
(Default / Offline)       (Configured via .env)
```

---

## 1. ForensicService — NVIDIA Vision Checkpoint

### Model Specification
- **Recommended Candidate**: NVIDIA Nemotron Vision / Llama-Vision-Instruct or custom forensic checkpoint
- **Endpoint Target**: `POST https://api.studio.nebius.ai/v1/chat/completions` (multimodal vision payload)
- **Role**: Detects image synthesis fingerprints, lighting vector contradictions, frequency domain checkerboards, and localized resaving compression gradients.

### Implementation Blueprint
Create `src/server/services/forensics/nebius-nvidia-forensic-service.ts`:

```typescript
import { IForensicService, ForensicScanOptions } from './forensic-service.interface';
import { Case, ForensicAnalysisResult } from '@/types';

export class NebiusNvidiaForensicService implements IForensicService {
  private apiKey: string;
  private endpoint: string;

  constructor(apiKey: string, endpoint: string = 'https://api.studio.nebius.ai/v1') {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
  }

  async analyze(caseRecord: Case, options?: ForensicScanOptions): Promise<ForensicAnalysisResult> {
    // 1. Prepare base64 or temporary presigned URL
    // 2. Transmit structured prompt requesting JSON-formatted forensic indicator taxonomy
    // 3. Parse indicators: error level analysis, facial contour masks, confidence metrics
    // 4. Return typed ForensicAnalysisResult with provider: 'NVIDIA (via Nebius)'
  }
}
```

---

## 2. TraceService — NVIDIA Multimodal Embedding Checkpoint

### Model Specification
- **Recommended Candidate**: NVIDIA NeVA / NV-Embed-QA Multimodal Embedding
- **Endpoint Target**: `POST https://api.studio.nebius.ai/v1/embeddings`
- **Role**: Transforms investigated image features into high-dimensional vector embeddings to query vector indices (Pinecone, Milvus, Qdrant) or web visual syndication registries.

### Implementation Blueprint
Create `src/server/services/trace/nebius-nvidia-trace-service.ts`:

```typescript
import { ITraceService } from './trace-service.interface';
import { Case, TraceResult } from '@/types';

export class NebiusNvidiaTraceService implements ITraceService {
  async discover(caseRecord: Case): Promise<TraceResult> {
    // 1. Generate image embedding vector using NVIDIA NV-Embed
    // 2. Query nearest-neighbor index for matching media distributions
    // 3. Return ranked candidate URLs, similarity scores (cosine distance), and match methods
  }
}
```

---

## 3. GuardianService — NVIDIA Nemotron LLM Reasoning

### Model Specification
- **Recommended Candidate**: `nvidia/nemotron-4-340b-instruct` or `nvidia/llama-3.1-nemotron-70b-instruct`
- **Endpoint Target**: `POST https://api.studio.nebius.ai/v1/chat/completions`
- **Role**: Ingests compiled forensic evidence and candidate distribution locations, reasons over legal takedown frameworks (DMCA 17 U.S.C. § 512, Right of Publicity, Defamation), and synthesizes actionable notices.

### Implementation Blueprint
Create `src/server/services/guardian/nebius-nvidia-guardian-service.ts`:

```typescript
import { IGuardianService, GenerateReportOptions } from './guardian-service.interface';
import { Case, RemovalReport } from '@/types';

export class NebiusNvidiaGuardianService implements IGuardianService {
  async generateReport(caseRecord: Case, options?: GenerateReportOptions): Promise<RemovalReport> {
    // 1. Construct system prompt enforcing strict legal formatting
    // 2. Streamline evidence citations (SHA-256, verified indicators)
    // 3. Enforce the mandatory Unverified Status Safeguard in output
  }
}
```

---

## 4. Activation Switch

To switch between mock and live NVIDIA adapters, update `src/server/services/index.ts`:

```typescript
const aiMode = process.env.CYBERTRACE_AI_MODE;

export function getForensicService(): IForensicService {
  if (aiMode === 'nebius_nvidia') {
    return new NebiusNvidiaForensicService(process.env.NEBIUS_API_KEY!);
  }
  return new MockForensicService();
}
```
