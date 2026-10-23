# CyberTrace REST API Specification & Contract

This document defines the formal REST API contract for CyberTrace, following strict Zod validation envelopes and standardized HTTP status codes.

---

## 1. Response Envelope

All API endpoints return a standardized JSON response envelope:

### Success Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-10-23T18:40:00.000Z"
}
```

### Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | BAD_REQUEST | INTERNAL_SERVER_ERROR",
    "message": "Human readable summary of the error",
    "details": [ ... ]
  },
  "timestamp": "2026-10-23T18:40:00.000Z"
}
```

---

## 2. Endpoints

### 2.1 System Health
`GET /api/health`

Verifies application runtime status, persistence adapter, and AI service bridge readiness.

- **Status Code**: `200 OK`
- **Response Example**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 124.5,
    "timestamp": "2026-10-23T18:40:00.000Z",
    "version": "0.1.0",
    "environment": "development",
    "services": {
      "persistence": {
        "adapter": "FileCaseRepository (.data/cases.json)",
        "status": "operational"
      },
      "aiProviders": {
        "forensic": "MockForensicService (Deterministic Heuristics)",
        "trace": "MockTraceService (Multi-domain Candidate Matching)",
        "guardian": "MockGuardianService (DMCA / Right-of-Publicity Drafter)",
        "mode": "mock"
      }
    }
  },
  "timestamp": "2026-10-23T18:40:00.000Z"
}
```

---

### 2.2 List Cases
`GET /api/cases`

Lists case records. Supports optional search and status filtering.

- **Query Parameters**:
  - `status` *(optional)*: `submitted | analysis_pending | analyzing | completed | flagged | archived`
  - `search` *(optional)*: Substring matching title, filename, or ID
- **Status Code**: `200 OK`
- **Response Example**:
```json
{
  "success": true,
  "data": {
    "total": 2,
    "cases": [
      {
        "id": "case_1729690000abc",
        "title": "Suspected Executive Deepfake",
        "status": "flagged",
        "createdAt": "2026-10-23T16:00:00.000Z",
        "updatedAt": "2026-10-23T16:30:00.000Z",
        "imageMetadata": {
          "fileName": "avatar.png",
          "mimeType": "image/png",
          "fileSize": 1402300,
          "width": 1024,
          "height": 1024,
          "sha256Hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        },
        "reports": []
      }
    ]
  },
  "timestamp": "2026-10-23T18:40:00.000Z"
}
```

---

### 2.3 Create Investigation Case
`POST /api/cases`

Validates file metadata and creates a new case in the persistent repository.

- **Privacy Constraint**: Original image content is not permanently persisted on disk. Only file dimensions, MIME type, file size, preview data URL, and cryptographic SHA-256 are stored.
- **Request Body (Zod Validated)**:
```json
{
  "title": "Altered Financial Document",
  "description": "Invoice showing suspicious font variance",
  "fileName": "invoice_altered.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 948210,
  "width": 1200,
  "height": 1600,
  "sha256Hash": "a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef",
  "previewDataUrl": "data:image/svg+xml;utf8,...",
  "isSyntheticFixture": false
}
```
- **Validation Rules**:
  - `title`: `min(3)`, `max(120)`
  - `mimeType`: `image/jpeg`, `image/png`, `image/webp`, `image/tiff`
  - `fileSize`: positive integer, max `10,485,760` bytes (10MB)
  - `sha256Hash`: 64-character hexadecimal regex
- **Status Code**: `201 Created`

---

### 2.4 Retrieve Case by ID
`GET /api/cases/[id]`

Retrieves single case with attached forensic analysis and drafted removal packages.

- **Status Code**: `200 OK` (or `404 Not Found` if nonexistent)

---

### 2.5 Run Analysis Pipeline
`POST /api/cases/[id]/analyze`

Triggers the `ForensicService` and `TraceService` pipeline for the specified case.

- **Request Body**:
```json
{
  "deepScan": true,
  "enableTraceDiscovery": true,
  "simulatedScenario": "deepfake | manipulated_doc | authentic | inconclusive"
}
```
- **Status Code**: `200 OK`
- **Output**: Returns updated case with structured indicators, confidence score, limitations, and candidate URLs.

---

### 2.6 Generate Draft Removal Report
`POST /api/cases/[id]/reports`

Invokes `GuardianService` to synthesize forensic evidence and candidate URLs into an actionable takedown package.

- **Request Body**:
```json
{
  "title": "Expedited DMCA Removal Notice",
  "noticeType": "dmca_takedown | defamation_notice | privacy_violation | terms_of_service",
  "targetUrls": ["https://target-domain.com/unauthorized-file.png"],
  "recipientEmail": "abuse@target-domain.com",
  "notes": "Urgent executive impersonation"
}
```
- **Safety Enforcement**: All platform notices default to `verifiedOutcome: "unverified"`.
- **Status Code**: `201 Created`
