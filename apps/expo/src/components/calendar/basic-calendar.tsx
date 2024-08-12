import type {
  CalendarProps,
  CalendarTheme,
} from "@marceloterreiro/flash-calendar";
import React from "react";
import { View } from "react-native";
import { Calendar, useCalendar } from "@marceloterreiro/flash-calendar";
import colors from "tailwindcss/colors";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { mockScoresData } from "~/data/scores";
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

function getScoreColor(score: number) {
  if (score >= 70) return colors.green[500];
  if (score >= 50) return colors.yellow[500];
  return colors.red[500];
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
        paddingHorizontal: 4,
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
      base: ({ isPressed, isDisabled, id }) => {
        const score = mockScoresData.find((s) => s.date === id)?.value;
        const scoreColor = score ? getScoreColor(score) : theme.text;

        return {
          container: {
            padding: 0,
            borderRadius: DAY_HEIGHT / 2,
            backgroundColor: isPressed ? "transparent" : "transparent",
          },
          content: {
            fontSize: 14,
            fontWeight: "bold",
            opacity: isDisabled ? 0.5 : 1,
            color: isDisabled ? theme.disabled : scoreColor,
          },
        };
      },
      idle: ({ isPressed, id }) => {
        const score = mockScoresData.find((s) => s.date === id)?.value;
        const scoreColor = score ? getScoreColor(score) : theme.text;

        return {
          container: {
            backgroundColor: isPressed ? theme.primary : "transparent",
          },
          content: {
            color: scoreColor,
            // color: isPressed ? theme.background : theme.text,
          },
        };
      },
      today: ({ isPressed }) => ({
        container: {
          borderColor: theme.primary,
          borderWidth: 1,
          backgroundColor: isPressed ? theme.primary : "transparent",
          padding: 0,
        },
        content: {
          color: isPressed ? theme.background : theme.text,
        },
      }),
      active: () => ({
        container: {
          backgroundColor: theme.primary,
          borderTopLeftRadius: DAY_HEIGHT / 2,
          borderTopRightRadius: DAY_HEIGHT / 2,
          borderBottomLeftRadius: DAY_HEIGHT / 2,
          borderBottomRightRadius: DAY_HEIGHT / 2,
        },
        content: {
          color: theme.background,
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
              size={40}
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
              size={40}
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
