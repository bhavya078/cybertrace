import { Case, TraceMatch, TraceResult } from '@/types';
import { ITraceService } from './trace-service.interface';
import { generateId } from '@/lib/utils';

export class MockTraceService implements ITraceService {
  async discover(caseRecord: Case): Promise<TraceResult> {
    const hashPrefix = caseRecord.imageMetadata.sha256Hash.substring(0, 10);
    const now = Date.now();

    const matches: TraceMatch[] = [
      {
        id: generateId('match'),
        url: `https://public-forum.network/threads/post-${hashPrefix}-982`,
        domain: 'public-forum.network',
        platformType: 'forum',
        matchMethod: 'perceptual_hash',
        similarityScore: 0.96,
        firstSeenAt: new Date(now - 86400000 * 3).toISOString(),
        sourceContext: 'Embedded in discussion thread under suspicious media category.',
        isTakedownEligible: true,
      },
      {
        id: generateId('match'),
        url: `https://social-distribution.org/media/status/${hashPrefix}44`,
        domain: 'social-distribution.org',
        platformType: 'social_media',
        matchMethod: 'neural_embedding',
        similarityScore: 0.89,
        firstSeenAt: new Date(now - 86400000 * 2).toISOString(),
        sourceContext: 'Circulated via unverified syndicated account.',
        isTakedownEligible: true,
      },
      {
        id: generateId('match'),
        url: `https://archive-mirror.org/web/${new Date(now).toISOString().slice(0, 10)}/${hashPrefix}`,
        domain: 'archive-mirror.org',
        platformType: 'archive',
        matchMethod: 'exact_hash',
        similarityScore: 1.0,
        firstSeenAt: new Date(now - 86400000 * 1).toISOString(),
        sourceContext: 'Automated web preservation snapshot.',
        isTakedownEligible: false,
      },
    ];

    return {
      id: generateId('match'),
      caseId: caseRecord.id,
      queriedAt: new Date().toISOString(),
      queryHash: caseRecord.imageMetadata.sha256Hash,
      totalCandidateMatches: matches.length,
      matches,
      limitations: [
        'Demo discovery: Discovered candidate URLs are deterministic synthetic test fixtures.',
        'Production integration requires connecting authorized reverse search API providers or custom embedding indices.',
        'Scores reflect computed visual distance metrics and do not prove original source ownership.',
      ],
      providerInfo: {
        provider: 'CyberTrace Reverse Match Provider (Simulation v1.0)',
        isMock: true,
      },
    };
  }
}
