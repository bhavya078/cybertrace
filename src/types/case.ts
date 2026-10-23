import { ForensicAnalysisResult } from './forensics';
import { TraceResult } from './trace';
import { RemovalReport } from './guardian';

export type CaseStatus =
  | 'submitted'
  | 'analysis_pending'
  | 'analyzing'
  | 'completed'
  | 'flagged'
  | 'archived';

export interface ImageMetadata {
  fileName: string;
  mimeType: string;
  fileSize: number; // in bytes
  width?: number;
  height?: number;
  sha256Hash: string;
  previewDataUrl?: string; // transient preview during browser session
}

export interface Case {
  id: string;
  title: string;
  description?: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  imageMetadata: ImageMetadata;
  forensicResult?: ForensicAnalysisResult;
  traceResult?: TraceResult;
  reports: RemovalReport[];
  isSyntheticFixture?: boolean;
}

export interface CreateCaseInput {
  title: string;
  description?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  sha256Hash: string;
  previewDataUrl?: string;
  isSyntheticFixture?: boolean;
}
