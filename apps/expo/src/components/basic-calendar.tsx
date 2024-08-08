import type { CalendarProps } from "@marceloterreiro/flash-calendar";
import { View } from "react-native";
import { Calendar, useCalendar } from "@marceloterreiro/flash-calendar";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ChevronLeft } from "~/lib/icons/chevron-left";
import { ChevronRight } from "~/lib/icons/chevron-right";

const DAY_HEIGHT = 25;
const MONTH_HEADER_HEIGHT = 40;
const WEEK_DAYS_HEIGHT = 25;
const FOOTER_HEIGHT = 30;

const BORDER_WIDTH = 1;

interface BasicCalendarProps extends CalendarProps {
  onPreviousMonthPress: () => void;
  onNextMonthPress: () => void;
}

export function BasicCalendar(props: BasicCalendarProps) {
  const { calendarRowMonth, weekDaysList, weeksList } = useCalendar(props);

  return (
    <View>
      <Calendar.VStack spacing={props.calendarRowVerticalSpacing}>
        {/* Replaces `Calendar.Row.Month` with a custom implementation */}
        <Calendar.HStack
          alignItems="center"
          justifyContent="space-around"
          width="100%"
        >
          <Button
            onPress={props.onPreviousMonthPress}
            size={"icon"}
            className="bg-transparent active:opacity-50"
          >
            <ChevronLeft className="text-foreground" size={48} />
          </Button>
          <Text>{calendarRowMonth.toUpperCase()}</Text>
          <Button
            onPress={props.onNextMonthPress}
            size={"icon"}
            className="bg-transparent active:opacity-50"
          >
            <ChevronRight className="text-foreground" size={48} />
          </Button>
        </Calendar.HStack>

        <Calendar.Row.Week spacing={4}>
          {weekDaysList.map((day, i) => (
            <Calendar.Item.WeekName height={WEEK_DAYS_HEIGHT} key={i}>
              {day.toUpperCase()}
            </Calendar.Item.WeekName>
          ))}
          <View />
        </Calendar.Row.Week>

        {weeksList.map((week, i) => (
          <Calendar.Row.Week key={i}>
            {week.map((day) => {
              if (day.isDifferentMonth) {
                return (
                  <Calendar.Item.Day.Container
                    dayHeight={DAY_HEIGHT}
                    daySpacing={4}
                    isStartOfWeek={day.isStartOfWeek}
                    key={day.id}
                  >
                    <Calendar.Item.Empty height={DAY_HEIGHT} />
                  </Calendar.Item.Day.Container>
                );
              }

              return (
                <Calendar.Item.Day.Container
                  dayHeight={DAY_HEIGHT}
                  daySpacing={4}
                  isStartOfWeek={day.isStartOfWeek}
                  key={day.id}
                >
                  <Calendar.Item.Day
                    height={DAY_HEIGHT}
                    metadata={day}
                    onPress={props.onCalendarDayPress}
                  >
                    {day.displayLabel}
                  </Calendar.Item.Day>
                </Calendar.Item.Day.Container>
              );
            })}
          </Calendar.Row.Week>
        ))}
      </Calendar.VStack>
    </View>
  );
}
