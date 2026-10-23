import { jsonSuccess } from '@/lib/api-response';
import { APP_METADATA } from '@/lib/constants';
import { HealthResponse } from '@/types';

export async function GET() {
  const adapter = process.env.CYBERTRACE_STORAGE_ADAPTER || 'file';
  const aiMode = process.env.CYBERTRACE_AI_MODE || 'mock';

  const health: HealthResponse = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: APP_METADATA.version,
    environment: process.env.NODE_ENV || 'development',
    services: {
      persistence: {
        adapter: adapter === 'memory' ? 'MemoryCaseRepository' : 'FileCaseRepository (.data/cases.json)',
        status: 'operational',
      },
      aiProviders: {
        forensic: 'MockForensicService (Deterministic Heuristics)',
        trace: 'MockTraceService (Multi-domain Candidate Matching)',
        guardian: 'MockGuardianService (DMCA / Right-of-Publicity Drafter)',
        mode: aiMode,
      },
    },
  };

  return jsonSuccess(health);
}
