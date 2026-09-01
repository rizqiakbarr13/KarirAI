export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}

export function getRequestIdentifier(request: Request, userId?: string | null) {
  if (userId) return `user:${userId}`;
  return `ip:${getClientIp(request) ?? "unknown"}`;
}
