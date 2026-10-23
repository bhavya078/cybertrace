import { ImageMetadata } from '@/types';

export interface IImageStorageService {
  /**
   * Determine whether raw image persistence is enabled in this deployment.
   * Default is false to prevent permanent storage of sensitive victim media.
   */
  isPersistenceEnabled(): boolean;

  /**
   * Sanitizes and extracts safe metadata from submitted files.
   */
  processMetadata(fileMetadata: ImageMetadata): Promise<ImageMetadata>;

  /**
   * Optional placeholder for future encrypted storage backend (e.g. S3 KMS or encrypted blob).
   */
  storeEncrypted?(buffer: Buffer, mimeType: string): Promise<{ storageKey: string }>;
}
