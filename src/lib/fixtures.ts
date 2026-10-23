import { Case } from '@/types';

export interface SyntheticFixturePreset {
  id: string;
  name: string;
  tagline: string;
  category: 'deepfake' | 'manipulated_document' | 'authentic_baseline';
  description: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
  sha256Hash: string;
  sampleSvgPreview: string;
}

export const SYNTHETIC_FIXTURE_PRESETS: SyntheticFixturePreset[] = [
  {
    id: 'fixture-deepfake-01',
    name: 'Synthetic Portrait (GAN Artifacts)',
    tagline: 'Simulated neural generator boundary anomalies & frequency mismatch',
    category: 'deepfake',
    description:
      'A synthetic facial portrait showing telltale diffusion frequency discrepancies, irregular iris reflections, and hair contour blending artifacts.',
    fileName: 'synthetic_executive_headshot_tampered.png',
    mimeType: 'image/png',
    fileSize: 1845200,
    width: 1024,
    height: 1024,
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sampleSvgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23111827"/><circle cx="200" cy="160" r="80" fill="%23374151" stroke="%2376b900" stroke-width="2" stroke-dasharray="4"/><path d="M100,340 C100,250 300,250 300,340 Z" fill="%231f2937"/><circle cx="175" cy="150" r="8" fill="%2376b900"/><circle cx="225" cy="150" r="8" fill="%2376b900"/><path d="M185,190 Q200,205 215,190" stroke="%239ca3af" stroke-width="3" fill="none"/><text x="200" y="380" font-family="sans-serif" font-size="12" fill="%2376b900" text-anchor="middle">SYNTHETIC TEST FIXTURE: DEEPFAKE SAMPLE</text></svg>',
  },
  {
    id: 'fixture-doc-02',
    name: 'Altered Audit Certificate (Copy-Move)',
    tagline: 'Simulated spliced text lines & Error Level Analysis (ELA) variance',
    category: 'manipulated_document',
    description:
      'A scanned financial verification document with spliced figures, mismatched quantization tables, and localized JPEG resaving compression boundaries.',
    fileName: 'audit_certification_spliced.jpg',
    mimeType: 'image/jpeg',
    fileSize: 948210,
    width: 1200,
    height: 1600,
    sha256Hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef',
    sampleSvgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%230f172a"/><rect x="40" y="40" width="320" height="420" fill="%231e293b" stroke="%23334155"/><rect x="70" y="80" width="160" height="15" fill="%2364748b"/><line x1="70" y1="130" x2="330" y2="130" stroke="%23475569" stroke-width="2"/><line x1="70" y1="160" x2="330" y2="160" stroke="%23475569" stroke-width="2"/><rect x="70" y="190" width="260" height="40" fill="%2376b900" fill-opacity="0.2" stroke="%2376b900" stroke-width="1.5"/><text x="80" y="215" font-family="monospace" font-size="13" fill="%2376b900">MODIFIED TRANSACTION SUM</text><text x="200" y="440" font-family="sans-serif" font-size="11" fill="%2394a3b8" text-anchor="middle">SYNTHETIC FIXTURE: SPLICED DOCUMENT</text></svg>',
  },
  {
    id: 'fixture-authentic-03',
    name: 'Authentic Baseline Photograph',
    tagline: 'Clean sensor noise, uniform Bayer pattern, verified EXIF header',
    category: 'authentic_baseline',
    description:
      'An unmanipulated digital camera image exhibiting homogeneous sensor noise distribution, consistent lighting vectors, and undisturbed compression headers.',
    fileName: 'original_press_photo_untampered.jpg',
    mimeType: 'image/jpeg',
    fileSize: 3120400,
    width: 2048,
    height: 1536,
    sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    sampleSvgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23090d16"/><circle cx="200" cy="150" r="60" fill="%2310b981" fill-opacity="0.1" stroke="%2310b981" stroke-width="2"/><polygon points="120,240 200,140 280,240" fill="%231e293b"/><text x="200" y="275" font-family="sans-serif" font-size="11" fill="%2310b981" text-anchor="middle">SYNTHETIC FIXTURE: AUTHENTIC BASELINE</text></svg>',
  },
];

