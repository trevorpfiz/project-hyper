import type { DateTime } from "luxon";

// Format dates to remove milliseconds and use the correct format
export const formatDexcomDate = (dateTime: DateTime) => {
  return dateTime.toUTC().toFormat("yyyy-MM-dd'T'HH:mm:ss");
};

// Get date chunks for fetching data in chunks of a specified size
export function getDateChunks(
  startDate: DateTime,
  endDate: DateTime,
  chunkSizeInDays = 7,
) {
  const chunks = [];
  let currentStart = startDate;
  const finalEnd = endDate;

  while (currentStart < finalEnd) {
    const chunkEnd = currentStart.plus({ days: chunkSizeInDays });
    const actualEnd = chunkEnd < finalEnd ? chunkEnd : finalEnd;
    chunks.push({
      start: formatDexcomDate(currentStart),
      end: formatDexcomDate(actualEnd),
    });
    currentStart = actualEnd.plus({ seconds: 1 });
  }

  return chunks;
}
