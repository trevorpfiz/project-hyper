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
import { Bell } from "~/lib/icons/bell";
import { Calendar } from "~/lib/icons/calendar";
import { useDateStore } from "~/stores/dateStore";

export default function HomeHeader() {
  const { selectedDate, isCalendarOpen, setIsCalendarOpen } = useDateStore();

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
          className="rounded-none border-0 p-0"
          overlayClassName="justify-start p-0"
          noClose
        >
          <HomeCalendar />
          <DialogFooter className="flex-row-reverse p-4">
            <Text className="font-semibold text-green-500">{`\u2022 >=70`}</Text>
            <Text className="font-semibold text-yellow-500">{`\u2022 50-69`}</Text>
            <Text className="font-semibold text-red-500">{`\u2022 <50`}</Text>
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
