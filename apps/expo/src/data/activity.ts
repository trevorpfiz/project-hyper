export const mockActivityData = [
  {
    type: "sleep",
    dateTime: "2024-08-12T00:00:00",
    title: "Sleep",
    description: "Sleeping through the night",
  },
  {
    type: "exercise",
    dateTime: "2024-08-12T06:30:00",
    title: "Morning Workout",
    description: "30-minute high-intensity interval training",
  },
  {
    type: "nutrition",
    dateTime: "2024-08-12T07:30:00",
    title: "Breakfast",
    description: "Whole grain toast with avocado and eggs",
  },
  {
    type: "work",
    dateTime: "2024-08-12T09:01:00",
    title: "Start Work",
    description: "Begin workday at the office",
  },
  {
    type: "nutrition",
    dateTime: "2024-08-12T10:30:00",
    title: "Mid-morning Snack",
    description: "Apple with a small handful of almonds",
  },
  {
    type: "exercise",
    dateTime: "2024-08-12T12:00:00",
    title: "Lunchtime Walk",
    description: "20-minute brisk walk around the block",
  },
  {
    type: "nutrition",
    dateTime: "2024-08-12T12:30:00",
    title: "Lunch",
    description: "Grilled chicken salad with mixed greens and vinaigrette",
  },
  {
    type: "work",
    dateTime: "2024-08-12T13:30:00",
    title: "Afternoon Work",
    description: "Return to work after lunch",
  },
  {
    type: "nutrition",
    dateTime: "2024-08-12T15:30:00",
    title: "Afternoon Snack",
    description: "Greek yogurt with berries",
  },
  {
    type: "exercise",
    dateTime: "2024-08-12T18:00:00",
    title: "Evening Yoga",
    description: "45-minute yoga session for relaxation and flexibility",
  },
  {
    type: "nutrition",
    dateTime: "2024-08-12T19:30:00",
    title: "Dinner",
    description: "Grilled salmon with quinoa and roasted vegetables",
  },
  {
    type: "leisure",
    dateTime: "2024-08-12T20:30:00",
    title: "Evening Relaxation",
    description: "Reading a book and winding down for the day",
  },
  {
    type: "sleep",
    dateTime: "2024-08-12T22:30:00",
    title: "Bedtime",
    description: "Preparing for sleep",
  },
];

export type MockActivityData = (typeof mockActivityData)[number];
