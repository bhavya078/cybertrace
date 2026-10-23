export type ForensicSeverity = 'low' | 'medium' | 'high' | 'inconclusive';

export type ForensicIndicatorType =
  | 'error_level_analysis'
  | 'metadata_consistency'
  | 'gan_artifact'
  | 'face_boundary'
  | 'clone_detection'
  | 'compression_grid';

export interface ForensicIndicator {
  id: string;
  name: string;
  type: ForensicIndicatorType;
  severity: ForensicSeverity;
  score: number; // 0.0 to 1.0
  description: string;
  details?: Record<string, unknown>;
}

export type ForensicVerdict =
  | 'authentic_candidate'
  | 'manipulation_suspected'
  | 'inconclusive'
  | 'analysis_pending';

export interface ForensicAnalysisResult {
  id: string;
  caseId: string;
  analyzedAt: string;
  overallVerdict: ForensicVerdict;
  confidenceScore: number; // 0.0 to 1.0
  indicators: ForensicIndicator[];
  explanation: string;
  limitations: string[];
  modelInfo: {
    provider: string;
    modelName: string;
    version: string;
    isMock: boolean;
  };
}
