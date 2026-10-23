import { NextRequest } from 'next/server';
import { jsonSuccess, jsonError, handleApiError } from '@/lib/api-response';
import { getCaseRepository } from '@/server/repositories';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const repo = getCaseRepository();
    const foundCase = await repo.findById(id);

    if (!foundCase) {
      return jsonError(`Case with ID '${id}' not found`, 'NOT_FOUND', 404);
    }

    return jsonSuccess(foundCase);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const repo = getCaseRepository();
    const deleted = await repo.delete(id);

    if (!deleted) {
      return jsonError(`Case with ID '${id}' not found`, 'NOT_FOUND', 404);
    }

    return jsonSuccess({ message: `Case '${id}' deleted successfully` });
  } catch (err) {
    return handleApiError(err);
  }
}
