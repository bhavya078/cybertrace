import { Case, RemovalReport, PlatformNotice } from '@/types';
import { IGuardianService, GenerateReportOptions } from './guardian-service.interface';
import { generateId } from '@/lib/utils';

export class MockGuardianService implements IGuardianService {
  async generateReport(caseRecord: Case, options?: GenerateReportOptions): Promise<RemovalReport> {
    const now = new Date().toISOString();
    const repId = generateId('rep');
    const noticeType = options?.noticeType || 'dmca_takedown';

    // Prioritize evidence from forensic result and trace matches
    const evidenceSummary: string[] = [
      `Cryptographic Asset Fingerprint: SHA-256 ${caseRecord.imageMetadata.sha256Hash}`,
      `File Dimensions: ${caseRecord.imageMetadata.width || 0}x${caseRecord.imageMetadata.height || 0} (${caseRecord.imageMetadata.mimeType})`,
    ];

    if (caseRecord.forensicResult) {
      evidenceSummary.push(
        `Forensic Verdict: ${caseRecord.forensicResult.overallVerdict.toUpperCase()} (Confidence: ${(caseRecord.forensicResult.confidenceScore * 100).toFixed(0)}%)`,
        `Key Indicator: ${caseRecord.forensicResult.indicators[0]?.name || 'Standard structural check'} (${caseRecord.forensicResult.indicators[0]?.description || 'Verified'})`
      );
    } else {
      evidenceSummary.push('Forensic Status: Baseline metadata logged, detailed forensic scan pending.');
    }

    // Determine target URLs from options or trace matches
    let targetUrls = options?.targetUrls || [];
    if (targetUrls.length === 0 && caseRecord.traceResult?.matches) {
      targetUrls = caseRecord.traceResult.matches
        .filter((m) => m.isTakedownEligible)
        .map((m) => m.url);
    }
    if (targetUrls.length === 0) {
      targetUrls = ['https://example-host.net/unauthorized-media-link'];
    }

    const notices: PlatformNotice[] = targetUrls.map((url) => {
      let hostname = 'unknown-host';
      try {
        hostname = new URL(url).hostname;
      } catch {
        hostname = url;
      }

      return {
        platform: hostname,
        targetUrl: url,
        noticeType,
        recipientEmail: options?.recipientEmail || `abuse@${hostname}`,
        status: 'draft',
        verifiedOutcome: 'unverified', // NEVER claim content removed without third-party confirmation
      };
    });

    const legalBasis =
      options?.legalBasis ||
      (noticeType === 'dmca_takedown'
        ? 'Digital Millennium Copyright Act (17 U.S.C. § 512) and international copyright conventions.'
        : noticeType === 'privacy_violation'
        ? 'Non-consensual visual likeness distribution and privacy violation under applicable statutory regulations.'
        : 'Platform Terms of Service violation regarding deceptive or fraudulent impersonation.');

    const takedownLetterDraft = `FORMAL NOTICE OF INFRINGEMENT & TAKEDOWN REQUEST\n\nDate: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\nReference Case ID: ${caseRecord.id}\nNotice Classification: ${noticeType.toUpperCase()}\n\nTo the Designated Agent / Abuse Department:\n\nThis communication constitutes formal notice regarding unauthorized media located on your network at the following address(es):\n${targetUrls.map((u) => `  * ${u}`).join('\n')}\n\nEVIDENCE & FORENSIC ATTESTATION:\n${evidenceSummary.map((e) => `  - ${e}`).join('\n')}\n\nLEGAL BASIS:\n${legalBasis}\n\nGOOD FAITH STATEMENT:\nWe have a good-faith belief that the use of the material in the manner complained of is not authorized by the copyright or rights owner, its agent, or the law.\n\nREQUESTED ACTION:\nPlease act expeditiously to remove or disable access to the infringing material identified above.\n\nSigned,\nAuthorized Representative / CyberTrace Guardian Service`;

    return {
      id: repId,
      caseId: caseRecord.id,
      createdAt: now,
      updatedAt: now,
      title: options?.title || `Removal Report Draft — ${caseRecord.title}`,
      status: 'draft',
      priorityScore: caseRecord.forensicResult?.overallVerdict === 'manipulation_suspected' ? 'high' : 'medium',
      summary: `Automated takedown compilation targeting ${targetUrls.length} online publication point(s) based on case evidence.`,
      evidenceSummary,
      legalBasis,
      notices,
      takedownLetterDraft,
      verificationDisclaimer:
        'CyberTrace generated this draft report for human legal review. CyberTrace never claims that a hosting provider has removed content without explicit third-party verification.',
      generatedBy: {
        provider: 'CyberTrace Guardian Mock Engine (NVIDIA Nemotron LLM Ready)',
        isMock: true,
      },
    };
  }
}
