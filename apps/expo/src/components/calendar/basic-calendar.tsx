import type {
  CalendarProps,
  CalendarTheme,
} from "@marceloterreiro/flash-calendar";
import React from "react";
import { View } from "react-native";
import { Calendar, useCalendar } from "@marceloterreiro/flash-calendar";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { NAV_THEME } from "~/lib/constants";
import { ChevronLeft } from "~/lib/icons/chevron-left";
import { ChevronRight } from "~/lib/icons/chevron-right";
import { useColorScheme } from "~/lib/use-color-scheme";

const DAY_HEIGHT = 40;
const MONTH_HEADER_HEIGHT = 40;
const WEEK_DAYS_HEIGHT = 30;

interface BasicCalendarProps extends CalendarProps {
  onPreviousMonthPress: () => void;
  onNextMonthPress: () => void;
}

export function BasicCalendar(props: BasicCalendarProps) {
  const { calendarRowMonth, weekDaysList, weeksList } = useCalendar(props);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? NAV_THEME.dark : NAV_THEME.light;

  const calendarTheme: CalendarTheme = {
    rowMonth: {
      container: {
        height: MONTH_HEADER_HEIGHT,
        backgroundColor: theme.background,
      },
      content: {
        color: theme.primary,
        fontSize: 16,
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
        color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
        fontSize: 12,
      },
    },
    itemDay: {
      base: () => ({
        container: {
          padding: 0,
          borderRadius: 0,
        },
      }),
      idle: ({ isPressed }) => ({
        container: {
          backgroundColor: isPressed ? theme.primary : "transparent",
          borderRadius: 0,
        },
        content: {
          color: theme.text,
          fontSize: 16,
        },
      }),
      today: ({ isPressed }) => ({
        container: {
          borderColor: theme.primary,
          borderWidth: 1,
          borderRadius: 0,
          backgroundColor: isPressed ? theme.primary : "transparent",
        },
        content: {
          color: theme.text,
          fontSize: 16,
        },
      }),
      active: () => ({
        container: {
          backgroundColor: theme.primary,
          borderRadius: 0,
        },
        content: {
          color: theme.background,
          fontSize: 16,
        },
      }),
    },
  };

  return (
    <View className="flex-1 bg-background">
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
            <ChevronLeft
              size={48}
              strokeWidth={1.5}
              className="text-foreground"
            />
          </Button>
          <Text style={calendarTheme.rowMonth?.content}>
            {calendarRowMonth.toUpperCase()}
          </Text>
          <Button
            onPress={props.onNextMonthPress}
            size={"icon"}
            className="bg-transparent active:opacity-50"
          >
            <ChevronRight
              className="text-foreground"
              size={48}
              strokeWidth={1.5}
            />
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
