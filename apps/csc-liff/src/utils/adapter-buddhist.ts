import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export const BE_OFFSET = 543;

/**
 * Rewrite the year tokens of a date-fns format into quoted literals holding the
 * Buddhist year, leaving text already inside single quotes alone.
 *
 * Shifting the Date itself cannot work: 29 Feb 2024 is 29/02/2567, but 2567 CE
 * is not a leap year, so setFullYear rolls it to 1 March.
 */
export const withBuddhistYear = (format: string, gregorianYear: number): string => {
  const be = String(gregorianYear + BE_OFFSET);

  return format
    .split(/('[^']*')/)
    .map((part, index) =>
      index % 2
        ? part
        : part.replace(/y{4,}/g, `'${be}'`).replace(/(?<!y)yy(?!y)/g, `'${be.slice(-2)}'`)
    )
    .join('');
};

/** Build a matcher for the numeric fields of a format so the year can be read back out. */
const yearFromValue = (value: string, format: string): number | null => {
  const tokens: string[] = [];
  const pattern = format
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/y{4,}|yy|MM|M|dd|d|HH|H|mm|m|ss|s/g, (token) => {
      tokens.push(token);

      return token.length === 1 ? '(\\d{1,2})' : `(\\d{${token.length}})`;
    });

  const match = new RegExp(`^${pattern}$`).exec(value.trim());
  const index = tokens.findIndex((token) => token.startsWith('y'));

  if (!match || index === -1) return null;

  return Number(match[index + 1]);
};

/**
 * Buddhist-era wrapper around the date-fns adapter: stored values stay ordinary
 * Gregorian `Date`s, only the year the user reads and types is shifted by 543.
 *
 * Replaces @tarzui/date-fns-be, which reaches into date-fns v2 internals and
 * does not load under date-fns v4.
 *
 * The base adapter defines its methods as instance properties, so these are
 * assigned in the constructor rather than declared as `super.` overrides.
 */
export class AdapterBuddhist extends AdapterDateFns {
  constructor(...args: ConstructorParameters<typeof AdapterDateFns>) {
    super(...args);

    const baseGetYear = this.getYear;
    const baseSetYear = this.setYear;
    const baseFormatByString = this.formatByString;
    const baseParse = this.parse;

    // the year view lists BE years; picking one stores the Gregorian year
    this.getYear = (date) => baseGetYear(date) + BE_OFFSET;
    this.setYear = (date, year) => baseSetYear(date, year - BE_OFFSET);

    this.formatByString = (date, format) =>
      baseFormatByString(date, withBuddhistYear(format, baseGetYear(date)));

    this.parse = (value, format) => {
      const buddhistYear = yearFromValue(value, format);

      if (buddhistYear === null) return baseParse(value, format);

      // hand date-fns the Gregorian year so a leap day still parses
      return baseParse(
        value.replace(String(buddhistYear), String(buddhistYear - BE_OFFSET)),
        format
      );
    };
  }
}
