export const uniqueId = () => Math.floor(100000 + Math.random() * 900000);

export const getPresentDate = (
  options: { month: "numeric" | "2-digit"; day: "numeric" | "2-digit" },
  locale = "en-US"
) => {
  const currentDate = new Date();
  const date = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    day: options.day,
    month: options.month,
  }).format(currentDate);
  return date;
};
export const getPresentTime = (
  options: { hour: "numeric" | "2-digit"; minute: "numeric" | "2-digit" },
  locale = "en-US",
  twelveHour = true
) => {
  const currentTime = new Date();
  const time = new Intl.DateTimeFormat(locale, {
    hour: options.hour,
    minute: options.minute,
    hour12: twelveHour,
  }).format(currentTime);
  return time;
};
export function convertToUiDateFormat(dateStr: string) {
  const [month, day, year] = dateStr.split("/").map(Number);

  const shortMonth = new Date(year, month - 1).toLocaleString("en-US", {
    month: "short",
  });

  return `${shortMonth} ${day}, ${year}`;
}
