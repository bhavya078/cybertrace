export type MatchMethod =
  | 'perceptual_hash'
  | 'neural_embedding'
  | 'metadata_signature'
  | 'exact_hash';

export type PlatformType =
  | 'social_media'
  | 'image_board'
  | 'news_media'
  | 'archive'
  | 'forum'
  | 'other';

export interface TraceMatch {
  id: string;
  url: string;
  domain: string;
  platformType: PlatformType;
  matchMethod: MatchMethod;
  similarityScore: number; // 0.0 to 1.0 where actually computed
  firstSeenAt: string;
  sourceContext?: string;
  isTakedownEligible: boolean;
}

export interface TraceResult {
  id: string;
  caseId: string;
  queriedAt: string;
  queryHash: string;
  totalCandidateMatches: number;
  matches: TraceMatch[];
  limitations: string[];
  providerInfo: {
    provider: string;
    isMock: boolean;
  };
}
