import { format } from 'date-fns';

export const timestamp = (dateFormat: string, date = new Date()): string => {
  return format(
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ),
    dateFormat
  );
};
