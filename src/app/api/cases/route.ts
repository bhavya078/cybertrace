import { NextRequest } from 'next/server';
import { jsonSuccess, jsonError, handleApiError } from '@/lib/api-response';
import { createCaseSchema } from '@/lib/validations';
import { getCaseRepository } from '@/server/repositories';
import { getImageStorageService } from '@/server/services';
import { CaseStatus } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as CaseStatus | null;
    const search = searchParams.get('search') || undefined;

    const repo = getCaseRepository();
    const cases = await repo.findAll({
      status: status || undefined,
      search,
    });

    return jsonSuccess({
      total: cases.length,
      cases,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    let rawBody;
    try {
      rawBody = await req.json();
    } catch {
      return jsonError('Malformed JSON payload', 'INVALID_JSON', 400);
    }

    const validatedInput = createCaseSchema.parse(rawBody);

    // Run file metadata through secure storage policy (stripping any raw sensitive content)
    const storageService = getImageStorageService();
    const safeMetadata = await storageService.processMetadata({
      fileName: validatedInput.fileName,
      mimeType: validatedInput.mimeType,
      fileSize: validatedInput.fileSize,
      width: validatedInput.width,
      height: validatedInput.height,
      sha256Hash: validatedInput.sha256Hash,
      previewDataUrl: validatedInput.previewDataUrl,
    });

    const repo = getCaseRepository();
    const newCase = await repo.create({
      title: validatedInput.title,
      description: validatedInput.description,
      fileName: safeMetadata.fileName,
      mimeType: safeMetadata.mimeType,
      fileSize: safeMetadata.fileSize,
      width: safeMetadata.width,
      height: safeMetadata.height,
      sha256Hash: safeMetadata.sha256Hash,
      previewDataUrl: safeMetadata.previewDataUrl,
      isSyntheticFixture: validatedInput.isSyntheticFixture,
    });

    return jsonSuccess(newCase, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
