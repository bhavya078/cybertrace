import { NextRequest, NextResponse } from 'next/server';
import { jsonSuccess, handleApiError } from '@/lib/api-response';
import { getInvestigatorSession, SESSION_COOKIE_NAME } from '@/server/security';
import { getCaseRepository } from '@/server/repositories';

export async function GET(req: NextRequest) {
  try {
    const session = getInvestigatorSession(req);
    const storageAdapter = process.env.CYBERTRACE_STORAGE_ADAPTER || 'file';

    return jsonSuccess({
      session,
      storageAdapter,
      retentionPolicy: 'Zero permanent raw image storage (ephemeral browser preview)',
      environment: process.env.NODE_ENV || 'development',
      features: {
        ssrfProtection: true,
        magicByteValidation: true,
        idorAuthorization: true,
        rateLimiting: true,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action;

    if (action === 'reset_database') {
      const repo = getCaseRepository();
      await repo.resetToFixtures();
      return jsonSuccess({ message: 'Repository reset to clean demo fixtures.' });
    }

    if (action === 'update_session' && body.investigatorId) {
      const sanitized = String(body.investigatorId).trim().replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 64);
      const res = jsonSuccess({ message: 'Investigator session updated', investigatorId: sanitized });
      res.cookies.set(SESSION_COOKIE_NAME, sanitized, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 86400 * 30, // 30 days
      });
      return res;
    }

    if (action === 'logout') {
      const res = jsonSuccess({ message: 'Session cleared' });
      res.cookies.delete(SESSION_COOKIE_NAME);
      return res;
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return handleApiError(err);
  }
}
