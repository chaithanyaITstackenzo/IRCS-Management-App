/**
 * Centralized date/time formatting. Never manually slice ISO strings in a screen —
 * always go through these helpers so timezone handling stays in one place.
 *
 * Strategy: the backend sends TIMESTAMPTZ values (already UTC-normalized). We render
 * them in the device's local time zone for display, since hospital staff read the app
 * on-site. If Thoufiq confirms a different timezone contract (e.g. always display in
 * Asia/Kolkata regardless of device locale), centralize that change here only.
 */

const DATE_OPTS: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
const TIME_OPTS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', DATE_OPTS);
}

export function formatTime(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-IN', TIME_OPTS);
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return `${formatDate(value)}, ${formatTime(value)}`;
}

/**
 * Formats a Postgres INTERVAL as returned by /attendance (total_hours_worked).
 * Accepts either "HH:MM:SS" or an ISO-8601 duration ("PT8H7M"); returns "8h 07m".
 */
export function formatDuration(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '—';
    const hours = Math.floor(value / 60);
    const minutes = Math.round(value % 60);
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }
  if (typeof value !== 'string') return '—';

  const hhmmss = value.match(/^(\d+):(\d{2}):(\d{2})$/);
  if (hhmmss) {
    const [, h, m] = hhmmss;
    return `${parseInt(h, 10)}h ${m}m`;
  }

  const iso = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (iso) {
    const h = iso[1] ? parseInt(iso[1], 10) : 0;
    const m = iso[2] ? parseInt(iso[2], 10) : 0;
    return `${h}h ${String(m).padStart(2, '0')}m`;
  }

  return value;
}

/** "09:00:00" / "09:00" → "9:00 AM" for shift time-only fields (no date component). */
export function formatTimeOnly(value: string | null | undefined): string {
  if (!value) return '—';
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const suffix = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${suffix}`;
}

export function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayInputValue(): string {
  return toDateInputValue(new Date());
}
