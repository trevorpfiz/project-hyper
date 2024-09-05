import { add, format, parseISO } from "date-fns";

// Format dates to remove milliseconds and use the correct format
export const formatDexcomDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};

// Get date chunks for fetching data in chunks of a specified size
export function getDateChunks(
  startDate: string,
  endDate: string,
  chunkSizeInDays = 7,
) {
  const chunks = [];
  let currentStart = parseISO(startDate);
  const finalEnd = parseISO(endDate);

  while (currentStart < finalEnd) {
    const chunkEnd = add(currentStart, { days: chunkSizeInDays });
    const actualEnd = chunkEnd < finalEnd ? chunkEnd : finalEnd;
    chunks.push({
      start: currentStart.toISOString(),
      end: actualEnd.toISOString(),
    });
    currentStart = add(actualEnd, { seconds: 1 });
  }

  return chunks;
}
