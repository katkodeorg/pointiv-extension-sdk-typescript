import { pointivGoogleCalendarCreate } from "./host-calls.js";

function nextDay(date: string): string {
  const parts = date.split("-").map((p) => Number.parseInt(p, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return date;
  const [y, m, d] = parts;
  const daysInMonth =
    m === 2
      ? y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)
        ? 29
        : 28
      : [4, 6, 9, 11].includes(m)
        ? 30
        : 31;
  if (d < daysInMonth) {
    return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d + 1).padStart(2, "0")}`;
  }
  if (m < 12) return `${String(y).padStart(4, "0")}-${String(m + 1).padStart(2, "0")}-01`;
  return `${String(y + 1).padStart(4, "0")}-01-01`;
}

function addOneHour(hm: string): string {
  const [hRaw, mRaw] = hm.split(":");
  const h = Number.parseInt(hRaw ?? "0", 10);
  const m = Number.parseInt(mRaw ?? "0", 10);
  return `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export const googleCalendar = {
  schedule(
    title: string,
    date: string,
    startTime?: string,
    endTime?: string,
    description?: string,
  ): Record<string, unknown> {
    const start = startTime
      ? { dateTime: `${date}T${startTime}:00`, timeZone: "UTC" }
      : { date };
    const end = startTime
      ? { dateTime: `${date}T${endTime || addOneHour(startTime)}:00`, timeZone: "UTC" }
      : { date: nextDay(date) };

    return googleCalendar.createEventRaw({
      summary: title,
      description: description ?? "",
      start,
      end,
    });
  },

  createEventRaw(payload: Record<string, unknown>): Record<string, unknown> {
    const raw = pointivGoogleCalendarCreate(JSON.stringify(payload));
    const result = JSON.parse(raw) as Record<string, unknown>;
    if (typeof result.error === "string") {
      throw new Error(result.error);
    }
    return result;
  },
};
