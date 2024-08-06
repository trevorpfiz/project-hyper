import { useState } from "react";
import { Text, View } from "react-native";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";

const today = toDateId(new Date());

export function BasicCalendar() {
  const [selectedDate, setSelectedDate] = useState(today);
  return (
    <View>
      <Text>Selected date: {selectedDate}</Text>
      <Calendar
        calendarActiveDateRanges={[
          {
            startId: selectedDate,
            endId: selectedDate,
          },
        ]}
        calendarMonthId={today}
        onCalendarDayPress={setSelectedDate}
      />
    </View>
  );
}
