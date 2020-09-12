import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserSignup from "../../Container/UserSignup";
import UserLogin from "../../Container/UserLogin";

const Stack = createStackNavigator();

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="login" component={UserLogin} />
      <Stack.Screen name="register" component={UserSignup} />
    </Stack.Navigator>
  );
}
