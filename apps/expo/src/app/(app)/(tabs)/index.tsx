import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import MyChart from "~/components/charts/line-chart";
import { DaySlider } from "~/components/home/day-slider";
import HomeHeader from "~/components/home/home-header";
import { OverviewPager } from "~/components/home/overview-pager";
import Timeline from "~/components/home/timeline";
import { Separator } from "~/components/ui/separator";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <HomeHeader />

        {/* Metabolic Scores Slider */}
        <View>
          <DaySlider />
          <Separator />
          {/* <Separator className="mx-auto mb-4 bg-red-500" orientation="vertical" /> */}
        </View>

        {/* Overview Pager */}
        <View className="h-64">
          <OverviewPager />
        </View>

        {/* CGM Chart */}
        <MyChart />

        {/* Timeline */}
        <Timeline />

        {/* Zones */}
      </ScrollView>
    </SafeAreaView>
  );
}
