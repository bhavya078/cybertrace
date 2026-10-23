import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from './constants';

export const imageMetadataSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(1, 'File name is required')
    .max(255, 'File name cannot exceed 255 characters'),
  mimeType: z
    .string()
    .refine(
      (type) => ACCEPTED_IMAGE_TYPES.includes(type as (typeof ACCEPTED_IMAGE_TYPES)[number]),
      {
        message: `Accepted formats: ${ACCEPTED_IMAGE_TYPES.map((t) => t.replace('image/', '.')).join(', ')}`,
      }
    ),
  fileSize: z
    .number()
    .int('File size must be an integer')
    .positive('File size must be greater than 0')
    .max(MAX_FILE_SIZE_BYTES, `Maximum allowed image size is ${MAX_FILE_SIZE_MB}MB`),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  sha256Hash: z
    .string()
    .trim()
    .regex(/^[a-f0-9]{64}$/i, 'Must be a valid 64-character SHA-256 hexadecimal string'),
  previewDataUrl: z.string().optional(),
});

export const createCaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Case title must be at least 3 characters')
    .max(120, 'Case title cannot exceed 120 characters'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .default(''),
  fileName: imageMetadataSchema.shape.fileName,
  mimeType: imageMetadataSchema.shape.mimeType,
  fileSize: imageMetadataSchema.shape.fileSize,
  width: imageMetadataSchema.shape.width,
  height: imageMetadataSchema.shape.height,
  sha256Hash: imageMetadataSchema.shape.sha256Hash,
  previewDataUrl: imageMetadataSchema.shape.previewDataUrl,
  isSyntheticFixture: z.boolean().optional().default(false),
});

export type CreateCaseSchemaInput = z.infer<typeof createCaseSchema>;

export const analyzeCaseSchema = z.object({
  deepScan: z.boolean().optional().default(true),
  enableTraceDiscovery: z.boolean().optional().default(true),
  simulatedScenario: z
    .enum(['deepfake', 'manipulated_doc', 'authentic', 'inconclusive'])
    .optional(),
});

export type AnalyzeCaseSchemaInput = z.infer<typeof analyzeCaseSchema>;

export const createReportSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Report title must be at least 3 characters')
    .max(140, 'Report title cannot exceed 140 characters')
    .optional(),
  targetUrls: z.array(z.string().url('Invalid URL format')).optional(),
  noticeType: z
    .enum(['dmca_takedown', 'defamation_notice', 'privacy_violation', 'terms_of_service'])
    .optional()
    .default('dmca_takedown'),
  legalBasis: z.string().trim().max(1000).optional(),
  recipientEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  notes: z.string().trim().max(2000).optional(),
});

export type CreateReportSchemaInput = z.infer<typeof createReportSchema>;
