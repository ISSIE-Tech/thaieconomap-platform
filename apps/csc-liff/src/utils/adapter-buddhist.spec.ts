import { th } from 'date-fns/locale';

import { AdapterBuddhist, withBuddhistYear } from './adapter-buddhist';

const F = 'dd/MM/yyyy';
const adapter = new AdapterBuddhist({ locale: th });

describe('AdapterBuddhist', () => {
  it('shows Buddhist years, including a leap day the BE year does not have', () => {
    // 2567 CE is not a leap year, so shifting the Date itself would roll to 1 March
    expect(adapter.formatByString(new Date(2024, 1, 29), F)).toBe('29/02/2567');
    expect(adapter.formatByString(new Date(1990, 0, 5), F)).toBe('05/01/2533');
  });

  it('keeps stored values Gregorian', () => {
    const leap = new Date(2024, 1, 29);

    expect(adapter.getYear(leap)).toBe(2567);
    expect(adapter.setYear(leap, 2567).getFullYear()).toBe(2024);
  });

  it('parses Buddhist input back to a Gregorian date', () => {
    const parsed = adapter.parse('29/02/2567', F)!;

    expect([parsed.getFullYear(), parsed.getMonth(), parsed.getDate()]).toEqual([2024, 1, 29]);

    const plain = new Date(1990, 0, 5);
    expect(adapter.parse(adapter.formatByString(plain, F), F)!.getTime()).toBe(plain.getTime());
  });

  it('leaves quoted literals alone and passes invalid input through', () => {
    expect(withBuddhistYear("'yyyy' yyyy", 2024)).toBe("'yyyy' '2567'");
    expect(Number.isNaN(adapter.parse('not a date', F)!.getTime())).toBe(true);
  });
});
