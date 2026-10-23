import { Case, ForensicAnalysisResult } from '@/types';

export interface ForensicScanOptions {
  deepScan?: boolean;
  simulatedScenario?: 'deepfake' | 'manipulated_doc' | 'authentic' | 'inconclusive';
}

export interface IForensicService {
  /**
   * Analyzes an image case record for potential tampering or synthetic generation indicators.
   */
  analyze(caseRecord: Case, options?: ForensicScanOptions): Promise<ForensicAnalysisResult>;
}
