import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';
import { ZodError } from 'zod';

export function jsonSuccess<T>(data: T, status: number = 200) {
  const body: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status });
}

export function jsonError(message: string, code: string = 'BAD_REQUEST', status: number = 400, details?: unknown) {
  const body: ApiResponse<null> = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status });
}

export function handleApiError(err: unknown) {
  if (err instanceof ZodError) {
    return jsonError('Validation failed', 'VALIDATION_ERROR', 422, err.issues);
  }

  const message = err instanceof Error ? err.message : 'An unexpected error occurred';
  return jsonError(message, 'INTERNAL_SERVER_ERROR', 500);
}
