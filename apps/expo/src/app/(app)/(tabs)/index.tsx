import { SafeAreaView } from "react-native-safe-area-context";

import { DaySlider } from "~/components/home/day-slider";
import HomeHeader from "~/components/home/home-header";
import { Separator } from "~/components/ui/separator";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HomeHeader />
      <DaySlider />
      <Separator className="mb-4" />
      <Separator className="mx-auto mb-4 bg-red-500" orientation="vertical" />
    </SafeAreaView>
  );
}
