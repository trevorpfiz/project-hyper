import React from "react";
import { View } from "react-native";

import { Text } from "~/components/ui/text";

const INTRO_DATA = [
  {
    key: "1",
    title: "App showcase ✨",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    key: "2",
    title: "Introduction screen 🎉",
    description:
      "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. ",
  },
  {
    key: "3",
    title: "And can be anything 🎈",
    description:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ",
  },
];

const TempWidget = () => {
  return (
    <View>
      {INTRO_DATA.map((item) => (
        <View key={item.key} className="p-4">
          <Text className="mb-2 text-xl font-bold">{item.title}</Text>
          <Text className="text-base">{item.description}</Text>
        </View>
      ))}
    </View>
  );
};

export { TempWidget };
