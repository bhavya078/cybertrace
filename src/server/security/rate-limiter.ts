import { NextRequest } from 'next/server';

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

// In-memory token bucket rate limiter
const ipBuckets = new Map<string, RateLimitBucket>();

export interface RateLimitOptions {
  maxRequests: number; // e.g. 60 requests
  windowMs: number;    // e.g. 60,000 ms (1 minute)
}

/**
 * Checks whether an incoming request from an IP/client exceeds the allowed rate.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions = { maxRequests: 60, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetMs: number } {
  // Extract client IP address from standard forwarding headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const clientKey = (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp) || '127.0.0.1';

  const now = Date.now();
  let bucket = ipBuckets.get(clientKey);

  if (!bucket) {
    bucket = { tokens: options.maxRequests, lastRefill: now };
    ipBuckets.set(clientKey, bucket);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill;
  if (elapsed > options.windowMs) {
    bucket.tokens = options.maxRequests;
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return {
      allowed: true,
      remaining: bucket.tokens,
      resetMs: Math.max(0, options.windowMs - elapsed),
    };
  }

  return {
    allowed: false,
    remaining: 0,
    resetMs: Math.max(0, options.windowMs - elapsed),
  };
}
