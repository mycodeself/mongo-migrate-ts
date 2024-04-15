import { format } from 'date-fns';

export const timestamp = (dateFormat: string, date = new Date()): string => {
  return format(
    new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    ),
    dateFormat
  );
};
