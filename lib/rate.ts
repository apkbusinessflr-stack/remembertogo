// lib/rate.ts
const buckets = new Map<string, { tokens: number; ts: number }>();


export function allow(ip: string, capacity = 60, refillPerSec = 1) {
const now = Date.now();
const b = buckets.get(ip) ?? { tokens: capacity, ts: now };
const refill = Math.floor((now - b.ts) / 1000) * refillPerSec;
b.tokens = Math.min(capacity, b.tokens + refill);
b.ts = now;
if (b.tokens <= 0) return false;
b.tokens--;
buckets.set(ip, b);
return true;
