const DAY = 86_400_000;
export function learningDay(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
export function activitySummary(days: string[], now = new Date()) {
  const today = learningDay(now);
  const stamp = (day: string) => Date.parse(`${day}T00:00:00Z`);
  const unique = [...new Set(days)].filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day) && day <= today).sort();
  const set = new Set(unique);
  const shift = (n: number) => new Date(stamp(today) + n * DAY).toISOString().slice(0,10);
  let streak = 0;
  for (let offset = set.has(today) ? 0 : -1; set.has(shift(offset)); offset--) streak++;
  let bestStreak = 0, run = 0, previous = 0;
  for (const day of unique) { const current = stamp(day); run = current - previous === DAY ? run + 1 : 1; bestStreak = Math.max(bestStreak, run); previous = current; }
  const mondayOffset = (new Date(stamp(today)).getUTCDay() + 6) % 7;
  return { today, streak, bestStreak, learningDays: unique.filter(day => day.slice(0,7) === today.slice(0,7)).map(day => Number(day.slice(8))), weeklyActivity: Array.from({length:7},(_,i)=>set.has(shift(i-mondayOffset)) ? 1 : 0) };
}
