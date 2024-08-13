import { View } from "react-native";
import { format, isToday } from "date-fns";

import { HomeCalendar } from "~/components/calendar/home-calendar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { CALENDAR_THEME } from "~/lib/constants";
import { Bell } from "~/lib/icons/bell";
import { Calendar } from "~/lib/icons/calendar";
import { useColorScheme } from "~/lib/use-color-scheme";
import { useDateStore } from "~/stores/data-store";

export default function HomeHeader() {
  const { selectedDate, isCalendarOpen, setIsCalendarOpen } = useDateStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? CALENDAR_THEME.dark : CALENDAR_THEME.light;

  const formattedDate = isToday(selectedDate)
    ? "Today"
    : format(selectedDate, "MMMM do, yyyy");

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
          className="pt-safe max-h-[32rem] max-w-full flex-1 rounded-none border-0 px-1 pb-0"
          overlayClassName="justify-start p-0"
          style={{ backgroundColor: theme.background }}
          noClose
        >
          <HomeCalendar />
          <DialogFooter className="flex-row-reverse px-4 pb-4">
            <Text className="font-semibold" style={{ color: theme.good.text }}>
              {"\u2022 >=70"}
            </Text>
            <Text className="font-semibold" style={{ color: theme.ok.text }}>
              {"\u2022 50-69"}
            </Text>
            <Text className="font-semibold" style={{ color: theme.bad.text }}>
              {"\u2022 <50"}
            </Text>
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
