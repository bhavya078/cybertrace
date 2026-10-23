import { Case, CreateCaseInput } from '@/types';
import { ICaseRepository, FindCasesOptions } from './case-repository.interface';
import { INITIAL_DEMO_CASES } from '@/lib/fixtures';
import { generateId } from '@/lib/utils';

export class MemoryCaseRepository implements ICaseRepository {
  private cases: Map<string, Case> = new Map();

  constructor(seedWithFixtures: boolean = true) {
    if (seedWithFixtures) {
      for (const item of INITIAL_DEMO_CASES) {
        this.cases.set(item.id, JSON.parse(JSON.stringify(item)));
      }
    }
  }

  async findAll(options?: FindCasesOptions): Promise<Case[]> {
    let result = Array.from(this.cases.values());

    if (options?.status) {
      result = result.filter((c) => c.status === options.status);
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.imageMetadata.fileName.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (options?.offset !== undefined) {
      result = result.slice(options.offset);
    }
    if (options?.limit !== undefined) {
      result = result.slice(0, options.limit);
    }

    return JSON.parse(JSON.stringify(result));
  }

  async findById(id: string): Promise<Case | null> {
    const found = this.cases.get(id);
    if (!found) return null;
    return JSON.parse(JSON.stringify(found));
  }

  async create(input: CreateCaseInput): Promise<Case> {
    const now = new Date().toISOString();
    const id = generateId('case');

    const newCase: Case = {
      id,
      title: input.title,
      description: input.description,
      status: 'analysis_pending',
      createdAt: now,
      updatedAt: now,
      isSyntheticFixture: input.isSyntheticFixture ?? false,
      imageMetadata: {
        fileName: input.fileName,
        mimeType: input.mimeType,
        fileSize: input.fileSize,
        width: input.width,
        height: input.height,
        sha256Hash: input.sha256Hash,
        previewDataUrl: input.previewDataUrl,
      },
      reports: [],
    };

    this.cases.set(id, newCase);
    return JSON.parse(JSON.stringify(newCase));
  }

  async update(id: string, partial: Partial<Case>): Promise<Case | null> {
    const existing = this.cases.get(id);
    if (!existing) return null;

    const updated: Case = {
      ...existing,
      ...partial,
      updatedAt: new Date().toISOString(),
    };

    this.cases.set(id, updated);
    return JSON.parse(JSON.stringify(updated));
  }

  async delete(id: string): Promise<boolean> {
    return this.cases.delete(id);
  }

  async resetToFixtures(): Promise<void> {
    this.cases.clear();
    for (const item of INITIAL_DEMO_CASES) {
      this.cases.set(item.id, JSON.parse(JSON.stringify(item)));
    }
  }
}
