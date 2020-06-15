import {dates} from "../src/core";

dates.datePlusTimeframe(new Date(), 1, dates.TimeUnit.hours);
// 2020-06-15T20:38:14.953Z

dates.dateFromISO(new Date().toISOString());
// 2020-06-15T19:38:14.956Z

dates.dateInHyphens(new Date());
// 2020-06-15

dates.dateInSeconds(new Date());
// 1592249894

dates.dateMinusTimeframe(new Date, 1, dates.TimeUnit.hours);
// 2020-06-15T18:38:14.960Z

dates.isDateGreaterThan(new Date(), 1, dates.TimeUnit.hours);
// true

dates.iSOFromTimestamp(new Date().getTime());
// 2020-06-15T19:41:11.301Z

dates.timestampFromISO(new Date().toISOString());
// 1592250071303

dates.timeframeToSeconds({amount: 1, timeUnit: dates.TimeUnit.hours});
// 3600
