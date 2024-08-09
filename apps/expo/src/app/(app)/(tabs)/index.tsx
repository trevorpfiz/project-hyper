import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DaySlider } from "~/components/home/day-slider";
import HomeHeader from "~/components/home/home-header";
import { OverviewPager } from "~/components/home/overview-pager";
import { Separator } from "~/components/ui/separator";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <HomeHeader />

        <View>
          <DaySlider />
          <Separator />
          {/* <Separator className="mx-auto mb-4 bg-red-500" orientation="vertical" /> */}
        </View>

        <View className="h-64">
          <OverviewPager />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
