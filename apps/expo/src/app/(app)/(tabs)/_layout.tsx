import { TouchableOpacity, View } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import { Tabs } from "expo-router";
import * as TaskManager from "expo-task-manager";
import colors from "tailwindcss/colors";

import { CircleUserRound } from "~/lib/icons/circle-user-round";
import { House } from "~/lib/icons/house";
import { Plus } from "~/lib/icons/plus";
import {
  BACKGROUND_FETCH_DEXCOM_SYNC,
  syncDexcomData,
} from "~/utils/background";

// TODO: test background-fetch on iOS and Android
// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
// TaskManager.defineTask(BACKGROUND_FETCH_DEXCOM_SYNC, async () => {
//   console.log(
//     `Background fetch for Dexcom sync started at: ${new Date().toISOString()}`,
//   );

//   try {
//     const result = await syncDexcomData();
//     console.log(
//       `Background fetch for Dexcom sync completed with result: ${result}`,
//     );
//     return result;
//   } catch (error) {
//     console.error("Error in Dexcom sync background task:", error);
//     return BackgroundFetch.BackgroundFetchResult.Failed;
//   }
// });

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarButton: (props) => <TouchableOpacity {...props} />,
          tabBarIcon: ({ size, color }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Log",
          tabBarLabel: "",
          tabBarButton: (props) => <TouchableOpacity {...props} />,
          tabBarIcon: ({ size }) => (
            <View
              style={{
                width: size + 20,
                height: size + 20,
                borderRadius: 9999,
                backgroundColor: colors.blue[600],
                justifyContent: "center",
                alignItems: "center",
                top: 12,
              }}
            >
              <Plus size={size} color="white" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarButton: (props) => <TouchableOpacity {...props} />,
          tabBarIcon: ({ size, color }) => (
            <CircleUserRound size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
