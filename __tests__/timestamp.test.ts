import { format } from 'date-fns';
import { timestamp } from '../lib/utils/timestamp';

describe('timestamp', () => {
  const dateFormat = 'yyyy/MM/dd HH:mm:ss';

  it('should format the given date to the specified format', () => {
    const fixedDate = new Date('2023-01-01 00:00:00.000');
    const formattedDate = timestamp(dateFormat, fixedDate);
    expect(formattedDate).toStrictEqual(format(fixedDate, dateFormat));
  });

  it('should format the current date to the specified format if no given date', () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2022-01-01 00:00:00.000').getTime());
    const formattedDate = timestamp(dateFormat);
    expect(formattedDate).toStrictEqual(format(new Date(), dateFormat));
  });

  it('should throw error if given invalid format', () => {
    expect(() => timestamp('invalid format')).toThrowError(
      /Format string contains an unescaped latin alphabet character/
    );
  });
});
