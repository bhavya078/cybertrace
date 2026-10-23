import { ImageMetadata } from '@/types';
import { IImageStorageService } from './storage-service.interface';

export class EphemeralStorageService implements IImageStorageService {
  isPersistenceEnabled(): boolean {
    return false; // Zero permanent disk persistence by default
  }

  async processMetadata(fileMetadata: ImageMetadata): Promise<ImageMetadata> {
    // Preserve cryptographic hash, dimensions, and mimeType.
    // Strip any raw sensitive binary content before storing case records.
    return {
      fileName: fileMetadata.fileName,
      mimeType: fileMetadata.mimeType,
      fileSize: fileMetadata.fileSize,
      width: fileMetadata.width,
      height: fileMetadata.height,
      sha256Hash: fileMetadata.sha256Hash,
      previewDataUrl: fileMetadata.previewDataUrl,
    };
  }
}
