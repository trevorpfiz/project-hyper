import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Text>Home Screen</Text>
      <Button />
    </SafeAreaView>
  );
}
