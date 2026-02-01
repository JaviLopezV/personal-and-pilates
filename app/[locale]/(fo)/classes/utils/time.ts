export function minutesFromMidnight(d: Date) {
  return d.getHours() * 60 + d.getMinutes();
}

export function isSameDayLocal(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
