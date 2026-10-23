export type ReportStatus =
  | 'draft'
  | 'ready_for_review'
  | 'submitted'
  | 'action_taken'
  | 'rejected';

export type PriorityScore = 'critical' | 'high' | 'medium' | 'low';

export type NoticeType =
  | 'dmca_takedown'
  | 'defamation_notice'
  | 'privacy_violation'
  | 'terms_of_service';

export interface PlatformNotice {
  platform: string;
  targetUrl: string;
  noticeType: NoticeType;
  recipientEmail?: string;
  status: 'draft' | 'pending_dispatch' | 'sent' | 'acknowledged';
  dispatchedAt?: string;
  verifiedOutcome?: 'content_removed' | 'geoblocked' | 'counter_notice' | 'no_response' | 'unverified';
}

export interface RemovalReport {
  id: string;
  caseId: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  status: ReportStatus;
  priorityScore: PriorityScore;
  summary: string;
  evidenceSummary: string[];
  legalBasis: string;
  notices: PlatformNotice[];
  takedownLetterDraft: string;
  verificationDisclaimer: string;
  generatedBy: {
    provider: string;
    isMock: boolean;
  };
}
