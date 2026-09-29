/** Public promotional video only; never use a protected lesson as a fallback. */
export function courseIntroId(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    if (!['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtube-nocookie.com'].includes(url.hostname)) return null;
    const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1];
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}

export function normalizeCourseIntro(value: unknown): string {
  if (value === '') return '';
  const id = courseIntroId(value);
  if (!id) throw new Error('Video giới thiệu phải là link YouTube HTTPS hợp lệ.');
  return `https://www.youtube.com/watch?v=${id}`;
}
