type RateEntry = { count: number; resetAt: number };

/** Creates an independent rate limiter. Call once per module at top level. */
export function createRateLimiter(limit: number, windowMs: number) {
  const map = new Map<string, RateEntry>();

  return function isRateLimited(ip: string): boolean {
    const now = Date.now();

    /* prune expired entries to prevent unbounded growth */
    if (map.size > 500) {
      for (const [key, entry] of map) {
        if (now > entry.resetAt) map.delete(key);
      }
    }

    const entry = map.get(ip);
    if (!entry || now > entry.resetAt) {
      map.set(ip, { count: 1, resetAt: now + windowMs });
      return false;
    }

    entry.count++;
    return entry.count > limit;
  };
}
