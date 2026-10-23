import { Case, CaseStatus, CreateCaseInput } from '@/types';

export interface FindCasesOptions {
  status?: CaseStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ICaseRepository {
  findAll(options?: FindCasesOptions): Promise<Case[]>;
  findById(id: string): Promise<Case | null>;
  create(input: CreateCaseInput): Promise<Case>;
  update(id: string, partial: Partial<Case>): Promise<Case | null>;
  delete(id: string): Promise<boolean>;
  resetToFixtures(): Promise<void>;
}
