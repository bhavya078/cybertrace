import { NextRequest } from 'next/server';
import { jsonSuccess, jsonError, handleApiError } from '@/lib/api-response';
import { createCaseSchema } from '@/lib/validations';
import { getCaseRepository } from '@/server/repositories';
import { getImageStorageService } from '@/server/services';
import { getInvestigatorSession, checkRateLimit } from '@/server/security';
import { CaseStatus } from '@/types';

export async function GET(req: NextRequest) {
  try {
    // 1. Rate limiting check
    const rateLimit = checkRateLimit(req, { maxRequests: 120, windowMs: 60000 });
    if (!rateLimit.allowed) {
      return jsonError('Too many requests. Please slow down.', 'RATE_LIMITED', 429);
    }

    // 2. Resolve authenticated investigator session
    const session = getInvestigatorSession(req);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as CaseStatus | null;
    const search = searchParams.get('search') || undefined;

    const repo = getCaseRepository();
    // Enforce owner authorization boundary
    const cases = await repo.findAll({
      status: status || undefined,
      search,
      ownerId: session.investigatorId,
    });

    return jsonSuccess({
      total: cases.length,
      cases,
      investigatorId: session.investigatorId,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting check (stricter limit for case creation)
    const rateLimit = checkRateLimit(req, { maxRequests: 30, windowMs: 60000 });
    if (!rateLimit.allowed) {
      return jsonError('Case creation rate limit exceeded. Please wait a minute.', 'RATE_LIMITED', 429);
    }

    // 2. Resolve investigator session
    const session = getInvestigatorSession(req);

    let rawBody;
    try {
      rawBody = await req.json();
    } catch {
      return jsonError('Malformed JSON payload', 'INVALID_JSON', 400);
    }

    const validatedInput = createCaseSchema.parse(rawBody);

    // 3. Process metadata through secure ephemeral storage policy (stripping any raw sensitive content)
    const storageService = getImageStorageService();
    const safeMetadata = await storageService.processMetadata({
      fileName: validatedInput.fileName,
      mimeType: validatedInput.mimeType,
      fileSize: validatedInput.fileSize,
      width: validatedInput.width,
      height: validatedInput.height,
      sha256Hash: validatedInput.sha256Hash,
    });

    const repo = getCaseRepository();
    const newCase = await repo.create({
      title: validatedInput.title,
      description: validatedInput.description,
      ownerId: session.investigatorId,
      fileName: safeMetadata.fileName,
      mimeType: safeMetadata.mimeType,
      fileSize: safeMetadata.fileSize,
      width: safeMetadata.width,
      height: safeMetadata.height,
      sha256Hash: safeMetadata.sha256Hash,
      isSyntheticFixture: validatedInput.isSyntheticFixture,
    });

    return jsonSuccess(newCase, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
