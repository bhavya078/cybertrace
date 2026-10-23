import { NextRequest } from 'next/server';
import { jsonSuccess, jsonError, handleApiError } from '@/lib/api-response';
import { getCaseRepository } from '@/server/repositories';
import { getInvestigatorSession, checkRateLimit } from '@/server/security';
import { RemovalReport } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, { maxRequests: 120, windowMs: 60000 });
    if (!rateLimit.allowed) {
      return jsonError('Rate limit exceeded', 'RATE_LIMITED', 429);
    }

    const session = getInvestigatorSession(req);
    const repo = getCaseRepository();

    const cases = await repo.findAll({
      ownerId: session.investigatorId,
    });

    const allReports: (RemovalReport & { caseTitle: string; caseId: string })[] = [];

    for (const c of cases) {
      if (c.reports && Array.isArray(c.reports)) {
        for (const rep of c.reports) {
          allReports.push({
            ...rep,
            caseTitle: c.title,
            caseId: c.id,
          });
        }
      }
    }

    // Sort newest reports first
    allReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return jsonSuccess({
      total: allReports.length,
      reports: allReports,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
