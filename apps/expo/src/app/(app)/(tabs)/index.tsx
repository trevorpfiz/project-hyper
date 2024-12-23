import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import CGMChart from "~/components/charts/cgm-chart";
import BloodSugarWidget from "~/components/home/blood-sugar-widget";
import { DaySlider } from "~/components/home/day-slider";
import HomeHeader from "~/components/home/home-header";
import { MacrosWidget } from "~/components/home/macros-widget";
import { OverviewPager } from "~/components/home/overview-pager";
import Timeline from "~/components/home/timeline";
import { Separator } from "~/components/ui/separator";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      {/* Header */}
      <HomeHeader />

      {/* Metabolic Scores Slider */}
      <View>
        <DaySlider />
        <Separator />
        {/* <Separator className="mx-auto mb-4 bg-red-500" orientation="vertical" /> */}
      </View>

      {/* Main Content */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true}>
        {/* Overview Pager */}
        <View className="h-64 flex-1">
          <OverviewPager>
            <BloodSugarWidget />
            <MacrosWidget />
          </OverviewPager>
        </View>

        {/* CGM Chart */}
        <View className="flex-1">
          <CGMChart />
        </View>

        {/* Timeline */}
        <View className="flex-1">
          <Timeline />
        </View>

        {/* Zones */}
      </ScrollView>
    </SafeAreaView>
  );
}
