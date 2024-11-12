import type {
  CalendarProps,
  CalendarTheme,
} from "@marceloterreiro/flash-calendar";
import React from "react";
import { View } from "react-native";
import { Calendar, useCalendar } from "@marceloterreiro/flash-calendar";
import { format } from "date-fns";

import type { DailyRecap, GlucoseRangeTypes } from "@stable/db/schema";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { CALENDAR_THEME } from "~/lib/constants";
import { ChevronLeft } from "~/lib/icons/chevron-left";
import { ChevronRight } from "~/lib/icons/chevron-right";
import { useColorScheme } from "~/lib/use-color-scheme";
import { getGlucoseRangeColors } from "~/lib/utils";

const DAY_HEIGHT = 40;
const MONTH_HEADER_HEIGHT = 40;
const WEEK_DAYS_HEIGHT = 30;

interface BasicCalendarProps extends CalendarProps {
  onPreviousMonthPress: () => void;
  onNextMonthPress: () => void;
  dailyRecaps: DailyRecap[];
  rangeView: GlucoseRangeTypes;
}

export function BasicCalendar(props: BasicCalendarProps) {
  const { dailyRecaps, rangeView } = props;

  const { calendarRowMonth, weekDaysList, weeksList } = useCalendar(props);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? CALENDAR_THEME.dark : CALENDAR_THEME.light;

  const getColorForDay = (dayId: string) => {
    const recap = dailyRecaps.find(
      (r) => format(r.date, "yyyy-MM-dd") === dayId,
    );
    if (!recap?.timeInRanges) {
      return theme.text;
    }

    const timeInRange = recap.timeInRanges[rangeView];
    return getGlucoseRangeColors(timeInRange, isDark).text;
  };

  const calendarTheme: CalendarTheme = {
    rowMonth: {
      container: {
        height: MONTH_HEADER_HEIGHT,
        paddingHorizontal: 4,
      },
      content: {
        color: theme.text,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
      },
    },
    rowWeek: {
      container: {
        borderBottomWidth: 0,
      },
    },
    itemWeekName: {
      content: {
        color: theme.primary,
        opacity: 0.3,
        fontSize: 12,
        fontWeight: "bold",
      },
    },
    itemDay: {
      base: ({ isPressed, isDisabled, id }) => {
        const dayColor = getColorForDay(id);

        return {
          container: {
            padding: 0,
            borderRadius: DAY_HEIGHT / 2,
            backgroundColor: isPressed ? theme.highlight : "transparent",
          },
          content: {
            fontSize: 14,
            fontWeight: "bold",
            opacity: isDisabled ? 0.5 : 1,
            color: isDisabled ? theme.disabled : dayColor,
          },
        };
      },
      idle: () => {
        return {
          container: {
            // backgroundColor: isPressed ? theme.highlight : "transparent",
          },
          content: {
            // color: dayColor,
          },
        };
      },
      today: () => ({
        container: {
          borderColor: theme.primary,
          borderWidth: 1,
          padding: 0,
        },
        content: {},
      }),
      active: ({ isToday }) => ({
        container: {
          backgroundColor: theme.active,
          borderTopLeftRadius: DAY_HEIGHT / 2,
          borderTopRightRadius: DAY_HEIGHT / 2,
          borderBottomLeftRadius: DAY_HEIGHT / 2,
          borderBottomRightRadius: DAY_HEIGHT / 2,
          borderColor: theme.primary,
          borderWidth: isToday ? 1 : 0,
        },
        content: {},
      }),
    },
  };

  return (
    <View className="flex-1">
      <Calendar.VStack spacing={props.calendarRowVerticalSpacing}>
        <Calendar.HStack
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          style={calendarTheme.rowMonth?.container}
        >
          <Button
            onPress={props.onPreviousMonthPress}
            size={"icon"}
            className="bg-transparent active:opacity-50"
          >
            <ChevronLeft size={40} strokeWidth={1.5} color={theme.text} />
          </Button>
          <Text style={calendarTheme.rowMonth?.content}>
            {calendarRowMonth.toUpperCase()}
          </Text>
          <Button
            onPress={props.onNextMonthPress}
            size={"icon"}
            className="bg-transparent active:opacity-50"
          >
            <ChevronRight color={theme.text} size={40} strokeWidth={1.5} />
          </Button>
        </Calendar.HStack>

        <Calendar.Row.Week spacing={4}>
          {weekDaysList.map((day, i) => (
            <Calendar.Item.WeekName
              height={WEEK_DAYS_HEIGHT}
              key={i}
              theme={calendarTheme.itemWeekName}
            >
              {day.toUpperCase()}
            </Calendar.Item.WeekName>
          ))}
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
                    theme={calendarTheme.itemDay}
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
