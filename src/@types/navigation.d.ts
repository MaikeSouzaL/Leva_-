import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      IntroScreen: undefined;
      SignIn: {
        Email?: string;
        animation?: NativeStackNavigationOptions["animation"];
      };
    }
  }
}
