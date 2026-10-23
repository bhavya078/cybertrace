import { describe, it, expect } from 'vitest';
import { validatePublicUrl } from '../src/server/security/ssrf';
import { verifyImageBufferSignature } from '../src/server/security/file-signature';
import { verifyCaseOwnership } from '../src/server/security/auth';
import { checkRateLimit } from '../src/server/security/rate-limiter';
import { Case } from '../src/types';
import { NextRequest } from 'next/server';

describe('Security & Privacy Audit Controls', () => {
  describe('SSRF Protection (validatePublicUrl)', () => {
    it('blocks loopback and localhost addresses', () => {
      expect(validatePublicUrl('http://127.0.0.1/admin').isValid).toBe(false);
      expect(validatePublicUrl('http://localhost:3000/api').isValid).toBe(false);
      expect(validatePublicUrl('http://[::1]/secret').isValid).toBe(false);
    });

    it('blocks RFC 1918 private network IP ranges', () => {
      expect(validatePublicUrl('http://10.0.0.1/internal').isValid).toBe(false);
      expect(validatePublicUrl('http://172.16.0.1/metadata').isValid).toBe(false);
      expect(validatePublicUrl('http://192.168.1.1/router').isValid).toBe(false);
    });

    it('blocks Cloud Provider Metadata service (169.254.169.254)', () => {
      const res = validatePublicUrl('http://169.254.169.254/latest/meta-data/');
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/internal or private IP network address/);
    });

    it('blocks non-HTTP/S protocol schemes', () => {
      expect(validatePublicUrl('file:///etc/passwd').isValid).toBe(false);
      expect(validatePublicUrl('gopher://evil.com/').isValid).toBe(false);
      expect(validatePublicUrl('ftp://ftp.example.com').isValid).toBe(false);
    });

    it('blocks URLs with embedded credentials', () => {
      expect(validatePublicUrl('https://admin:secret@example.com/image.jpg').isValid).toBe(false);
    });

    it('blocks dangerous non-web ports like 22 (SSH) and 6379 (Redis)', () => {
      expect(validatePublicUrl('http://example.com:22/').isValid).toBe(false);
      expect(validatePublicUrl('http://example.com:6379/').isValid).toBe(false);
    });

    it('allows valid public HTTP and HTTPS target URLs', () => {
      expect(validatePublicUrl('https://example.com/unauthorized.jpg').isValid).toBe(true);
      expect(validatePublicUrl('https://images.unsplash.com/photo-123').isValid).toBe(true);
      expect(validatePublicUrl('http://public-forum.org/threads/456').isValid).toBe(true);
    });
  });

  describe('File Magic Byte Signature Validation (verifyImageBufferSignature)', () => {
    it('validates authentic JPEG header signatures (FF D8 FF)', () => {
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x00, 0x00, 0x00, 0x00]);
      const res = verifyImageBufferSignature(jpegBuffer, 'image/jpeg');
      expect(res.isValid).toBe(true);
      expect(res.detectedMimeType).toBe('image/jpeg');
    });

    it('validates authentic PNG header signatures (89 50 4E 47)', () => {
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x00]);
      const res = verifyImageBufferSignature(pngBuffer, 'image/png');
      expect(res.isValid).toBe(true);
      expect(res.detectedMimeType).toBe('image/png');
    });

    it('validates authentic WebP header signatures (RIFF....WEBP)', () => {
      const webpBuffer = Buffer.from([
        0x52, 0x49, 0x46, 0x46, // RIFF
        0x00, 0x00, 0x00, 0x00, // length
        0x57, 0x45, 0x42, 0x50, // WEBP
      ]);
      const res = verifyImageBufferSignature(webpBuffer, 'image/webp');
      expect(res.isValid).toBe(true);
      expect(res.detectedMimeType).toBe('image/webp');
    });

    it('rejects malicious executables disguised as image/jpeg', () => {
      // MZ header for DOS/PE executable
      const exeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00]);
      const res = verifyImageBufferSignature(exeBuffer, 'image/jpeg');
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/MIME mismatch|Unrecognized or unsupported/);
    });

    it('rejects empty or truncated buffers', () => {
      const emptyBuffer = Buffer.from([]);
      const res = verifyImageBufferSignature(emptyBuffer, 'image/png');
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('too short');
    });
  });

  describe('IDOR & Session Isolation (verifyCaseOwnership)', () => {
    const testCase: Case = {
      id: 'case_sec_100',
      title: 'Confidential Client Case',
      status: 'analysis_pending',
      ownerId: 'investigator_alpha',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageMetadata: {
        fileName: 'target.png',
        mimeType: 'image/png',
        fileSize: 1024,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
      reports: [],
    };

    it('allows access when session matches the case ownerId', () => {
      const auth = verifyCaseOwnership(testCase, {
        investigatorId: 'investigator_alpha',
        role: 'investigator',
        isLocalDevelopment: true,
      });
      expect(auth.authorized).toBe(true);
    });

    it('blocks access when an unassociated session attempts access (IDOR defense)', () => {
      const auth = verifyCaseOwnership(testCase, {
        investigatorId: 'investigator_adversary',
        role: 'investigator',
        isLocalDevelopment: true,
      });
      expect(auth.authorized).toBe(false);
      expect(auth.reason).toContain('Access denied');
    });

    it('allows access if case has no ownerId (legacy unassigned case)', () => {
      const legacyCase: Case = { ...testCase, ownerId: undefined };
      const auth = verifyCaseOwnership(legacyCase, {
        investigatorId: 'investigator_alpha',
        role: 'investigator',
        isLocalDevelopment: true,
      });
      expect(auth.authorized).toBe(true);
    });
  });

  describe('Sliding Window Rate Limiter (checkRateLimit)', () => {
    it('allows requests within capacity and blocks bursts exceeding max tokens', () => {
      const mockReq = new NextRequest('http://localhost:3000/api/cases', {
        headers: { 'x-real-ip': '203.0.113.195' },
      });

      const options = { maxRequests: 3, windowMs: 10000 };
      expect(checkRateLimit(mockReq, options).allowed).toBe(true);
      expect(checkRateLimit(mockReq, options).allowed).toBe(true);
      expect(checkRateLimit(mockReq, options).allowed).toBe(true);

      // 4th request exceeds maxRequests = 3
      const blocked = checkRateLimit(mockReq, options);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
    });
  });
});
