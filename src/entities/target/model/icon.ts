export function publicIconSrc(id: string): string {
  return `/api/public/status/${encodeURIComponent(id)}/icon`;
}

export function targetIconSrc(id: string): string {
  return `/api/targets/${encodeURIComponent(id)}/icon`;
}
