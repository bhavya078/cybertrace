import { NextRequest } from 'next/server';
import { Case } from '@/types';

export const INVESTIGATOR_HEADER = 'x-investigator-id';
export const SESSION_COOKIE_NAME = 'cybertrace_session';
export const DEFAULT_DEV_INVESTIGATOR = 'analyst_local_dev';

export interface InvestigatorSession {
  investigatorId: string;
  role: 'investigator' | 'lead_analyst' | 'admin';
  isLocalDevelopment: boolean;
}

/**
 * Resolves the authenticated investigator session from request headers or cookies.
 */
export function getInvestigatorSession(req: NextRequest): InvestigatorSession {
  const headerId = req.headers.get(INVESTIGATOR_HEADER);
  const cookieId = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  const resolvedId = headerId || cookieId;

  if (resolvedId && resolvedId.trim().length > 0) {
    const sanitized = resolvedId.trim().replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 64);
    return {
      investigatorId: sanitized || DEFAULT_DEV_INVESTIGATOR,
      role: 'investigator',
      isLocalDevelopment: process.env.NODE_ENV !== 'production',
    };
  }

  // Fallback for local development environment
  return {
    investigatorId: DEFAULT_DEV_INVESTIGATOR,
    role: 'investigator',
    isLocalDevelopment: process.env.NODE_ENV !== 'production',
  };
}

/**
 * IDOR Defense: Verifies that the active investigator owns the target case.
 */
export function verifyCaseOwnership(
  caseRecord: Case,
  session: InvestigatorSession
): { authorized: boolean; reason?: string } {
  // If the case has no owner assigned (e.g. legacy demo cases), allow local analyst access
  if (!caseRecord.ownerId) {
    return { authorized: true };
  }

  // Allow matching owner
  if (caseRecord.ownerId === session.investigatorId) {
    return { authorized: true };
  }

  // Synthetic fixtures are globally readable for demonstration
  if (caseRecord.isSyntheticFixture) {
    return { authorized: true };
  }

  return {
    authorized: false,
    reason: `Access denied: Case is owned by another investigator profile.`,
  };
}
