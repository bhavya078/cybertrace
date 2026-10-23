import { ICaseRepository } from './case-repository.interface';
import { FileCaseRepository } from './file-case-repository';
import { MemoryCaseRepository } from './memory-case-repository';

export * from './case-repository.interface';
export * from './file-case-repository';
export * from './memory-case-repository';

// Global singleton to persist state in Next.js development hot-reloads
const globalForRepo = global as unknown as {
  caseRepositoryInstance?: ICaseRepository;
};

export function getCaseRepository(): ICaseRepository {
  if (globalForRepo.caseRepositoryInstance) {
    return globalForRepo.caseRepositoryInstance;
  }

  const adapter = process.env.CYBERTRACE_STORAGE_ADAPTER || 'file';
  let repo: ICaseRepository;

  if (adapter === 'memory' || process.env.NODE_ENV === 'test') {
    repo = new MemoryCaseRepository(true);
  } else {
    repo = new FileCaseRepository();
  }

  globalForRepo.caseRepositoryInstance = repo;
  return repo;
}
