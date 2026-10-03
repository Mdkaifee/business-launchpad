/**
 * Countdown to the day the site opens.
 *
 * The launch date is a fixed calendar date so the countdown reads as a real
 * commitment rather than a rolling timer that never runs down.
 */
export const LAUNCH_DATE_ISO = "2027-01-01T00:00:00Z";
export const LAUNCH_DATE = new Date(LAUNCH_DATE_ISO);

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target has passed — the doors are open. */
  open: boolean;
};

const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

/** Whole units remaining between `now` and `target`, clamped at zero. */
export function getTimeLeft(target: Date, now: Date): TimeLeft {
  const remaining = target.getTime() - now.getTime();

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, open: true };
  }

  return {
    days: Math.floor(remaining / MS_PER_DAY),
    hours: Math.floor((remaining % MS_PER_DAY) / MS_PER_HOUR),
    minutes: Math.floor((remaining % MS_PER_HOUR) / MS_PER_MINUTE),
    seconds: Math.floor((remaining % MS_PER_MINUTE) / 1000),
    open: false,
  };
}

/** Two-character display value: 4 -> "04", 42 -> "42". */
export function pad(value: number): string {
  return String(Math.max(0, Math.floor(value))).padStart(2, "0");
}
