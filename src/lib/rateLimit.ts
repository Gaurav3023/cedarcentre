const tracker: Record<string, { count: number, resetAt: number }> = {};

export function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000) {
  const now = Date.now();
  if (!tracker[ip] || now > tracker[ip].resetAt) {
    tracker[ip] = { count: 1, resetAt: now + windowMs };
    return true;
  }

  tracker[ip].count++;
  return tracker[ip].count <= limit;
}
