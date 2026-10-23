import { Case, RemovalReport, NoticeType } from '@/types';

export interface GenerateReportOptions {
  title?: string;
  targetUrls?: string[];
  noticeType?: NoticeType;
  legalBasis?: string;
  recipientEmail?: string;
  notes?: string;
}

export interface IGuardianService {
  /**
   * Generates a structured removal and takedown report package based on evidence.
   */
  generateReport(caseRecord: Case, options?: GenerateReportOptions): Promise<RemovalReport>;
}
