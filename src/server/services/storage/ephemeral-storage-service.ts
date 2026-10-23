import { ImageMetadata } from '@/types';
import { IImageStorageService } from './storage-service.interface';

export class EphemeralStorageService implements IImageStorageService {
  isPersistenceEnabled(): boolean {
    return false; // Zero permanent disk persistence by default
  }

  async processMetadata(fileMetadata: ImageMetadata): Promise<ImageMetadata> {
    // Explicit Privacy Boundary:
    // Preserve ONLY cryptographic fingerprints, dimensions, and sanitized filenames.
    // Explicitly reject/strip any raw image binaries or Base64 data URLs.
    return {
      fileName: fileMetadata.fileName.replace(/[^a-zA-Z0-9._-]/g, '_'),
      mimeType: fileMetadata.mimeType,
      fileSize: fileMetadata.fileSize,
      width: fileMetadata.width,
      height: fileMetadata.height,
      sha256Hash: fileMetadata.sha256Hash.toLowerCase(),
    };
  }
}
