export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function dateKeyLocal(d: Date) {
  // YYYY-MM-DD (local)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function isoLocalStartOfDay(d: Date) {
  return `${dateKeyLocal(d)}T00:00:00`;
}

export function isoLocalEndOfDay(d: Date) {
  return `${dateKeyLocal(d)}T23:59:59.999`;
}

export function startOfWeekMonday(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay(); // 0=Sun, 1=Mon...
  const diff = day === 0 ? -6 : 1 - day; // move to Monday
  x.setDate(x.getDate() + diff);
  return x;
}

export function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function fmtDayHeader(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(d);
}

export function fmtWeekRange(from: Date, to: Date) {
  const f = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${f.format(from)} – ${f.format(to)}`;
}

export function fmtTime(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
