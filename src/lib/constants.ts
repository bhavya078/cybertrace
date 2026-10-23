export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/tiff',
] as const;

export type AcceptedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Megabytes
export const MAX_FILE_SIZE_MB = 10;

export const APP_METADATA = {
  name: 'CyberTrace',
  version: '0.1.0',
  description:
    'AI-powered image forensics and discovery platform for investigating manipulated media and drafting removal actions.',
  disclaimer:
    'CyberTrace provides preliminary forensic indicators and candidate reverse discovery matches. Results should be reviewed by human investigators prior to formal legal submission.',
} as const;
