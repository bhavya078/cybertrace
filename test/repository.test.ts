import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryCaseRepository } from '../src/server/repositories/memory-case-repository';

describe('Case Repository (MemoryCaseRepository)', () => {
  let repo: MemoryCaseRepository;

  beforeEach(() => {
    repo = new MemoryCaseRepository(false); // Clean instance
  });

  it('creates and retrieves a case by ID', async () => {
    const created = await repo.create({
      title: 'Suspicious Avatar Leak',
      description: 'Profile photo manipulated on social account',
      fileName: 'leak.jpg',
      mimeType: 'image/jpeg',
      fileSize: 409600,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      width: 600,
      height: 600,
    });

    expect(created.id).toMatch(/^case_/);
    expect(created.status).toBe('analysis_pending');

    const fetched = await repo.findById(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe('Suspicious Avatar Leak');
  });

  it('updates case status and preserves fields', async () => {
    const created = await repo.create({
      title: 'Update Test Case',
      fileName: 'test.png',
      mimeType: 'image/png',
      fileSize: 1000,
      sha256Hash: 'a'.repeat(64),
    });

    const updated = await repo.update(created.id, {
      status: 'flagged',
    });

    expect(updated?.status).toBe('flagged');
    expect(updated?.title).toBe('Update Test Case');
  });

  it('filters cases by search term', async () => {
    await repo.create({
      title: 'Financial Document Forgery',
      fileName: 'statement.png',
      mimeType: 'image/png',
      fileSize: 2000,
      sha256Hash: 'b'.repeat(64),
    });

    await repo.create({
      title: 'Celebrity Deepfake Video Still',
      fileName: 'still.jpg',
      mimeType: 'image/jpeg',
      fileSize: 3000,
      sha256Hash: 'c'.repeat(64),
    });

    const results = await repo.findAll({ search: 'Financial' });
    expect(results).toHaveLength(1);
    expect(results[0].title).toContain('Financial');
  });
});
