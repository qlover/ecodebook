import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DictHome from "../../Container/Main/DictHome";
import DictInfo from "../../Container/Main/DictInfo";

const Stack = createStackNavigator();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={DictHome} />
      <Stack.Screen name="DcitInfo" component={DictInfo} />
    </Stack.Navigator>
  );
}
