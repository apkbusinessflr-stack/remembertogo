// In-memory token bucket per IP (serverless-safe enough για απλά APIs).
const buckets = new Map<string, { tokens: number; last: number }>();

export function allow(ip: string, capacity: number, perSecond: number): boolean {
  const now = Date.now();
  const b = buckets.get(ip) ?? { tokens: capacity, last: now };
  const refill = ((now - b.last) / 1000) * perSecond;
  b.tokens = Math.min(capacity, b.tokens + refill);
  b.last = now;
  if (b.tokens < 1) { buckets.set(ip, b); return false; }
  b.tokens -= 1;
  buckets.set(ip, b);
  return true;
}
