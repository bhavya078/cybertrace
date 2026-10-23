/**
 * Server-Side Request Forgery (SSRF) Guard
 * Validates that candidate target URLs point strictly to public web destinations
 * and never to internal network resources, loopback, link-local, or cloud metadata services.
 */

// Denied IP ranges: loopback, private RFC 1918, link-local, carrier-grade NAT, cloud metadata
const PRIVATE_IP_PATTERNS = [
  /^127\./,                         // Loopback IPv4
  /^10\./,                          // Private class A
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Private class B
  /^192\.168\./,                    // Private class C
  /^169\.254\./,                    // Link-local / AWS / GCP / Azure metadata (169.254.169.254)
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // Carrier-grade NAT
  /^0\./,                           // Current network
  /^::1$/,                          // Loopback IPv6
  /^[fF][cCdD]/,                    // Unique local IPv6 (fc00::/7)
  /^[fF][eE][89aAbB]/,              // Link-local IPv6 (fe80::/10)
];

const DISALLOWED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'broadcasthost',
  'metadata.google.internal',
  'instance-data',
]);

export interface UrlValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  error?: string;
}

/**
 * Validates whether a URL is a safe, publicly routable HTTP/HTTPS address.
 */
export function validatePublicUrl(rawUrl: string): UrlValidationResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, error: 'URL must be a non-empty string.' };
  }

  const trimmed = rawUrl.trim();

  // Basic length boundary check to prevent ReDoS / memory exhaustion
  if (trimmed.length > 2048) {
    return { isValid: false, error: 'URL exceeds maximum length of 2048 characters.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: 'Malformed URL format.' };
  }

  // Enforce protocol restriction: HTTPS preferred, HTTP tolerated only for standard web ports
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return {
      isValid: false,
      error: `Disallowed protocol '${parsed.protocol}'. Only http: and https: are permitted.`,
    };
  }

  // Reject embedded credentials (e.g. http://user:pass@host)
  if (parsed.username || parsed.password) {
    return { isValid: false, error: 'Embedded user credentials in URLs are not permitted.' };
  }

  const rawHostname = parsed.hostname.toLowerCase();
  const hostname = rawHostname.startsWith('[') && rawHostname.endsWith(']')
    ? rawHostname.slice(1, -1)
    : rawHostname;

  // Check disallowed hostnames
  if (
    DISALLOWED_HOSTNAMES.has(rawHostname) ||
    DISALLOWED_HOSTNAMES.has(hostname) ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    return { isValid: false, error: `Access to internal host '${rawHostname}' is prohibited.` };
  }

  // Reject IP address matching private / loopback / metadata ranges
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname) || pattern.test(rawHostname)) {
      return {
        isValid: false,
        error: `Access to internal or private IP network address '${rawHostname}' is strictly prohibited.`,
      };
    }
  }

  // Restrict to standard web ports
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    return { isValid: false, error: `Non-standard port '${parsed.port}' is not permitted.` };
  }

  return { isValid: true, sanitizedUrl: parsed.toString() };
}
