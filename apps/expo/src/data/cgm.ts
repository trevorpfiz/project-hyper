export const mockCGMData = [
  {
    dateTime: "2024-08-09T07:30:00",
    value: 120,
  },
  {
    dateTime: "2024-08-09T09:00:00",
    value: 120,
  },
  {
    dateTime: "2024-08-09T12:00:00",
    value: 120,
  },
];
export type CGMData = (typeof mockCGMData)[number];
