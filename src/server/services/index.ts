import { IForensicService } from './forensics/forensic-service.interface';
import { MockForensicService } from './forensics/mock-forensic-service';
import { ITraceService } from './trace/trace-service.interface';
import { MockTraceService } from './trace/mock-trace-service';
import { IGuardianService } from './guardian/guardian-service.interface';
import { MockGuardianService } from './guardian/mock-guardian-service';
import { IImageStorageService } from './storage/storage-service.interface';
import { EphemeralStorageService } from './storage/ephemeral-storage-service';

export * from './forensics/forensic-service.interface';
export * from './forensics/mock-forensic-service';
export * from './trace/trace-service.interface';
export * from './trace/mock-trace-service';
export * from './guardian/guardian-service.interface';
export * from './guardian/mock-guardian-service';
export * from './storage/storage-service.interface';
export * from './storage/ephemeral-storage-service';

// Service factory singletons - ready for swapping with Nebius/NVIDIA live providers
let forensicServiceInstance: IForensicService | null = null;
let traceServiceInstance: ITraceService | null = null;
let guardianServiceInstance: IGuardianService | null = null;
let storageServiceInstance: IImageStorageService | null = null;

export function getForensicService(): IForensicService {
  if (!forensicServiceInstance) {
    forensicServiceInstance = new MockForensicService();
  }
  return forensicServiceInstance;
}

export function getTraceService(): ITraceService {
  if (!traceServiceInstance) {
    traceServiceInstance = new MockTraceService();
  }
  return traceServiceInstance;
}

export function getGuardianService(): IGuardianService {
  if (!guardianServiceInstance) {
    guardianServiceInstance = new MockGuardianService();
  }
  return guardianServiceInstance;
}

export function getImageStorageService(): IImageStorageService {
  if (!storageServiceInstance) {
    storageServiceInstance = new EphemeralStorageService();
  }
  return storageServiceInstance;
}