export const INITIAL_DEMO_CASES: Case[] = [
  {
    id: 'case_demo_deepfake_01',
    title: 'Synthetic Executive Headshot Investigation',
    description:
      'Suspected AI-generated impersonation image circulated across corporate networking portals.',
    status: 'flagged',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    isSyntheticFixture: true,
    imageMetadata: {
      fileName: 'synthetic_executive_headshot_tampered.png',
      mimeType: 'image/png',
      fileSize: 1845200,
      width: 1024,
      height: 1024,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    forensicResult: {
      id: 'ana_demo_01',
      caseId: 'case_demo_deepfake_01',
      analyzedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      overallVerdict: 'manipulation_suspected',
      confidenceScore: 0.88,
      indicators: [
        {
          id: 'ind_01',
          name: 'Neural Generator Spectral Inconsistency',
          type: 'gan_artifact',
          severity: 'high',
          score: 0.91,
          description:
            'Checkerboard frequency domain patterns identified in high-frequency Fourier decomposition, characteristic of generative upsampling layers.',
        },
        {
          id: 'ind_02',
          name: 'Facial Boundary Blending Variance',
          type: 'face_boundary',
          severity: 'high',
          score: 0.85,
          description:
            'Edge transition discontinuity detected between ear lobule and background pixel clusters, indicative of synthetic composite blending.',
        },
        {
          id: 'ind_03',
          name: 'EXIF Metadata Stripping',
          type: 'metadata_consistency',
          severity: 'medium',
          score: 0.72,
          description:
            'Camera maker tags and color profile headers are absent or replaced with standard canvas export headers.',
        },
      ],
      explanation:
        'The submitted image exhibits structural artifacts consistent with synthetic face generation pipelines. Spectral decomposition revealed recurring convolutional checkerboard patterns, and boundary gradient analysis identified unnatural edge blurring around facial contours.',
      limitations: [
        'Demo analysis: Generated via deterministic mock forensic heuristics.',
        'Lossy social media compression may amplify false positive rates for boundary indicators.',
        'Final legal determination requires human forensic specialist corroboration.',
      ],
      modelInfo: {
        provider: 'CyberTrace Forensic Engine (Heuristic Simulation v1.0)',
        modelName: 'forensic-heuristic-v1',
        version: '1.0.0',
        isMock: true,
      },
    },
    traceResult: {
      id: 'trace_demo_01',
      caseId: 'case_demo_deepfake_01',
      queriedAt: new Date(Date.now() - 3600000 * 19).toISOString(),
      queryHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      totalCandidateMatches: 3,
      matches: [
        {
          id: 'match_01',
          url: 'https://impersonation-profile.example.org/profiles/exec-john-doe',
          domain: 'impersonation-profile.example.org',
          platformType: 'social_media',
          matchMethod: 'perceptual_hash',
          similarityScore: 0.97,
          firstSeenAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          sourceContext: 'Profile avatar on fraudulent consultancy registration page.',
          isTakedownEligible: true,
        },
        {
          id: 'match_02',
          url: 'https://cdn.anonymous-imageboard.net/img/2026/04/fake_board_77.jpg',
          domain: 'anonymous-imageboard.net',
          platformType: 'image_board',
          matchMethod: 'neural_embedding',
          similarityScore: 0.92,
          firstSeenAt: new Date(Date.now() - 3600000 * 36).toISOString(),
          sourceContext: 'Thread discussing generative synthetic impersonations.',
          isTakedownEligible: true,
        },
        {
          id: 'match_03',
          url: 'https://webcache.archive-mirror.com/snapshot/20261019/fake-profile',
          domain: 'archive-mirror.com',
          platformType: 'archive',
          matchMethod: 'exact_hash',
          similarityScore: 1.0,
          firstSeenAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          sourceContext: 'Cached crawl snapshot of fraudulent profile.',
          isTakedownEligible: false,
        },
      ],
      limitations: [
        'Demo discovery: Results populated from fixture candidate dataset.',
        'Does not query non-public private channels or darknet forums.',
      ],
      providerInfo: {
        provider: 'CyberTrace Mock Trace Provider',
        isMock: true,
      },
    },
    reports: [
      {
        id: 'rep_demo_01',
        caseId: 'case_demo_deepfake_01',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        title: 'Draft Impersonation Removal Package — Impersonation Profile Host',
        status: 'ready_for_review',
        priorityScore: 'high',
        summary:
          'Formal expedited takedown request regarding unauthorized synthetic likeness impersonation on corporate profile hosting provider.',
        evidenceSummary: [
          'SHA-256 cryptographic match with disputed asset',
          '88% synthetic manipulation confidence score',
          'Discovered 2 active unauthorized web distributions',
        ],
        legalBasis:
          'Violation of Terms of Service (Impersonation / Fraudulent Representation) and Right of Publicity.',
        notices: [
          {
            platform: 'impersonation-profile.example.org',
            targetUrl: 'https://impersonation-profile.example.org/profiles/exec-john-doe',
            noticeType: 'terms_of_service',
            recipientEmail: 'abuse@impersonation-profile.example.org',
            status: 'draft',
            verifiedOutcome: 'unverified',
          },
        ],
        takedownLetterDraft: `NOTICE OF UNAUTHORIZED SYNTHETIC IMPERSONATION & TAKEDOWN REQUEST\n\nTo the Abuse and Trust & Safety Team at impersonation-profile.example.org:\n\nWe represent the legitimate individual whose identity and likeness have been synthetically simulated without authorization on your platform at the following URL:\nTarget URL: https://impersonation-profile.example.org/profiles/exec-john-doe\n\nForensic analysis indicates this image is an AI-generated synthetic deepfake intended to impersonate our client (Case Reference: case_demo_deepfake_01).\n\nWe request immediate de-indexing and suspension of this fraudulent profile under your platform's Terms of Service prohibiting deceptive impersonation.\n\nRespectfully,\nCyberTrace Forensic Takedown Dispatcher`,
        verificationDisclaimer:
          'CyberTrace generated this draft report for human legal review. CyberTrace never claims that a hosting provider has removed content without explicit third-party verification.',
        generatedBy: {
          provider: 'CyberTrace Guardian Mock Engine',
          isMock: true,
        },
      },
    ],
  },
  {
    id: 'case_demo_pending_02',
    title: 'Candidate Financial Document Verification',
    description: 'Submitted invoice image with questionable line-item formatting.',
    status: 'analysis_pending',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    isSyntheticFixture: true,
    imageMetadata: {
      fileName: 'audit_certification_spliced.jpg',
      mimeType: 'image/jpeg',
      fileSize: 948210,
      width: 1200,
      height: 1600,
      sha256Hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef',
    },
    reports: [],
  },
];
