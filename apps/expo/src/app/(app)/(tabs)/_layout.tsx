import { TouchableOpacity, View } from "react-native";
import { Tabs } from "expo-router";
import colors from "tailwindcss/colors";

import { CircleUserRound } from "~/lib/icons/circle-user-round";
import { House } from "~/lib/icons/house";
import { Plus } from "~/lib/icons/plus";

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
                width: size + 10,
                height: size + 10,
                borderRadius: 9999,
                backgroundColor: colors.blue[600],
                justifyContent: "center",
                alignItems: "center",
                top: 10,
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
