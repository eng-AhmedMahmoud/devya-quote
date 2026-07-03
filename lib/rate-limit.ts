/**
 * Lightweight in-process, per-IP fixed-window rate limiter.
 *
 * Same pattern as the marketing site's send-email route: best-effort only —
 * the Map is per-server-instance (it does not survive restarts and is not
 * shared across instances), but it meaningfully raises the cost of hammering
 * a single instance without requiring any new infrastructure.
 *
 * Used by the unauthenticated DOCX export route: docx generation is
 * CPU/memory-heavy, which makes it an easy DoS surface (finding S24).
 */

type RateEntry = { count: number; windowStart: number };

const rateLimitMap = new Map<string, RateEntry>();

/**
 * Extract the client IP from x-forwarded-for (first hop) with a fallback so
 * that a missing/garbled header degrades to a single shared bucket rather
 * than disabling the limiter entirely.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Drop expired entries so the Map cannot grow without bound. */
function pruneExpired(now: number, windowMs: number): void {
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.windowStart >= windowMs) {
      rateLimitMap.delete(ip);
    }
  }
}

/**
 * Returns whether the request is allowed and, when blocked, the number of
 * seconds until the current window resets (for a Retry-After header).
 */
export function checkRateLimit(
  ip: string,
  { max = 10, windowMs = 60_000 }: { max?: number; windowMs?: number } = {},
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  pruneExpired(now, windowMs);

  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart >= windowMs) {
    // Start a fresh window for this IP.
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= max) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((entry.windowStart + windowMs - now) / 1000),
    );
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
