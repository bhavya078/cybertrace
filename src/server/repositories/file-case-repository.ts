import fs from 'fs';
import path from 'path';
import { Case, CreateCaseInput } from '@/types';
import { ICaseRepository, FindCasesOptions } from './case-repository.interface';
import { INITIAL_DEMO_CASES } from '@/lib/fixtures';
import { generateId } from '@/lib/utils';

export class FileCaseRepository implements ICaseRepository {
  private filePath: string;
  private isInitialized: boolean = false;

  constructor(customPath?: string) {
    const dataDir = path.resolve(process.cwd(), '.data');
    this.filePath = customPath || path.join(dataDir, 'cases.json');
  }

  private async ensureInitialized(): Promise<void> {
    if (this.isInitialized) return;

    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      // Seed with demo cases for initial out-of-the-box exploration
      const initial = INITIAL_DEMO_CASES;
      await fs.promises.writeFile(this.filePath, JSON.stringify(initial, null, 2), 'utf-8');
    }

    this.isInitialized = true;
  }

  private async readAllCases(): Promise<Case[]> {
    await this.ensureInitialized();
    try {
      const content = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(content) as Case[];
    } catch {
      return INITIAL_DEMO_CASES;
    }
  }

  private async writeAllCases(cases: Case[]): Promise<void> {
    await this.ensureInitialized();
    const tempPath = `${this.filePath}.tmp.${Date.now()}`;
    await fs.promises.writeFile(tempPath, JSON.stringify(cases, null, 2), 'utf-8');
    await fs.promises.rename(tempPath, this.filePath);
  }

  async findAll(options?: FindCasesOptions): Promise<Case[]> {
    let list = await this.readAllCases();

    if (options?.status) {
      list = list.filter((c) => c.status === options.status);
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.imageMetadata.fileName.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (options?.offset !== undefined) {
      list = list.slice(options.offset);
    }
    if (options?.limit !== undefined) {
      list = list.slice(0, options.limit);
    }

    return list;
  }

  async findById(id: string): Promise<Case | null> {
    const list = await this.readAllCases();
    return list.find((c) => c.id === id) || null;
  }

  async create(input: CreateCaseInput): Promise<Case> {
    const list = await this.readAllCases();
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

    list.unshift(newCase);
    await this.writeAllCases(list);
    return newCase;
  }

  async update(id: string, partial: Partial<Case>): Promise<Case | null> {
    const list = await this.readAllCases();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updated: Case = {
      ...list[index],
      ...partial,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    await this.writeAllCases(list);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const list = await this.readAllCases();
    const filtered = list.filter((c) => c.id !== id);
    if (filtered.length === list.length) return false;
    await this.writeAllCases(filtered);
    return true;
  }

  async resetToFixtures(): Promise<void> {
    await this.writeAllCases(INITIAL_DEMO_CASES);
  }
}
