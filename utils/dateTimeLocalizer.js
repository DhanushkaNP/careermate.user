import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export const dateLocalizer = (date) => {
  return dayjs(date).tz(dayjs.tz.guess()).format("YYYY-MM-DD");
};
