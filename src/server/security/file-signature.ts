/**
 * File Content Inspection & Magic Byte Verification
 * Defends against MIME type spoofing and executable/script upload attacks.
 */

export type VerifiedImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/tiff';

export interface FileSignatureResult {
  isValid: boolean;
  detectedMimeType?: VerifiedImageFormat;
  error?: string;
}

/**
 * Validates a binary buffer or Uint8Array against genuine image magic signatures.
 */
export function verifyImageBufferSignature(
  buffer: Uint8Array | Buffer,
  claimedMimeType?: string
): FileSignatureResult {
  if (!buffer || buffer.length < 12) {
    return {
      isValid: false,
      error: 'File content is empty or too short to contain a valid image header.',
    };
  }

  // Check JPEG (FF D8 FF)
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    if (claimedMimeType && claimedMimeType !== 'image/jpeg') {
      return {
        isValid: false,
        error: `MIME mismatch: Claimed '${claimedMimeType}' but file header is JPEG.`,
      };
    }
    return { isValid: true, detectedMimeType: 'image/jpeg' };
  }

  // Check PNG (89 50 4E 47 0D 0A 1A 0A)
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    if (claimedMimeType && claimedMimeType !== 'image/png') {
      return {
        isValid: false,
        error: `MIME mismatch: Claimed '${claimedMimeType}' but file header is PNG.`,
      };
    }
    return { isValid: true, detectedMimeType: 'image/png' };
  }

  // Check WebP (RIFF .... WEBP) -> buffer[0..3] = 0x52, 0x49, 0x46, 0x46, buffer[8..11] = 0x57, 0x45, 0x42, 0x50
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    if (claimedMimeType && claimedMimeType !== 'image/webp') {
      return {
        isValid: false,
        error: `MIME mismatch: Claimed '${claimedMimeType}' but file header is WebP.`,
      };
    }
    return { isValid: true, detectedMimeType: 'image/webp' };
  }

  // Check TIFF (49 49 2A 00 or 4D 4D 00 2A)
  const isTiffLe = buffer[0] === 0x49 && buffer[1] === 0x49 && buffer[2] === 0x2a && buffer[3] === 0x00;
  const isTiffBe = buffer[0] === 0x4d && buffer[1] === 0x4d && buffer[2] === 0x00 && buffer[3] === 0x2a;
  if (isTiffLe || isTiffBe) {
    if (claimedMimeType && claimedMimeType !== 'image/tiff') {
      return {
        isValid: false,
        error: `MIME mismatch: Claimed '${claimedMimeType}' but file header is TIFF.`,
      };
    }
    return { isValid: true, detectedMimeType: 'image/tiff' };
  }

  return {
    isValid: false,
    error: 'Unrecognized or unsupported image binary signature. Executables, scripts, and non-image files are rejected.',
  };
}
