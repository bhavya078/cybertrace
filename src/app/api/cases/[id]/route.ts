import { NextRequest } from 'next/server';
import { jsonSuccess, jsonError, handleApiError } from '@/lib/api-response';
import { getCaseRepository } from '@/server/repositories';
import { getInvestigatorSession, verifyCaseOwnership, checkRateLimit } from '@/server/security';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const rateLimit = checkRateLimit(req, { maxRequests: 120, windowMs: 60000 });
    if (!rateLimit.allowed) {
      return jsonError('Rate limit exceeded', 'RATE_LIMITED', 429);
    }

    const { id } = await context.params;
    const session = getInvestigatorSession(req);
    const repo = getCaseRepository();
    const foundCase = await repo.findById(id);

    if (!foundCase) {
      return jsonError(`Case with ID '${id}' not found`, 'NOT_FOUND', 404);
    }

    // IDOR Protection: Enforce case ownership
    const authCheck = verifyCaseOwnership(foundCase, session);
    if (!authCheck.authorized) {
      return jsonError(authCheck.reason || 'Unauthorized access to case', 'FORBIDDEN', 403);
    }

    return jsonSuccess(foundCase);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const rateLimit = checkRateLimit(req, { maxRequests: 30, windowMs: 60000 });
    if (!rateLimit.allowed) {
      return jsonError('Rate limit exceeded', 'RATE_LIMITED', 429);
    }

    const { id } = await context.params;
    const session = getInvestigatorSession(req);
    const repo = getCaseRepository();
    const foundCase = await repo.findById(id);

    if (!foundCase) {
      return jsonError(`Case with ID '${id}' not found`, 'NOT_FOUND', 404);
    }

    // IDOR Protection: Enforce case ownership
    const authCheck = verifyCaseOwnership(foundCase, session);
    if (!authCheck.authorized) {
      return jsonError(authCheck.reason || 'Unauthorized to delete case', 'FORBIDDEN', 403);
    }

    const deleted = await repo.delete(id);
    if (!deleted) {
      return jsonError(`Failed to delete case with ID '${id}'`, 'INTERNAL_SERVER_ERROR', 500);
    }

    return jsonSuccess({ message: `Case '${id}' deleted successfully` });
  } catch (err) {
    return handleApiError(err);
  }
}
