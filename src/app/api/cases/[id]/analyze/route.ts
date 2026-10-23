import { NextRequest } from 'next/server';
import { jsonSuccess, jsonError, handleApiError } from '@/lib/api-response';
import { analyzeCaseSchema, AnalyzeCaseSchemaInput } from '@/lib/validations';
import { getCaseRepository } from '@/server/repositories';
import { getForensicService, getTraceService } from '@/server/services';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const repo = getCaseRepository();
    const caseRecord = await repo.findById(id);

    if (!caseRecord) {
      return jsonError(`Case with ID '${id}' not found`, 'NOT_FOUND', 404);
    }

    let parsedOptions: AnalyzeCaseSchemaInput = { deepScan: true, enableTraceDiscovery: true };
    try {
      const rawBody = await req.json();
      parsedOptions = analyzeCaseSchema.parse(rawBody);
    } catch {
      // Body is optional; fallback to default options
    }

    // 1. Run ForensicService
    const forensicService = getForensicService();
    const forensicResult = await forensicService.analyze(caseRecord, {
      deepScan: parsedOptions.deepScan,
      simulatedScenario: parsedOptions.simulatedScenario,
    });

    // 2. Run TraceService if requested
    let traceResult = caseRecord.traceResult;
    if (parsedOptions.enableTraceDiscovery) {
      const traceService = getTraceService();
      traceResult = await traceService.discover(caseRecord);
    }

    // 3. Adjudicate updated status
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
