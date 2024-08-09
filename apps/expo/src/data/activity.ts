export const mockActivityData = [
  {
    type: "exercise",
    dateTime: "2024-08-09T07:30:00",
    title: "Morning Jog",
    description: "5km jog around the neighborhood park",
  },
  {
    type: "nutrition",
    dateTime: "2024-08-09T09:00:00",
    title: "Healthy Breakfast",
    description: "Oatmeal with berries and a glass of fresh orange juice",
  },
  {
    type: "exercise",
    dateTime: "2024-08-09T12:00:00",
    title: "Lunchtime Yoga",
    description: "30-minute yoga session focusing on stretching and relaxation",
  },
  {
    type: "nutrition",
    dateTime: "2024-08-09T13:30:00",
    title: "Protein-packed Lunch",
    description:
      "Grilled chicken salad with mixed greens and balsamic dressing",
  },
  {
    type: "exercise",
    dateTime: "2024-08-09T17:00:00",
    title: "Strength Training",
    description: "45-minute weightlifting session focusing on upper body",
  },
  {
    type: "nutrition",
    dateTime: "2024-08-09T19:30:00",
    title: "Balanced Dinner",
    description: "Baked salmon with quinoa and steamed vegetables",
  },
  {
    type: "exercise",
    dateTime: "2024-08-10T08:00:00",
    title: "Swimming",
    description: "1-hour swim session at the local pool",
  },
  {
    type: "nutrition",
    dateTime: "2024-08-10T10:30:00",
    title: "Post-workout Smoothie",
    description: "Banana and spinach smoothie with protein powder",
  },
];
export type MockActivityData = (typeof mockActivityData)[number];
