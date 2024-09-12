import { View } from "react-native";
import { DateTime } from "luxon";

import { HomeCalendar } from "~/components/calendar/home-calendar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";
import { IndeterminateProgressBar } from "~/components/ui/indeterminate-progress";
import { Text } from "~/components/ui/text";
import { CALENDAR_THEME } from "~/lib/constants";
import { Bell } from "~/lib/icons/bell";
import { Calendar } from "~/lib/icons/calendar";
import { useColorScheme } from "~/lib/use-color-scheme";
import { useDateStore } from "~/stores/date-store";
import { api } from "~/utils/api";

export default function HomeHeader() {
  const { selectedDate, isCalendarOpen, setIsCalendarOpen } = useDateStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? CALENDAR_THEME.dark : CALENDAR_THEME.light;

  const { isPending } = api.recap.all.useQuery();

  const formattedDate = selectedDate.hasSame(DateTime.local(), "day")
    ? "Today"
    : selectedDate.toFormat("MMMM dd, yyyy");

  return (
    <View className="flex-row items-center justify-between px-2">
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="flex-row items-center gap-2">
            <Calendar className="text-foreground" size={24} />
            <Text>{formattedDate}</Text>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="pt-safe max-h-[32rem] max-w-full flex-1 rounded-none border-0 px-0 pb-0"
          overlayClassName="justify-start p-0"
          style={{ backgroundColor: theme.background }}
          noClose
        >
          <View className="flex-1 px-1">
            <HomeCalendar />
          </View>

          {/* FIXME: style bug under indeterminate progress bar if height is not set? */}
          <DialogFooter className="h-11 flex-col gap-4">
            <View className="w-full flex-row justify-end gap-1 px-4">
              <Text className="font-semibold" style={{ color: theme.bad.text }}>
                {"\u2022 <50"}
              </Text>
              <Text className="font-semibold" style={{ color: theme.ok.text }}>
                {"\u2022 50-69"}
              </Text>
              <Text
                className="font-semibold"
                style={{ color: theme.good.text }}
              >
                {"\u2022 >=70"}
              </Text>
            </View>

            <View className="h-1 w-full">
              {isPending && <IndeterminateProgressBar />}
            </View>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        className="active:bg-transparent active:opacity-50"
      >
        <Bell className="text-foreground" size={24} />
      </Button>
    </View>
  );
}
