import { NextRequest } from 'next/server';
import { jsonSuccess, jsonError, handleApiError } from '@/lib/api-response';
import { createReportSchema } from '@/lib/validations';
import { getCaseRepository } from '@/server/repositories';
import { getGuardianService } from '@/server/services';

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

    let options = {};
    try {
      const rawBody = await req.json();
      options = createReportSchema.parse(rawBody);
    } catch {
      // Body is optional; fallback to default draft report
    }

    const guardianService = getGuardianService();
    const newReport = await guardianService.generateReport(caseRecord, options);

    const existingReports = caseRecord.reports || [];
    const updatedReports = [newReport, ...existingReports];

    await repo.update(id, {
      reports: updatedReports,
    });

    return jsonSuccess(newReport, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
