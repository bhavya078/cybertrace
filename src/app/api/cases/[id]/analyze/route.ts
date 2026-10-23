import { NextRequest } from 'next/server';
import { jsonSuccess, jsonError, handleApiError } from '@/lib/api-response';
import { analyzeCaseSchema, AnalyzeCaseSchemaInput } from '@/lib/validations';
import { getCaseRepository } from '@/server/repositories';
import { getForensicService, getTraceService } from '@/server/services';
import { getInvestigatorSession, verifyCaseOwnership, checkRateLimit } from '@/server/security';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    // 1. Rate limiting on expensive analysis operations
    const rateLimit = checkRateLimit(req, { maxRequests: 20, windowMs: 60000 });
    if (!rateLimit.allowed) {
      return jsonError('Analysis rate limit exceeded. Please wait a moment.', 'RATE_LIMITED', 429);
    }

    const { id } = await context.params;
    const session = getInvestigatorSession(req);
    const repo = getCaseRepository();
    const caseRecord = await repo.findById(id);

    if (!caseRecord) {
      return jsonError(`Case with ID '${id}' not found`, 'NOT_FOUND', 404);
    }

    // 2. IDOR Authorization Check
    const authCheck = verifyCaseOwnership(caseRecord, session);
    if (!authCheck.authorized) {
      return jsonError(authCheck.reason || 'Unauthorized to analyze case', 'FORBIDDEN', 403);
    }

    let parsedOptions: AnalyzeCaseSchemaInput = { deepScan: true, enableTraceDiscovery: true };
    try {
      const rawBody = await req.json();
      parsedOptions = analyzeCaseSchema.parse(rawBody);
    } catch {
      // Body is optional; fallback to default options
    }

    // 3. Run ForensicService
    const forensicService = getForensicService();
    const forensicResult = await forensicService.analyze(caseRecord, {
      deepScan: parsedOptions.deepScan,
      simulatedScenario: parsedOptions.simulatedScenario,
    });

    // 4. Run TraceService if requested
    let traceResult = caseRecord.traceResult;
    if (parsedOptions.enableTraceDiscovery) {
      const traceService = getTraceService();
      traceResult = await traceService.discover(caseRecord);
    }

    // 5. Adjudicate updated status
    const newStatus =
      forensicResult.overallVerdict === 'manipulation_suspected'
        ? 'flagged'
        : 'completed';

    const updatedCase = await repo.update(id, {
      status: newStatus,
      forensicResult,
      traceResult,
    });

    return jsonSuccess({
      message: 'Forensic and discovery analysis pipeline executed successfully',
      case: updatedCase,
      forensicResult,
      traceResult,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
