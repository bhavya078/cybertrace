import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';
import { ZodError } from 'zod';

const SENSITIVE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, private',
  'Pragma': 'no-cache',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

export function jsonSuccess<T>(data: T, status: number = 200, headers?: Record<string, string>) {
  const body: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    status,
    headers: {
      ...SENSITIVE_HEADERS,
      ...headers,
    },
  });
}

export function jsonError(
  message: string,
  code: string = 'BAD_REQUEST',
  status: number = 400,
  details?: unknown,
  headers?: Record<string, string>
) {
  // Sanitize details in production to prevent leaking server paths
  const safeDetails =
    process.env.NODE_ENV === 'production' && status >= 500 ? undefined : details;

  const body: ApiResponse<null> = {
    success: false,
    error: {
      code,
      message,
      details: safeDetails,
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    status,
    headers: {
      ...SENSITIVE_HEADERS,
      ...headers,
    },
  });
}

export function handleApiError(err: unknown) {
  if (err instanceof ZodError) {
    return jsonError('Validation failed', 'VALIDATION_ERROR', 422, err.issues);
  }

  const message = err instanceof Error ? err.message : 'An internal processing error occurred';
  return jsonError(message, 'INTERNAL_SERVER_ERROR', 500);
}
