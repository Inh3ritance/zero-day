import { DateTime } from 'luxon';

export const toLocalDateTimeFromISO = (datetime: string) => (
  DateTime.fromISO(datetime)
    .setZone('local')
    .toFormat('M/dd/yyyy h:mm:ss ZZZZ') // e.g. '5/30/2022 8:01:09 PDT'
);
