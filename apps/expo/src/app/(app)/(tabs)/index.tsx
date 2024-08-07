import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BasicCalendar } from "~/components/calendar";
import { HomeCalendar } from "~/components/home/home-calendar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Text>Home Screen</Text>
      <Button>
        <Text>Today</Text>
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Text>Open Calendar</Text>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="rounded-none border-0"
          overlayClassName="justify-start p-0"
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
    </SafeAreaView>
  );
}
