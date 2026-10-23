import { Case, TraceResult } from '@/types';

export interface ITraceService {
  /**
   * Discovers online candidate matches or fixture distributions for the investigated asset.
   */
  discover(caseRecord: Case): Promise<TraceResult>;
}
