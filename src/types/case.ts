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
  // Note: Raw image binaries or Base64 data URLs are never persisted on the server
  // to ensure strict victim privacy.
}

export interface Case {
  id: string;
  ownerId?: string; // Authenticated investigator session ID
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
  ownerId?: string;
  isSyntheticFixture?: boolean;
}
