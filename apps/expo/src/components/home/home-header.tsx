import { View } from "react-native";

import { HomeCalendar } from "~/components/home/home-calendar";
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

export default function HomeHeader() {
  return (
    <View className="flex-row items-center justify-between px-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="flex-row items-center gap-2">
            <Calendar className="text-foreground" size={24} />
            <Text>TODAY</Text>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="rounded-none border-0"
          overlayClassName="justify-start px-0 py-safe"
          noClose
        >
          <View className="max-h-80">
            <HomeCalendar />
          </View>
          <DialogFooter className="flex-row-reverse">
            <Text>TIR</Text>
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
