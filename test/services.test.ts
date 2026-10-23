import { describe, it, expect } from 'vitest';
import { MockForensicService } from '../src/server/services/forensics/mock-forensic-service';
import { MockTraceService } from '../src/server/services/trace/mock-trace-service';
import { MockGuardianService } from '../src/server/services/guardian/mock-guardian-service';
import { Case } from '../src/types';

describe('AI Core Service Mock Adapters', () => {
  const dummyCase: Case = {
    id: 'case_test_999',
    title: 'Test Synthetic Verification Case',
    status: 'analysis_pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageMetadata: {
      fileName: 'synthetic_headshot.png',
      mimeType: 'image/png',
      fileSize: 1048576,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      width: 1024,
      height: 1024,
    },
    reports: [],
  };

  describe('ForensicService (MockForensicService)', () => {
    const service = new MockForensicService();

    it('returns structured indicators with limitations and human-readable explanation', async () => {
      const result = await service.analyze(dummyCase);

      expect(result.caseId).toBe(dummyCase.id);
      expect(result.indicators.length).toBeGreaterThan(0);
      expect(result.confidenceScore).toBeGreaterThan(0);
      expect(result.explanation).toBeTruthy();
      expect(result.limitations.length).toBeGreaterThan(0);
      expect(result.modelInfo.isMock).toBe(true);
      expect(result.modelInfo.provider).toContain('Mock');
    });

    it('returns authentic verdict when analyzing an authentic sample', async () => {
      const authenticCase: Case = {
        ...dummyCase,
        imageMetadata: {
          ...dummyCase.imageMetadata,
          fileName: 'original_press_photo_authentic.jpg',
        },
      };

      const result = await service.analyze(authenticCase, { simulatedScenario: 'authentic' });
      expect(result.overallVerdict).toBe('authentic_candidate');
      expect(result.confidenceScore).toBeGreaterThan(0.85);
    });
  });

  describe('TraceService (MockTraceService)', () => {
    const service = new MockTraceService();

    it('discovers candidate matches with similarity scores, methods, and mock attribution', async () => {
      const result = await service.discover(dummyCase);

      expect(result.caseId).toBe(dummyCase.id);
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.providerInfo.isMock).toBe(true);

      for (const match of result.matches) {
        expect(match.url).toMatch(/^https?:\/\//);
        expect(match.similarityScore).toBeGreaterThanOrEqual(0);
        expect(match.similarityScore).toBeLessThanOrEqual(1);
        expect(['perceptual_hash', 'neural_embedding', 'exact_hash', 'metadata_signature']).toContain(
          match.matchMethod
        );
      }
    });
  });

  describe('GuardianService (MockGuardianService)', () => {
    const service = new MockGuardianService();

    it('prioritizes evidence and never claims platform removed content without verification', async () => {
      const report = await service.generateReport(dummyCase, {
        targetUrls: ['https://unauthorized-leak.org/media/item1'],
      });

      expect(report.caseId).toBe(dummyCase.id);
      expect(report.status).toBe('draft');
      expect(report.evidenceSummary.length).toBeGreaterThan(0);
      expect(report.takedownLetterDraft).toContain('FORMAL NOTICE');
      expect(report.verificationDisclaimer).toContain('never claims that a hosting provider has removed content');

      // Verify unverified status in all generated notices
      for (const notice of report.notices) {
        expect(notice.status).toBe('draft');
        expect(notice.verifiedOutcome).toBe('unverified');
      }
    });
  });
});
