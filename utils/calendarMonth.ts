export const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

/** Padded week rows (0 = blank cell) for the month containing `monthStart`. */
export function getCalendarRowsForMonth(monthStart: Date): number[][] {
  const y = monthStart.getFullYear();
  const m = monthStart.getMonth();
  const leadingBlankCount = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: leadingBlankCount }, () => 0),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(0);
  const rows: number[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
}

export function isSameCalendarDay(
  selected: Date,
  monthStart: Date,
  day: number
): boolean {
  return (
    selected.getFullYear() === monthStart.getFullYear() &&
    selected.getMonth() === monthStart.getMonth() &&
    selected.getDate() === day
  );
}

export function formatMonthYearLabel(monthStart: Date): string {
  return monthStart.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
}
