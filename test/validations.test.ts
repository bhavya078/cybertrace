import { describe, it, expect } from 'vitest';
import { createCaseSchema, createReportSchema, imageMetadataSchema } from '../src/lib/validations';
import { MAX_FILE_SIZE_BYTES } from '../src/lib/constants';

describe('Validation Schemas', () => {
  const validHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  describe('imageMetadataSchema', () => {
    it('accepts valid JPEG, PNG, and WebP metadata', () => {
      const validJpeg = {
        fileName: 'evidence_01.jpg',
        mimeType: 'image/jpeg',
        fileSize: 1024 * 500, // 500 KB
        sha256Hash: validHash,
      };
      expect(() => imageMetadataSchema.parse(validJpeg)).not.toThrow();

      const validPng = {
        fileName: 'screenshot.png',
        mimeType: 'image/png',
        fileSize: 1024 * 1024 * 2, // 2MB
        sha256Hash: validHash,
      };
      expect(() => imageMetadataSchema.parse(validPng)).not.toThrow();
    });

    it('rejects unsupported file formats like executable or pdf', () => {
      const invalidPdf = {
        fileName: 'malicious.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024,
        sha256Hash: validHash,
      };
      expect(() => imageMetadataSchema.parse(invalidPdf)).toThrow();
    });

    it('rejects files exceeding the 10MB threshold', () => {
      const oversize = {
        fileName: 'huge.jpg',
        mimeType: 'image/jpeg',
        fileSize: MAX_FILE_SIZE_BYTES + 1,
        sha256Hash: validHash,
      };
      expect(() => imageMetadataSchema.parse(oversize)).toThrow(/Maximum allowed image size is 10MB/);
    });

    it('rejects malformed SHA-256 hashes', () => {
      const badHash = {
        fileName: 'photo.jpg',
        mimeType: 'image/jpeg',
        fileSize: 2048,
        sha256Hash: 'not-a-valid-64-character-hex-hash',
      };
      expect(() => imageMetadataSchema.parse(badHash)).toThrow(/valid 64-character SHA-256/);
    });
  });

  describe('createCaseSchema', () => {
    it('successfully validates a complete case input payload', () => {
      const payload = {
        title: 'Suspected Deepfake Campaign',
        description: 'Circulated on public social forums',
        fileName: 'suspect.png',
        mimeType: 'image/png',
        fileSize: 500000,
        sha256Hash: validHash,
        width: 800,
        height: 600,
      };
      const result = createCaseSchema.parse(payload);
      expect(result.title).toBe('Suspected Deepfake Campaign');
      expect(result.fileSize).toBe(500000);
    });

    it('rejects case titles shorter than 3 characters', () => {
      const payload = {
        title: 'ab',
        fileName: 'test.jpg',
        mimeType: 'image/jpeg',
        fileSize: 1000,
        sha256Hash: validHash,
      };
      expect(() => createCaseSchema.parse(payload)).toThrow(/at least 3 characters/);
    });
  });

  describe('createReportSchema', () => {
    it('accepts valid takedown options with URLs', () => {
      const payload = {
        title: 'Expedited DMCA Removal Notice',
        noticeType: 'dmca_takedown' as const,
        targetUrls: ['https://example.com/unauthorized-media.jpg'],
        recipientEmail: 'abuse@example.com',
      };
      const result = createReportSchema.parse(payload);
      expect(result.noticeType).toBe('dmca_takedown');
      expect(result.targetUrls).toHaveLength(1);
    });

    it('rejects invalid or internal target URLs', () => {
      const payload = {
        targetUrls: ['not-a-url'],
      };
      expect(() => createReportSchema.parse(payload)).toThrow(/valid public HTTP or HTTPS URL/);

      const internalPayload = {
        targetUrls: ['http://127.0.0.1/admin'],
      };
      expect(() => createReportSchema.parse(internalPayload)).toThrow(/valid public HTTP or HTTPS URL/);
    });
  });
});
