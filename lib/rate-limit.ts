import { createHash } from "node:crypto";

// Spec Sec 8: rate-limit login/password-reset by hashed IP.
//
// In-memory sliding window — correct for a single long-lived instance,
// not for a cold-start-per-request serverless deployment (each cold
// start gets a fresh Map). Acceptable for A1; revisit with a durable
// store (e.g. Upstash Redis via the Vercel Marketplace) before this
// carries real traffic.

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

/** Returns true if the request should be allowed, false if rate-limited. */
export function checkRateLimit(
  key: string,
  maxAttempts = MAX_ATTEMPTS,
  windowMs = WINDOW_MS
): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (bucket.count >= maxAttempts) return false;

  bucket.count += 1;
  return true;
}
