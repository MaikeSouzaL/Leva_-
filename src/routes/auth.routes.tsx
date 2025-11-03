import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IntroScreen from "@screens/(public)/IntroScreen";
import SignInScreen from "@screens/(public)/SignInScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export default function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="IntroScreen" component={IntroScreen} />
      <Screen name="SignIn" component={SignInScreen} />
    </Navigator>
  );
}
