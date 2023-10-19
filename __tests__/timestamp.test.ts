import { format } from 'date-fns';
import { Timestamp } from '../lib/utils/timestamp';

describe('Timestamp', () => {
  describe('#toString', () => {
    const dateFormat = 'yyyy/MM/dd HH:mm:ss';

    it('should format the given date to the specified format', () => {
      const fixedDate = new Date('2023-01-01 00:00:00.000');
      const formattedDate = new Timestamp(fixedDate).toString(dateFormat);
      expect(formattedDate).toStrictEqual(format(fixedDate, dateFormat));
    });

    it('should format the current date to the specified format if no given date', () => {
      jest
        .useFakeTimers()
        .setSystemTime(new Date('2022-01-01 00:00:00.000').getTime());
      const formattedDate = new Timestamp().toString(dateFormat);
      expect(formattedDate).toStrictEqual(format(new Date(), dateFormat));
    });

    it('should throw error if given invalid format', () => {
      expect(() => new Timestamp().toString('invalid format')).toThrowError(
        /Format string contains an unescaped latin alphabet character/
      );
    });
  });
});
