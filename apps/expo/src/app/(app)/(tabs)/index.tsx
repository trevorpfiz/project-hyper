import { SafeAreaView } from "react-native-safe-area-context";

import HomeHeader from "~/components/home/home-header";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <HomeHeader />
    </SafeAreaView>
  );
}
