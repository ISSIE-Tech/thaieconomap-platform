/**
 * Convert minutes-since-midnight integer to HH:MM string.
 * @example minutesToTimeString(540) => "09:00"
 * @example minutesToTimeString(1020) => "17:00"
 */
export function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Convert HH:MM string to minutes-since-midnight integer.
 * @example timeStringToMinutes("09:00") => 540
 * @example timeStringToMinutes("17:30") => 1050
 */
export function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
